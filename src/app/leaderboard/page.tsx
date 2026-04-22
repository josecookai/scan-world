"use client"

import { useEffect, useState } from "react"
import { User } from "@/types"
import LeaderboardRow from "@/components/LeaderboardRow"

export const dynamic = "force-dynamic"

const COUNTRIES = [
  { code: "", name: "All Countries" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "RU", name: "Russia" },
  { code: "NG", name: "Nigeria" },
  { code: "ZA", name: "South Africa" },
  { code: "AR", name: "Argentina" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
]

type Period = "all-time" | "monthly"
type Scope = "global" | "country"

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [scope, setScope] = useState<Scope>("global")
  const [country, setCountry] = useState("")
  const [period, setPeriod] = useState<Period>("all-time")

  useEffect(() => {
    async function load() {
      setLoading(true)
      const params = new URLSearchParams()
      if (period !== "all-time") params.set("period", period)
      if (scope === "country" && country) params.set("country", country)

      const res = await fetch(`/api/leaderboard?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setUsers(json.data as User[])
      }
      setLoading(false)
    }
    load()
  }, [scope, country, period])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Leaderboard</h1>
          <p className="text-zinc-500 mt-1">Top scanners around the world</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          {/* Scope toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setScope("global")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                scope === "global"
                  ? "bg-cyan-400 text-[#0a0a0a]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setScope("country")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                scope === "country"
                  ? "bg-cyan-400 text-[#0a0a0a]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              By Country
            </button>
          </div>

          {/* Country select — only when scope=country */}
          {scope === "country" && (
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/50"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900">
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Period toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 ml-auto">
            <button
              onClick={() => setPeriod("all-time")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === "all-time"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === "monthly"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-zinc-500 animate-pulse">Loading...</div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-sm">
              No scanners found for this filter.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wide border-b border-white/10">
                  <th className="text-center px-4 py-3 w-12">#</th>
                  <th className="text-left px-4 py-3">Scanner</th>
                  <th className="text-center px-4 py-3 w-12">Country</th>
                  <th className="text-right px-4 py-3">Points</th>
                  <th className="text-center px-4 py-3 w-12">Tier</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <LeaderboardRow key={user.id} rank={i + 1} user={user} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
