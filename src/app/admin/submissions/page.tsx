"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Submission, User, SubmissionStatus } from "@/types"
import StatusBadge from "@/components/admin/StatusBadge"
import SubmissionReviewCard from "@/components/admin/SubmissionReviewCard"

export const dynamic = "force-dynamic"

interface SubmissionWithUser extends Submission {
  user?: Pick<User, "username" | "tier" | "points"> & { submission_count?: number }
}

const PAGE_SIZE = 25

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "flagged", label: "Flagged" },
]

const PLATFORM_OPTIONS = [
  { value: "", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
]

interface Toast {
  id: number
  message: string
  type: "success" | "error"
}

let toastCounter = 0

export default function SubmissionsPage() {
  const supabase = createClient()
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [platformFilter, setPlatformFilter] = useState("")
  const [selectedSub, setSelectedSub] = useState<SubmissionWithUser | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  function addToast(message: string, type: "success" | "error") {
    const id = ++toastCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const loadSubmissions = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from("submissions")
      .select(`*, user:users(username, tier, points)`, { count: "exact" })
      .order("submitted_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (statusFilter) query = query.eq("status", statusFilter)
    if (platformFilter) query = query.eq("platform", platformFilter)
    if (search) {
      query = query.or(`video_url.ilike.%${search}%,title.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (!error && data) {
      setSubmissions(data as SubmissionWithUser[])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [page, statusFilter, platformFilter, search, supabase])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  const handleAccept = useCallback(
    async (id: string, qualityScore: number, reason: string) => {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted", quality_score: qualityScore, reason }),
      })
      const json = await res.json()
      if (json.success) {
        addToast(`Accepted! ${json.data?.points_awarded ?? 0} pts awarded.`, "success")
        setSelectedSub(null)
        loadSubmissions()
      } else {
        addToast(`Error: ${json.error}`, "error")
      }
    },
    [loadSubmissions]
  )

  const handleReject = useCallback(
    async (id: string, reason: string) => {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", reason }),
      })
      const json = await res.json()
      if (json.success) {
        addToast("Rejected.", "error")
        setSelectedSub(null)
        loadSubmissions()
      } else {
        addToast(`Error: ${json.error}`, "error")
      }
    },
    [loadSubmissions]
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Submissions</h1>
        <p className="text-zinc-500 text-sm mt-1">{total} total submissions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search by username or URL..."
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 min-w-[220px] flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => { setPlatformFilter(e.target.value); setPage(0) }}
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
        >
          {PLATFORM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className={selectedSub ? "grid lg:grid-cols-2 gap-6" : ""}>
        {/* Table */}
        <div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Video</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Platform</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Submitter</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Score</th>
                  <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Points</th>
                  <th className="text-right px-4 py-3 font-medium hidden xl:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-600">
                      Loading...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-600">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                        selectedSub?.id === sub.id ? "bg-violet-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-zinc-800 overflow-hidden shrink-0">
                            {sub.thumbnail_url && (
                              <Image
                                src={sub.thumbnail_url}
                                alt=""
                                width={48}
                                height={32}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <span className="text-white truncate max-w-[160px]">
                            {sub.title ?? "Untitled"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={`text-xs font-bold uppercase ${
                            sub.platform === "youtube" ? "text-red-400" : "text-white/60"
                          }`}
                        >
                          {sub.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 hidden lg:table-cell">
                        {sub.user?.username ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={sub.status as SubmissionStatus} />
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-400 hidden md:table-cell">
                        {sub.quality_score !== null ? sub.quality_score : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-400 hidden lg:table-cell">
                        {sub.points_awarded !== null ? sub.points_awarded : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-500 text-xs hidden xl:table-cell">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
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

        {/* Detail panel */}
        {selectedSub && (
          <div className="relative">
            <button
              onClick={() => setSelectedSub(null)}
              className="absolute -top-2 right-0 z-10 text-zinc-500 hover:text-white text-sm"
            >
              Close ✕
            </button>
            <SubmissionReviewCard
              submission={selectedSub}
              onAccept={handleAccept}
              onReject={handleReject}
              onSkip={() => setSelectedSub(null)}
            />
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${
              toast.type === "success"
                ? "bg-green-900/90 border-green-500/30 text-green-300"
                : "bg-red-900/90 border-red-500/30 text-red-300"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
