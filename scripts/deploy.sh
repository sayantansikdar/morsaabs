#!/usr/bin/env bash
#
# Deploy Morsaab's to AWS: SAM builds and pushes the backend stack, then the
# React bundle is synced to the stack's S3 bucket and the CDN is invalidated.
#
# First run:  sam deploy --guided   (writes samconfig.toml, then use this script)
#
set -euo pipefail

STACK_NAME="${STACK_NAME:-morsaabs}"
REGION="${AWS_REGION:-ap-south-1}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT"

echo "==> Building backend"
sam build

echo "==> Deploying stack: $STACK_NAME ($REGION)"
if [ -f samconfig.toml ]; then
  sam deploy
else
  sam deploy --guided --stack-name "$STACK_NAME" --region "$REGION"
fi

output() {
  aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}

BUCKET="$(output SiteBucketName)"
DISTRIBUTION="$(output DistributionId)"
SITE_URL="$(output SiteUrl)"

echo "==> Building frontend"
cd "$ROOT/frontend"
npm ci
# Same-origin API via CloudFront. Exported here as well as in .env.production
# because a shell variable beats any .env file, whatever the load order.
REACT_APP_BACKEND_URL="" npm run build

echo "==> Syncing to s3://$BUCKET"
# Hashed assets are immutable and cached hard; index.html must never be, or
# visitors keep loading a stale bundle after a deploy.
aws s3 sync build/ "s3://$BUCKET" --delete \
  --exclude index.html --cache-control "public,max-age=31536000,immutable"
aws s3 cp build/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

echo "==> Invalidating CloudFront"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" --paths '/*' --output text >/dev/null

echo
echo "Deployed: $SITE_URL"
