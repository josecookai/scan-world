"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { User, PointEvent, Submission, UserTier } from "@/types"
import TierProgress from "@/components/TierProgress"
import SubmissionCard from "@/components/SubmissionCard"

export const dynamic = "force-dynamic"

const TIER_THRESHOLDS: Record<UserTier, number> = {
  scout: 0,
  explorer: 500,
  correspondent: 2000,
  field_agent: 10000,
  world_scanner: 50000,
}

const TIER_CONFIG: Record<UserTier, { emoji: string; label: string; color: string; bg: string }> = {
  scout: { emoji: "🔍", label: "Scout", color: "text-zinc-400", bg: "bg-zinc-400/10" },
  explorer: { emoji: "🌍", label: "Explorer", color: "text-green-400", bg: "bg-green-400/10" },
  correspondent: { emoji: "📡", label: "Correspondent", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  field_agent: { emoji: "🛰️", label: "Field Agent", color: "text-purple-400", bg: "bg-purple-400/10" },
  world_scanner: { emoji: "🌐", label: "World Scanner", color: "text-amber-400", bg: "bg-amber-400/10" },
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return value
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function PointsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<PointEvent[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const animatedPoints = useCountUp(user?.points ?? 0)

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        window.location.href = "/login"
        return
      }

      const [userRes, eventsRes, submissionsRes] = await Promise.all([
        supabase.from("users").select("*").eq("id", authUser.id).single(),
        supabase
          .from("point_events")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("submissions")
          .select("*")
          .eq("user_id", authUser.id)
          .order("submitted_at", { ascending: false })
          .limit(12),
      ])

      if (userRes.data) setUser(userRes.data as User)
      if (eventsRes.data) setEvents(eventsRes.data as PointEvent[])
      if (submissionsRes.data) setSubmissions(submissionsRes.data as Submission[])
      setLoading(false)
    }
    load()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const tierConfig = TIER_CONFIG[user.tier]
  const isFieldAgent =
    TIER_THRESHOLDS[user.tier] >= TIER_THRESHOLDS["field_agent"]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Points</h1>
          <p className="text-zinc-500 mt-1">Track your contributions and rewards</p>
        </div>

        {/* Points + Tier card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-8">
          {/* Big number */}
          <div className="flex-1">
            <p className="text-sm text-zinc-400 uppercase tracking-widest mb-1">Total Points</p>
            <p className="text-6xl font-black text-amber-400 tabular-nums">
              {animatedPoints.toLocaleString()}
            </p>
          </div>

          {/* Tier badge */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${tierConfig.bg} border border-white/10`}>
            <span className="text-4xl">{tierConfig.emoji}</span>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest">Current Tier</p>
              <p className={`text-xl font-bold ${tierConfig.color}`}>{tierConfig.label}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <TierProgress tier={user.tier} points={user.points} />
        </div>

        {/* Transfer section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Transfer Points</h2>
            {!isFieldAgent && (
              <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-white/10">
                Coming soon
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1">
                Recipient Username
              </label>
              <input
                type="text"
                placeholder="@username"
                disabled={!isFieldAgent}
                title={!isFieldAgent ? "Coming soon — unlock at Field Agent tier" : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="0"
                disabled={!isFieldAgent}
                title={!isFieldAgent ? "Coming soon — unlock at Field Agent tier" : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <button
              disabled={!isFieldAgent}
              title={!isFieldAgent ? "Coming soon — unlock at Field Agent tier" : undefined}
              className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-400 text-sm font-semibold border border-cyan-400/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-400/30 transition-colors"
            >
              Transfer Points
            </button>
            {!isFieldAgent && (
              <p className="text-xs text-zinc-500">
                Point transfers unlock at Field Agent tier (10,000 pts).
              </p>
            )}
          </div>
        </div>

        {/* Point history */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Point History</h2>
          </div>
          {events.length === 0 ? (
            <div className="px-6 py-10 text-center text-zinc-500 text-sm">No point events yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wide border-b border-white/10">
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Reason</th>
                  <th className="text-right px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 text-sm text-zinc-400">{formatDate(ev.created_at)}</td>
                    <td className="px-6 py-3 text-sm text-white">{ev.reason}</td>
                    <td className={`px-6 py-3 text-sm text-right font-mono font-semibold ${ev.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {ev.amount >= 0 ? "+" : ""}{ev.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* My submissions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">My Submissions</h2>
          {submissions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-10 text-center text-zinc-500 text-sm">
              No submissions yet.{" "}
              <a href="/submit" className="text-cyan-400 hover:underline">Submit your first scan</a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {submissions.map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
