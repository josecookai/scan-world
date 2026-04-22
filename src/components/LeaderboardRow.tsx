import { User, UserTier } from "@/types"

const TIER_EMOJIS: Record<UserTier, string> = {
  scout: "🔍",
  explorer: "🌍",
  correspondent: "📡",
  field_agent: "🛰️",
  world_scanner: "🌐",
}

const TIER_COLORS: Record<UserTier, string> = {
  scout: "text-zinc-400",
  explorer: "text-green-400",
  correspondent: "text-cyan-400",
  field_agent: "text-purple-400",
  world_scanner: "text-amber-400",
}

function countryFlag(isoCode: string): string {
  return String.fromCodePoint(
    ...isoCode.toUpperCase().split("").map((c) => 0x1f1e0 - 0x41 + c.charCodeAt(0))
  )
}

function avatarInitials(user: User): string {
  const name = user.username ?? user.email ?? "?"
  return name.slice(0, 2).toUpperCase()
}

const RANK_COLORS: Record<number, string> = {
  1: "text-amber-400 font-bold",
  2: "text-zinc-300 font-bold",
  3: "text-orange-400 font-bold",
}

interface LeaderboardRowProps {
  rank: number
  user: User
}

export default function LeaderboardRow({ rank, user }: LeaderboardRowProps) {
  const tierEmoji = TIER_EMOJIS[user.tier]
  const tierColor = TIER_COLORS[user.tier]
  const rankStyle = RANK_COLORS[rank] ?? "text-zinc-500"

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      {/* Rank */}
      <td className={`px-4 py-3 text-sm w-12 text-center ${rankStyle}`}>
        {rank <= 3 ? (rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉") : rank}
      </td>

      {/* Avatar + Username */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.username ?? "avatar"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-xs font-bold text-cyan-400">
              {avatarInitials(user)}
            </div>
          )}
          <span className="text-sm text-white font-medium">
            {user.username ?? "Anonymous"}
          </span>
        </div>
      </td>

      {/* Country flag */}
      <td className="px-4 py-3 text-center">
        {user.country ? (
          <span className="text-xl" title={user.country}>
            {countryFlag(user.country)}
          </span>
        ) : (
          <span className="text-zinc-600 text-sm">—</span>
        )}
      </td>

      {/* Points */}
      <td className="px-4 py-3 text-right">
        <span className="text-amber-400 font-mono font-semibold text-sm">
          {user.points.toLocaleString()}
        </span>
      </td>

      {/* Tier */}
      <td className="px-4 py-3 text-center">
        <span className={`text-sm ${tierColor}`}>
          {tierEmoji}
        </span>
      </td>
    </tr>
  )
}
