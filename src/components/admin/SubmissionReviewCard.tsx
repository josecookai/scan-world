"use client"

import { useState } from "react"
import Image from "next/image"
import { Submission, User } from "@/types"
import ScoreSlider from "./ScoreSlider"
import StatusBadge from "./StatusBadge"

interface SubmissionWithUser extends Submission {
  user?: Pick<User, "username" | "tier" | "points"> & { submission_count?: number }
}

interface SubmissionReviewCardProps {
  submission: SubmissionWithUser
  onAccept: (id: string, qualityScore: number, reason: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
  onSkip: () => void
}

const RUBRIC = [
  { range: "90-100", label: "Exceptional", desc: "4K+, stable, excellent scene, rare location" },
  { range: "70-89", label: "Good", desc: "Clear footage, good scene, meaningful content" },
  { range: "50-69", label: "Average", desc: "Acceptable quality, somewhat relevant" },
  { range: "30-49", label: "Below average", desc: "Shaky, low res, or marginally relevant" },
  { range: "0-29", label: "Poor", desc: "Very low quality or barely relevant" },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function SubmissionReviewCard({
  submission,
  onAccept,
  onReject,
  onSkip,
}: SubmissionReviewCardProps) {
  const [score, setScore] = useState(70)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleAccept() {
    setLoading(true)
    try {
      await onAccept(submission.id, score, reason)
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    try {
      await onReject(submission.id, reason)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      {/* Thumbnail + title */}
      <div className="relative">
        {submission.thumbnail_url ? (
          <div className="relative aspect-video w-full bg-zinc-800">
            <Image
              src={submission.thumbnail_url}
              alt={submission.title ?? "Video thumbnail"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-sm">No thumbnail</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
              submission.platform === "youtube"
                ? "bg-red-500/90 text-white"
                : "bg-black/80 text-white border border-white/20"
            }`}
          >
            {submission.platform}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={submission.status} />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Title + URL */}
        <div>
          <h2 className="text-white font-semibold text-lg leading-tight mb-1">
            {submission.title ?? "Untitled"}
          </h2>
          <a
            href={submission.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 text-sm hover:text-violet-300 underline break-all"
          >
            {submission.video_url}
          </a>
        </div>

        {/* Submitter info */}
        <div className="bg-zinc-800/50 rounded-xl p-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-zinc-500 text-xs">Submitter</span>
            <p className="text-white font-medium">
              {submission.user?.username ?? "Unknown"}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 text-xs">Tier</span>
            <p className="text-violet-400 font-medium capitalize">
              {submission.user?.tier ?? "—"}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 text-xs">Points</span>
            <p className="text-white">{submission.user?.points ?? 0}</p>
          </div>
          <div>
            <span className="text-zinc-500 text-xs">Submissions</span>
            <p className="text-white">{submission.user?.submission_count ?? "—"}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {submission.device_type && (
            <div>
              <span className="text-zinc-500 text-xs">Device</span>
              <p className="text-white capitalize">{submission.device_type}</p>
            </div>
          )}
          {(submission.location_country || submission.location_city) && (
            <div>
              <span className="text-zinc-500 text-xs">Location</span>
              <p className="text-white">
                {[submission.location_city, submission.location_country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
          {submission.category && (
            <div>
              <span className="text-zinc-500 text-xs">Category</span>
              <p className="text-white capitalize">{submission.category}</p>
            </div>
          )}
          <div>
            <span className="text-zinc-500 text-xs">Submitted</span>
            <p className="text-white">{timeAgo(submission.submitted_at)}</p>
          </div>
        </div>

        {submission.description && (
          <div>
            <span className="text-zinc-500 text-xs">Description</span>
            <p className="text-zinc-300 text-sm mt-1">{submission.description}</p>
          </div>
        )}

        {/* Scoring form */}
        <div className="border-t border-white/10 pt-4 space-y-4">
          <div>
            <label className="text-sm text-zinc-400 font-medium block mb-2">
              Quality Score
            </label>
            <ScoreSlider value={score} onChange={setScore} />
          </div>

          {/* Rubric */}
          <div className="bg-zinc-800/50 rounded-xl p-3 space-y-1">
            {RUBRIC.map((r) => (
              <div key={r.range} className="flex gap-2 text-xs">
                <span className="text-violet-400 font-mono w-14 shrink-0">{r.range}</span>
                <span className="text-zinc-300">
                  <span className="font-semibold">{r.label}.</span> {r.desc}
                </span>
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm text-zinc-400 font-medium block mb-2">
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Notes for this decision..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              [A] Accept &amp; Score
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              [R] Reject
            </button>
            <button
              onClick={onSkip}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-white/10 text-zinc-400 text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              [N] Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
