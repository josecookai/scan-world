import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { User } from "@/types"

/**
 * Returns the currently authenticated app-level user profile, or null.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single()

  return (data as User) ?? null
}

/**
 * Returns the current user, or redirects to /login if not authenticated.
 */
export async function requireUser(): Promise<User> {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

/**
 * Returns the current user if they are an admin, or redirects to / otherwise.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  if (user.role !== "admin") {
    redirect("/")
  }
  return user
}
