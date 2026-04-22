import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import SubmitForm from "./SubmitForm"

export const dynamic = "force-dynamic"

export default async function SubmitPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/submit")
  }

  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data: profile } = await serviceClient
    .from("users")
    .select("verification_code")
    .eq("id", user.id)
    .single()

  // Fallback: if verification_code is somehow missing (shouldn't happen post-migration)
  const verificationCode: number = profile?.verification_code ?? 0

  return <SubmitForm verificationCode={verificationCode} />
}
