import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  // Verify authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  // Verify admin role via server-side query
  const { data: adminUser, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userError || !adminUser || adminUser.role !== "admin") {
    return Response.json({ success: false, error: "Forbidden" }, { status: 403 })
  }

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayISO = todayStart.toISOString()

  const [
    pendingResult,
    acceptedTodayResult,
    rejectedTodayResult,
    totalVideosResult,
    avgScoreResult,
  ] = await Promise.all([
    supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "accepted").gte("reviewed_at", todayISO),
    supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "rejected").gte("reviewed_at", todayISO),
    supabase.from("submissions").select("id", { count: "exact", head: true }),
    supabase.from("submissions").select("quality_score").eq("status", "accepted").not("quality_score", "is", null),
  ])

  let avgQualityScore: number | null = null
  if (avgScoreResult.data && avgScoreResult.data.length > 0) {
    const total = avgScoreResult.data.reduce((sum, row) => sum + (row.quality_score ?? 0), 0)
    avgQualityScore = Math.round(total / avgScoreResult.data.length)
  }

  return Response.json({
    success: true,
    data: {
      pending_count: pendingResult.count ?? 0,
      accepted_today: acceptedTodayResult.count ?? 0,
      rejected_today: rejectedTodayResult.count ?? 0,
      total_videos: totalVideosResult.count ?? 0,
      avg_quality_score: avgQualityScore,
    },
    error: null,
  })
}
