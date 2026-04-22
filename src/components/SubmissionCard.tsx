import Image from "next/image"
import { Submission } from "@/types"

const STATUS_STYLES = {
  pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  accepted: "bg-green-400/10 text-green-400 border border-green-400/20",
  rejected: "bg-red-400/10 text-red-400 border border-red-400/20",
  flagged: "bg-orange-400/10 text-orange-400 border border-orange-400/20",
}

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  flagged: "Flagged",
}

const PLATFORM_ICONS: Record<string, string> = {
  youtube: "▶",
  tiktok: "♪",
}

function pointsDisplay(submission: Submission): string {
  if (submission.status === "pending") return "Awaiting review"
  if (submission.status === "rejected") return "Not eligible"
  if (submission.status === "accepted") {
    if (submission.points_awarded !== null) {
      return `+${submission.points_awarded.toLocaleString()} pts`
    }
    return "Awaiting scoring"
  }
  return "—"
}

interface SubmissionCardProps {
  submission: Submission
  className?: string
}

export default function SubmissionCard({ submission, className = "" }: SubmissionCardProps) {
  const statusStyle = STATUS_STYLES[submission.status]
  const statusLabel = STATUS_LABELS[submission.status]
  const platformIcon = PLATFORM_ICONS[submission.platform] ?? "🎬"
  const pts = pointsDisplay(submission)

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col ${className}`}>
      {/* Thumbnail */}
      <div className="relative h-36 bg-zinc-900">
        {submission.thumbnail_url ? (
          <Image
            src={submission.thumbnail_url}
            alt={submission.title ?? "Submission thumbnail"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 text-4xl">
            {platformIcon}
          </div>
        )}
        {/* Platform badge */}
        <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-white capitalize">
          {platformIcon} {submission.platform}
        </span>
        {/* Status pill */}
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1">
        <p className="text-sm text-white font-medium line-clamp-2 leading-snug">
          {submission.title ?? submission.video_url}
        </p>
        {(submission.location_city || submission.location_country) && (
          <p className="text-xs text-zinc-500">
            {[submission.location_city, submission.location_country].filter(Boolean).join(", ")}
          </p>
        )}
        <p className={`text-xs mt-auto font-semibold ${
          submission.status === "accepted" && submission.points_awarded
            ? "text-amber-400"
            : "text-zinc-500"
        }`}>
          {pts}
        </p>
      </div>
    </div>
  )
}
