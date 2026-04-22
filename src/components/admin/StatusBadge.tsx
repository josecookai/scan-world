import { SubmissionStatus } from "@/types"

interface StatusBadgeProps {
  status: SubmissionStatus
  className?: string
}

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  },
  accepted: {
    label: "Accepted",
    classes: "bg-green-400/10 text-green-400 border border-green-400/20",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-400/10 text-red-400 border border-red-400/20",
  },
  flagged: {
    label: "Flagged",
    classes: "bg-orange-400/10 text-orange-400 border border-orange-400/20",
  },
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  )
}
