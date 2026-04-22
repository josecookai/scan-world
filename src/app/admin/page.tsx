import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/admin/stats`,
    { cache: "no-store" }
  )
  if (!res.ok) return null
  const json = await res.json()
  return json.success ? json.data : null
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  const stats = await getStats()

  const kpiCards = [
    {
      label: "Pending Submissions",
      value: stats?.pending_count ?? "—",
      color: "text-yellow-400",
      bg: "bg-yellow-400/5 border-yellow-400/20",
      href: "/admin/review",
    },
    {
      label: "Accepted Today",
      value: stats?.accepted_today ?? "—",
      color: "text-green-400",
      bg: "bg-green-400/5 border-green-400/20",
      href: "/admin/submissions",
    },
    {
      label: "Rejected Today",
      value: stats?.rejected_today ?? "—",
      color: "text-red-400",
      bg: "bg-red-400/5 border-red-400/20",
      href: "/admin/submissions",
    },
    {
      label: "Total Videos",
      value: stats?.total_videos ?? "—",
      color: "text-violet-400",
      bg: "bg-violet-400/5 border-violet-400/20",
      href: "/admin/submissions",
    },
    {
      label: "Avg Quality Score",
      value: stats?.avg_quality_score !== null ? `${stats?.avg_quality_score}/100` : "—",
      color: "text-cyan-400",
      bg: "bg-cyan-400/5 border-cyan-400/20",
      href: "/admin/submissions",
    },
  ]

  const quickLinks = [
    {
      href: "/admin/review",
      title: "Review Queue",
      desc: "Score and moderate pending submissions",
      accent: "text-yellow-400",
      border: "border-yellow-400/20 hover:border-yellow-400/40",
    },
    {
      href: "/admin/submissions",
      title: "Submissions Table",
      desc: "Browse all submissions with filters and search",
      accent: "text-violet-400",
      border: "border-violet-400/20 hover:border-violet-400/40",
    },
    {
      href: "/admin/users",
      title: "Users Table",
      desc: "Manage users, view tiers and points",
      accent: "text-cyan-400",
      border: "border-cyan-400/20 hover:border-cyan-400/40",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Moderation and scoring overview</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`rounded-2xl border p-5 flex flex-col gap-2 transition-all hover:scale-[1.02] ${card.bg}`}
          >
            <span className="text-xs text-zinc-500 font-medium">{card.label}</span>
            <span className={`text-3xl font-bold ${card.color}`}>{card.value}</span>
          </Link>
        ))}
      </div>

      {/* Quick nav */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Quick Access
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-2xl border bg-zinc-900 p-6 flex flex-col gap-2 transition-all hover:bg-zinc-800 ${link.border}`}
            >
              <span className={`font-semibold text-lg ${link.accent}`}>{link.title}</span>
              <span className="text-zinc-500 text-sm">{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
