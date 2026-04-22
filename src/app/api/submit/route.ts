import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { isYouTubeUrl, extractYouTubeVideoId, fetchYouTubeMetadata } from "@/lib/platforms/youtube"
import { isTikTokUrl, extractTikTokVideoId, fetchTikTokMetadata } from "@/lib/platforms/tiktok"
import type { DeviceType, SubmissionCategory } from "@/types"

interface SubmitBody {
  url: string
  device_type: DeviceType
  location_country: string
  location_city?: string
  category: SubmissionCategory
  description?: string
}

function isValidSubmitBody(body: unknown): body is SubmitBody {
  if (typeof body !== "object" || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.url === "string" &&
    typeof b.device_type === "string" &&
    typeof b.location_country === "string" &&
    typeof b.category === "string"
  )
}

export async function POST(request: NextRequest) {
  // Auth check via anon client (reads session cookie)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }

  if (!isValidSubmitBody(body)) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
  }

  const url = body.url.trim()

  // Re-validate URL server-side
  let platform: "youtube" | "tiktok"
  let video_id: string | null
  let title: string | null = null
  let thumbnail_url: string | null = null

  if (isYouTubeUrl(url)) {
    platform = "youtube"
    video_id = extractYouTubeVideoId(url)
    const meta = await fetchYouTubeMetadata(url)
    title = meta?.title ?? null
    thumbnail_url =
      meta?.thumbnail_url ??
      (video_id ? `https://img.youtube.com/vi/${video_id}/hqdefault.jpg` : null)
  } else if (isTikTokUrl(url)) {
    platform = "tiktok"
    video_id = extractTikTokVideoId(url)
    const meta = await fetchTikTokMetadata(url)
    title = meta?.title ?? null
    thumbnail_url = meta?.thumbnail_url ?? null
  } else {
    return NextResponse.json(
      { success: false, error: "URL must be a valid YouTube or TikTok link" },
      { status: 400 }
    )
  }

  if (!video_id) {
    return NextResponse.json({ success: false, error: "Could not extract video ID from URL" }, { status: 400 })
  }

  // Use service role key for writes
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // Direct insert — let DB unique constraint catch duplicates
  const { data: submission, error } = await serviceClient
    .from("submissions")
    .insert({
      user_id: user.id,
      platform,
      video_url: url,
      video_id,
      title,
      thumbnail_url,
      location_country: body.location_country,
      location_city: body.location_city ?? null,
      category: body.category,
      description: body.description ?? null,
      device_type: body.device_type,
      status: "pending",
    })
    .select("id")
    .single()

  if (error) {
    // 23505 = unique_violation (duplicate video_url)
    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, error: "This video has already been submitted" },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Failed to save submission" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, submission_id: submission.id })
}
