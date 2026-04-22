import { createClient } from "@/lib/supabase/server"
import { User, Submission } from "@/types"
import PointsBadge from "@/components/PointsBadge"
import TierProgress from "@/components/TierProgress"
import SubmissionCard from "@/components/SubmissionCard"

function avatarInitials(user: User): string {
  const name = user.username ?? user.email ?? "?"
  return name.slice(0, 2).toUpperCase()
}

function countryFlag(isoCode: string): string {
  return String.fromCodePoint(
    ...isoCode.toUpperCase().split("").map((c) => 0x1f1e0 - 0x41 + c.charCodeAt(0))
  )
}

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single()

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-sm">
          <p className="text-5xl mb-4">🌍</p>
          <h1 className="text-xl font-bold text-white mb-2">User not found</h1>
          <p className="text-zinc-500 text-sm mb-6">
            No scanner with the username{" "}
            <span className="text-cyan-400">@{username}</span> exists.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2 rounded-full bg-cyan-400 text-[#0a0a0a] text-sm font-semibold hover:bg-cyan-300 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  const user = userData as User

  const { data: subsData } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(12)

  const submissions = (subsData ?? []) as Submission[]
  const acceptedCount = submissions.filter((s) => s.status === "accepted").length

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Profile card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-cyan-400/20 flex items-center justify-center text-2xl font-bold text-cyan-400 border border-cyan-400/20 shrink-0">
                {avatarInitials(user)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{user.username ?? "Anonymous"}</h1>
                {user.country && (
                  <span className="text-2xl" title={user.country}>
                    {countryFlag(user.country)}
                  </span>
                )}
              </div>
              {user.bio && (
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-lg">{user.bio}</p>
              )}
              <div className="mt-3">
                <PointsBadge tier={user.tier} points={user.points} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">{submissions.length}</p>
              <p className="text-xs text-zinc-500">Submissions</p>
              <p className="text-lg font-semibold text-green-400 mt-2">{acceptedCount}</p>
              <p className="text-xs text-zinc-500">Accepted</p>
            </div>
          </div>

          {/* Tier progress (read-only, still informative) */}
          <div className="mt-6">
            <TierProgress tier={user.tier} points={user.points} />
          </div>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Submissions</h2>
          {submissions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-10 text-center text-zinc-500 text-sm">
              No submissions yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {submissions.map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
