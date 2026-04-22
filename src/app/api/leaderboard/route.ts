import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ApiResponse, User } from "@/types"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = request.nextUrl
  const country = searchParams.get("country")
  const period = searchParams.get("period") ?? "all-time"

  let query = supabase
    .from("users")
    .select("id, username, avatar_url, country, points, tier")
    .order("points", { ascending: false })
    .limit(100)

  if (country) {
    query = query.eq("country", country.toUpperCase())
  }

  if (period === "monthly") {
    // Filter to users who have had point events this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    // Monthly leaderboard: filter by users updated this month
    query = query.gte("updated_at", startOfMonth.toISOString())
  }

  const { data, error } = await query

  if (error) {
    const body: ApiResponse<null> = { success: false, data: null, error: error.message }
    return Response.json(body, { status: 500 })
  }

  const body: ApiResponse<Partial<User>[]> = {
    success: true,
    data: (data ?? []) as Partial<User>[],
    error: null,
    meta: { total: data?.length ?? 0, period, country: country ?? null },
  }
  return Response.json(body)
}
