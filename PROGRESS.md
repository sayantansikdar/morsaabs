# Development Progress
- Week 1: Project setup and backend foundation
- Week 2: Frontend UI components and design system
- Week 3: API integration and testing
- Week 4: Optimization and deployment preparation
- 2026-08-15: Migrated from MongoDB to a serverless AWS stack — FastAPI on
  Lambda, DynamoDB, and CloudFront in front of S3, defined in `template.yaml`.
  Added the first automated test suite and replaced the GitHub Pages workflow
  (which uploaded the repo root and could never have served the React build)
  with CI that runs tests, builds the frontend and lints the SAM template.
