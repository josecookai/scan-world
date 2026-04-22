import { UserTier } from "@/types"

const TIER_CONFIG: Record<UserTier, { emoji: string; label: string; color: string }> = {
  scout: { emoji: "🔍", label: "Scout", color: "text-zinc-400" },
  explorer: { emoji: "🌍", label: "Explorer", color: "text-green-400" },
  correspondent: { emoji: "📡", label: "Correspondent", color: "text-cyan-400" },
  field_agent: { emoji: "🛰️", label: "Field Agent", color: "text-purple-400" },
  world_scanner: { emoji: "🌐", label: "World Scanner", color: "text-amber-400" },
}

interface PointsBadgeProps {
  tier: UserTier
  points: number
  className?: string
}

export default function PointsBadge({ tier, points, className = "" }: PointsBadgeProps) {
  const config = TIER_CONFIG[tier]
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span>{config.emoji}</span>
      <span className={`font-semibold ${config.color}`}>{config.label}</span>
      <span className="text-amber-400 font-mono">{points.toLocaleString()} pts</span>
    </span>
  )
}
