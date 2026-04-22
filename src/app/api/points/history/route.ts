import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ApiResponse, PointEvent } from "@/types"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    const body: ApiResponse<null> = { success: false, data: null, error: "Unauthorized" }
    return Response.json(body, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("point_events")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    const body: ApiResponse<null> = { success: false, data: null, error: error.message }
    return Response.json(body, { status: 500 })
  }

  const body: ApiResponse<PointEvent[]> = {
    success: true,
    data: (data ?? []) as PointEvent[],
    error: null,
    meta: {
      total: count ?? 0,
      page,
      limit,
    },
  }
  return Response.json(body)
}
