import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { isYouTubeUrl, extractYouTubeVideoId, fetchYouTubeMetadata } from "@/lib/platforms/youtube"
import { isTikTokUrl, extractTikTokVideoId, fetchTikTokMetadata } from "@/lib/platforms/tiktok"

/** Checks whether the #scanworld{code} tag appears in a string. */
function containsVerificationCode(text: string | null | undefined, code: number): boolean {
  if (!text) return false
  return text.includes(`#scanworld${code}`)
}

/** Normalizes a raw URL to ensure it has a protocol. */
function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid request body" }, { status: 400 })
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("url" in body) ||
    typeof (body as Record<string, unknown>).url !== "string"
  ) {
    return NextResponse.json({ valid: false, error: "Missing url field" }, { status: 400 })
  }

  const rawUrl = ((body as Record<string, unknown>).url as string).trim()

  if (!rawUrl) {
    return NextResponse.json({ valid: false, error: "URL is required" })
  }

  const url = normalizeUrl(rawUrl)

  // Fetch the authenticated user's verification code
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let verificationCode: number | null = null
  if (authUser) {
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    const { data: profile } = await serviceClient
      .from("users")
      .select("verification_code")
      .eq("id", authUser.id)
      .single()
    verificationCode = profile?.verification_code ?? null
  }

  if (isYouTubeUrl(url)) {
    const video_id = extractYouTubeVideoId(url)!
    const meta = await fetchYouTubeMetadata(url)
    const thumbnail_url = meta?.thumbnail_url ?? `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`

    // Ownership verification via YouTube Data API (if key is configured)
    if (verificationCode !== null) {
      const apiKey = process.env.YOUTUBE_API_KEY
      if (apiKey) {
        try {
          const ytRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(video_id)}&key=${apiKey}`
          )
          if (ytRes.ok) {
            const ytData = await ytRes.json() as {
              items?: Array<{ snippet?: { description?: string } }>
            }
            const description = ytData.items?.[0]?.snippet?.description ?? null
            if (!containsVerificationCode(description, verificationCode)) {
              return NextResponse.json({
                valid: false,
                error: `Add #scanworld${verificationCode} to your YouTube video description first, then submit`,
              })
            }
          }
        } catch {
          // YouTube API call failed — fall through; admin will review manually
        }
      } else {
        // No API key: flag for manual admin review (do not block submission)
        return NextResponse.json({
          valid: true,
          platform: "youtube",
          video_id,
          title: meta?.title ?? null,
          thumbnail_url,
          ownership_check: "manual_review",
        })
      }
    }

    return NextResponse.json({
      valid: true,
      platform: "youtube",
      video_id,
      title: meta?.title ?? null,
      thumbnail_url,
    })
  }

  if (isTikTokUrl(url)) {
    const video_id = extractTikTokVideoId(url)
    const meta = await fetchTikTokMetadata(url)

    // Ownership verification: TikTok oEmbed includes hashtags in title
    if (verificationCode !== null && meta) {
      if (!containsVerificationCode(meta.title, verificationCode)) {
        return NextResponse.json({
          valid: false,
          error: `Add #scanworld${verificationCode} as a hashtag in your TikTok caption first, then submit`,
        })
      }
    }

    return NextResponse.json({
      valid: true,
      platform: "tiktok",
      video_id: video_id ?? null,
      title: meta?.title ?? null,
      thumbnail_url: meta?.thumbnail_url ?? null,
    })
  }

  return NextResponse.json({
    valid: false,
    error: "URL must be a valid YouTube or TikTok link",
  })
}
