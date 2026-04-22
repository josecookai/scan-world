"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Submission, User } from "@/types"
import SubmissionReviewCard from "@/components/admin/SubmissionReviewCard"
import StatusBadge from "@/components/admin/StatusBadge"

export const dynamic = "force-dynamic"

interface SubmissionWithUser extends Submission {
  user?: Pick<User, "username" | "tier" | "points"> & { submission_count?: number }
}

interface Toast {
  id: number
  message: string
  type: "success" | "error"
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

let toastCounter = 0

export default function ReviewQueuePage() {
  const supabase = createClient()
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  function addToast(message: string, type: "success" | "error") {
    const id = ++toastCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  async function loadSubmissions() {
    setLoading(true)
    const { data, error } = await supabase
      .from("submissions")
      .select(`
        *,
        user:users(username, tier, points)
      `)
      .in("status", ["pending", "flagged"])
      .order("submitted_at", { ascending: true })
      .limit(100)

    if (!error && data) {
      setSubmissions(data as SubmissionWithUser[])
      setSelectedIndex(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSubmissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeSubmission = useCallback((id: string) => {
    setSubmissions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      return next
    })
    setSelectedIndex((prev) => Math.max(0, prev))
  }, [])

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
        removeSubmission(id)
      } else {
        addToast(`Error: ${json.error}`, "error")
      }
    },
    [removeSubmission]
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
        removeSubmission(id)
      } else {
        addToast(`Error: ${json.error}`, "error")
      }
    },
    [removeSubmission]
  )

  const handleSkip = useCallback(() => {
    setSelectedIndex((prev) =>
      submissions.length > 1 ? (prev + 1) % submissions.length : prev
    )
  }, [submissions.length])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (tag === "input" || tag === "textarea") return

      const selected = submissions[selectedIndex]
      if (!selected) return

      if (e.key === "n" || e.key === "N" || e.key === "ArrowRight") {
        setSelectedIndex((prev) => Math.min(prev + 1, submissions.length - 1))
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [submissions, selectedIndex])

  const selected = submissions[selectedIndex]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500">Loading queue...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Review Queue</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} pending review
          </p>
        </div>
        <div className="text-xs text-zinc-600 hidden md:block space-y-0.5">
          <p>A = Accept &nbsp; R = Reject &nbsp; N / → = Next &nbsp; ← = Prev</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-white font-semibold text-lg">Queue is empty</h2>
          <p className="text-zinc-500 text-sm mt-1">All submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Left: submission list */}
          <div className="space-y-2 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
            {submissions.map((sub, idx) => (
              <button
                key={sub.id}
                onClick={() => setSelectedIndex(idx)}
                className={`w-full text-left rounded-xl border p-3 flex gap-3 transition-all ${
                  idx === selectedIndex
                    ? "border-violet-500/50 bg-violet-500/5"
                    : "border-white/10 bg-zinc-900 hover:border-white/20"
                }`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                  {sub.thumbnail_url ? (
                    <Image
                      src={sub.thumbnail_url}
                      alt=""
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {sub.title ?? "Untitled"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-bold uppercase ${
                        sub.platform === "youtube" ? "text-red-400" : "text-white/60"
                      }`}
                    >
                      {sub.platform}
                    </span>
                    <span className="text-zinc-600 text-xs">·</span>
                    <span className="text-zinc-500 text-xs truncate">
                      {sub.user?.username ?? "unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={sub.status} />
                    <span className="text-zinc-600 text-xs">{timeAgo(sub.submitted_at)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: detail panel */}
          <div>
            {selected && (
              <SubmissionReviewCard
                submission={selected}
                onAccept={handleAccept}
                onReject={handleReject}
                onSkip={handleSkip}
              />
            )}
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border transition-all ${
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
