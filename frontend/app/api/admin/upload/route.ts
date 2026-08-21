import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getAdminActor } from '@/lib/admin-auth'

/**
 * Issues short-lived upload tokens for dish photography.
 *
 * The browser uploads straight to Vercel Blob rather than posting the file
 * through this route: a serverless function has a ~4.5 MB request body limit,
 * which a photo off a phone will exceed. This endpoint only decides *whether*
 * an upload may happen and under what constraints.
 *
 * That makes it the whole of the access control. A token handed out here can
 * write to the store, so the admin check runs before one is minted — and again
 * inside onBeforeGenerateToken, which is the callback that actually authorises
 * the write. An unauthenticated caller gets nothing.
 *
 * Constraints are set server-side (type and size), because anything the client
 * claims about a file is a claim, not a fact.
 */

export const dynamic = 'force-dynamic'

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB — generous for a plated dish.

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Photo uploads are not configured on this deployment.' },
      { status: 503 }
    )
  }

  // First gate: no admin, no token. Checked here so an anonymous request is
  // refused before any of the upload machinery runs.
  const actor = await getAdminActor()
  if (!actor) return NextResponse.json({ error: 'Not authorised.' }, { status: 403 })

  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Second gate. This callback is what mints the credential, so it
        // re-checks rather than trusting that the check above still holds.
        const stillAdmin = await getAdminActor()
        if (!stillAdmin) throw new Error('Not authorised.')

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          // Two dishes photographed as "curry.jpg" must not overwrite one
          // another, and a guessable URL invites scraping the store.
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ actorId: stillAdmin.id }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Vercel calls this from its own infrastructure, so it never fires
        // against localhost. Nothing depends on it: the browser receives the
        // URL directly and saves it through the normal menu-item action.
        console.info('[upload] stored', blob.pathname, 'by', tokenPayload)
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: message === 'Not authorised.' ? 403 : 400 })
  }
}
