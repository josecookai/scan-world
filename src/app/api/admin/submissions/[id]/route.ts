import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

function calculatePoints(
  qualityScore: number,
  deviceType: string | null,
  locationCountry: string | null,
  category: string | null
): number {
  const base = qualityScore * 2
  let deviceBonus = 0
  if (deviceType === "iphone" || deviceType === "gopro" || deviceType === "insta360") {
    deviceBonus = 50
  } else if (deviceType === "android") {
    deviceBonus = 20
  }
  const locationBonus = locationCountry ? 25 : 0
  const categoryBonus = category ? 25 : 0
  return base + deviceBonus + locationBonus + categoryBonus
}

function tierFromPoints(points: number): string {
  if (points >= 10000) return "world_scanner"
  if (points >= 5000) return "field_agent"
  if (points >= 2000) return "correspondent"
  if (points >= 500) return "explorer"
  return "scout"
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // Verify authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  // Verify admin role via server-side query — never trust client claims
  const { data: adminUser, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userError || !adminUser || adminUser.role !== "admin") {
    return Response.json({ success: false, error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  let body: { status: string; quality_score?: number; reason?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }

  const { status, quality_score, reason } = body

  if (!["accepted", "rejected", "flagged"].includes(status)) {
    return Response.json({ success: false, error: "Invalid status" }, { status: 400 })
  }

  if (status === "accepted") {
    if (quality_score === undefined || quality_score < 0 || quality_score > 100) {
      return Response.json(
        { success: false, error: "quality_score must be 0-100 for accepted submissions" },
        { status: 400 }
      )
    }

    // Fetch submission to get device/location/category for point calculation
    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("user_id, device_type, location_country, category")
      .eq("id", id)
      .single()

    if (fetchError || !submission) {
      return Response.json({ success: false, error: "Submission not found" }, { status: 404 })
    }

    const pointsAwarded = calculatePoints(
      quality_score,
      submission.device_type,
      submission.location_country,
      submission.category
    )

    const now = new Date().toISOString()

    // Update submission — award immediately for MVP, set points_awarded_at = now
    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        status: "accepted",
        quality_score,
        reviewed_at: now,
        points_awarded: pointsAwarded,
        points_awarded_at: now,
      })
      .eq("id", id)

    if (updateError) {
      return Response.json({ success: false, error: updateError.message }, { status: 500 })
    }

    // Insert point event
    const { error: eventError } = await supabase.from("point_events").insert({
      user_id: submission.user_id,
      amount: pointsAwarded,
      reason: "Video accepted",
      metadata: { submission_id: id, quality_score },
    })

    if (eventError) {
      return Response.json({ success: false, error: eventError.message }, { status: 500 })
    }

    // Fetch current user points for tier recalculation
    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("points")
      .eq("id", submission.user_id)
      .single()

    if (currentUserError || !currentUser) {
      return Response.json({ success: false, error: "User not found" }, { status: 500 })
    }

    const newPoints = (currentUser.points ?? 0) + pointsAwarded
    const newTier = tierFromPoints(newPoints)

    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ points: newPoints, tier: newTier })
      .eq("id", submission.user_id)

    if (userUpdateError) {
      return Response.json({ success: false, error: userUpdateError.message }, { status: 500 })
    }

    return Response.json({ success: true, data: { points_awarded: pointsAwarded }, error: null })
  }

  // rejected or flagged
  const updateData: Record<string, string> = {
    status,
    reviewed_at: new Date().toISOString(),
  }
  if (reason) {
    updateData.rejection_reason = reason
  }

  const { error: updateError } = await supabase
    .from("submissions")
    .update(updateData)
    .eq("id", id)

  if (updateError) {
    return Response.json({ success: false, error: updateError.message }, { status: 500 })
  }

  return Response.json({ success: true, data: null, error: null })
}
