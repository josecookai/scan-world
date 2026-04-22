"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User, Submission } from "@/types"
import PointsBadge from "@/components/PointsBadge"
import TierProgress from "@/components/TierProgress"
import SubmissionCard from "@/components/SubmissionCard"

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "RU", name: "Russia" },
  { code: "NG", name: "Nigeria" },
  { code: "ZA", name: "South Africa" },
  { code: "AR", name: "Argentina" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
]

function avatarInitials(user: User): string {
  const name = user.username ?? user.email ?? "?"
  return name.slice(0, 2).toUpperCase()
}

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form state
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [country, setCountry] = useState("")

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        window.location.href = "/login"
        return
      }

      const [userRes, subsRes] = await Promise.all([
        supabase.from("users").select("*").eq("id", authUser.id).single(),
        supabase
          .from("submissions")
          .select("*")
          .eq("user_id", authUser.id)
          .order("submitted_at", { ascending: false })
          .limit(12),
      ])

      if (userRes.data) {
        const u = userRes.data as User
        setUser(u)
        setUsername(u.username ?? "")
        setBio(u.bio ?? "")
        setCountry(u.country ?? "")
      }
      if (subsRes.data) setSubmissions(subsRes.data as Submission[])
      setLoading(false)
    }
    load()
  }, [supabase])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username || null, bio: bio || null, country: country || null }),
    })

    const json = await res.json()
    setSaving(false)

    if (!json.success) {
      setSaveError(json.error ?? "Failed to save")
    } else {
      setUser(json.data as User)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const acceptedCount = submissions.filter((s) => s.status === "accepted").length

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header card */}
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
              <h1 className="text-2xl font-bold text-white">{user.username ?? "Anonymous"}</h1>
              <p className="text-zinc-400 text-sm mt-0.5">{user.email}</p>
              {user.country && (
                <p className="text-zinc-500 text-sm mt-0.5">{user.country}</p>
              )}
              <div className="mt-3">
                <PointsBadge tier={user.tier} points={user.points} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">{submissions.length}</p>
              <p className="text-xs text-zinc-500">Total submissions</p>
              <p className="text-lg font-semibold text-green-400 mt-2">{acceptedCount}</p>
              <p className="text-xs text-zinc-500">Accepted</p>
            </div>
          </div>

          {/* Tier progress */}
          <div className="mt-6">
            <TierProgress tier={user.tier} points={user.points} />
          </div>
        </div>

        {/* Edit profile form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the world about yourself..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {saveError && (
              <p className="text-sm text-red-400">{saveError}</p>
            )}
            {saveSuccess && (
              <p className="text-sm text-green-400">Profile saved successfully.</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-cyan-400 text-[#0a0a0a] text-sm font-semibold hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Submissions grid */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">My Submissions</h2>
          {submissions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-10 text-center text-zinc-500 text-sm">
              No submissions yet.{" "}
              <a href="/submit" className="text-cyan-400 hover:underline">Submit your first scan</a>
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
