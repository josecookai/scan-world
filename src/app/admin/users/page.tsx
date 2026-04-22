"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@/types"

export const dynamic = "force-dynamic"

type SortKey = "points" | "created_at"

const TIER_COLOR: Record<string, string> = {
  scout: "text-zinc-400",
  explorer: "text-green-400",
  correspondent: "text-cyan-400",
  field_agent: "text-violet-400",
  world_scanner: "text-yellow-400",
}

const PAGE_SIZE = 25

export default function UsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<(User & { submission_count?: number })[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("points")
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [userSubmissions, setUserSubmissions] = useState<Record<string, unknown[]>>({})

  const loadUsers = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .order(sortKey, { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (!error && data) {
      setUsers(data as User[])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [page, sortKey, search, supabase])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  async function loadUserSubmissions(userId: string) {
    if (userSubmissions[userId]) {
      setExpandedUserId(expandedUserId === userId ? null : userId)
      return
    }

    const { data } = await supabase
      .from("submissions")
      .select("id, title, platform, status, quality_score, points_awarded, submitted_at")
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false })
      .limit(10)

    if (data) {
      setUserSubmissions((prev) => ({ ...prev, [userId]: data }))
      setExpandedUserId(userId)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-zinc-500 text-sm mt-1">{total} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search by username or email..."
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 min-w-[220px] flex-1"
        />
        <select
          value={sortKey}
          onChange={(e) => { setSortKey(e.target.value as SortKey); setPage(0) }}
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
        >
          <option value="points">Sort: Points</option>
          <option value="created_at">Sort: Joined</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">Username</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium">Tier</th>
              <th className="text-right px-4 py-3 font-medium">Points</th>
              <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Role</th>
              <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-zinc-600">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-zinc-600">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <>
                  <tr
                    key={u.id}
                    onClick={() => loadUserSubmissions(u.id)}
                    className="border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {u.username ?? <span className="text-zinc-600 italic">No username</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`capitalize text-xs font-semibold ${TIER_COLOR[u.tier] ?? "text-zinc-400"}`}>
                        {u.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono">{u.points}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span
                        className={`text-xs font-semibold ${
                          u.role === "admin" ? "text-violet-400" : "text-zinc-500"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-500 text-xs hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                  {expandedUserId === u.id && userSubmissions[u.id] && (
                    <tr key={`${u.id}-subs`} className="bg-zinc-800/50">
                      <td colSpan={6} className="px-6 py-3">
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
                          Recent Submissions
                        </div>
                        <div className="space-y-1">
                          {(userSubmissions[u.id] as Array<Record<string, unknown>>).map((sub) => (
                            <div
                              key={String(sub.id)}
                              className="flex items-center gap-4 text-sm"
                            >
                              <span
                                className={`text-xs font-bold uppercase ${
                                  sub.platform === "youtube" ? "text-red-400" : "text-white/60"
                                }`}
                              >
                                {String(sub.platform)}
                              </span>
                              <span className="text-zinc-300 flex-1 truncate">
                                {sub.title ? String(sub.title) : "Untitled"}
                              </span>
                              <span
                                className={`text-xs ${
                                  sub.status === "accepted"
                                    ? "text-green-400"
                                    : sub.status === "rejected"
                                    ? "text-red-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                {String(sub.status)}
                              </span>
                              {sub.quality_score !== null && (
                                <span className="text-zinc-500 text-xs">
                                  Score: {String(sub.quality_score)}
                                </span>
                              )}
                              {sub.points_awarded !== null && (
                                <span className="text-violet-400 text-xs">
                                  +{String(sub.points_awarded)} pts
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-sm text-zinc-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-sm text-zinc-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
