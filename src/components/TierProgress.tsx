import { UserTier } from "@/types"

const TIER_THRESHOLDS: Record<UserTier, number> = {
  scout: 0,
  explorer: 500,
  correspondent: 2000,
  field_agent: 10000,
  world_scanner: 50000,
}

const TIER_ORDER: UserTier[] = [
  "scout",
  "explorer",
  "correspondent",
  "field_agent",
  "world_scanner",
]

const TIER_LABELS: Record<UserTier, string> = {
  scout: "Scout",
  explorer: "Explorer",
  correspondent: "Correspondent",
  field_agent: "Field Agent",
  world_scanner: "World Scanner",
}

interface TierProgressProps {
  tier: UserTier
  points: number
  className?: string
}

export default function TierProgress({ tier, points, className = "" }: TierProgressProps) {
  const currentIndex = TIER_ORDER.indexOf(tier)
  const isMax = currentIndex === TIER_ORDER.length - 1

  if (isMax) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Tier</span>
          <span className="text-amber-400 font-semibold">Max tier reached</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-full bg-amber-400 rounded-full" />
        </div>
      </div>
    )
  }

  const nextTier = TIER_ORDER[currentIndex + 1]
  const currentThreshold = TIER_THRESHOLDS[tier]
  const nextThreshold = TIER_THRESHOLDS[nextTier]
  const progressPoints = points - currentThreshold
  const rangePoints = nextThreshold - currentThreshold
  const percentage = Math.min(100, Math.max(0, (progressPoints / rangePoints) * 100))
  const remaining = nextThreshold - points

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">Progress to {TIER_LABELS[nextTier]}</span>
        <span className="text-amber-400 font-semibold">
          {remaining.toLocaleString()} pts to go
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{points.toLocaleString()} pts</span>
        <span>{nextThreshold.toLocaleString()} pts</span>
      </div>
    </div>
  )
}
