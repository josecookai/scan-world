import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ApiResponse, User } from "@/types"

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    const body: ApiResponse<null> = { success: false, data: null, error: "Unauthorized" }
    return Response.json(body, { status: 401 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    const body: ApiResponse<null> = { success: false, data: null, error: "Invalid JSON body" }
    return Response.json(body, { status: 400 })
  }

  if (typeof payload !== "object" || payload === null) {
    const body: ApiResponse<null> = { success: false, data: null, error: "Invalid request body" }
    return Response.json(body, { status: 400 })
  }

  const allowed = ["username", "bio", "country", "avatar_url"] as const
  type AllowedKey = (typeof allowed)[number]
  const updates: Partial<Pick<User, AllowedKey>> = {}

  for (const key of allowed) {
    if (key in (payload as Record<string, unknown>)) {
      const val = (payload as Record<string, unknown>)[key]
      if (val === null || typeof val === "string") {
        (updates as Record<string, unknown>)[key] = val
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    const body: ApiResponse<null> = { success: false, data: null, error: "No valid fields to update" }
    return Response.json(body, { status: 400 })
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    const body: ApiResponse<null> = { success: false, data: null, error: error.message }
    return Response.json(body, { status: 500 })
  }

  const body: ApiResponse<User> = { success: true, data: data as User, error: null }
  return Response.json(body)
}
