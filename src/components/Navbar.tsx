"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types"

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        setUser(null)
        setLoadingUser(false)
        return
      }

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single()

      setUser((data as User) ?? null)
      setLoadingUser(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-white hover:text-cyan-400 transition-colors"
        >
          <span className="text-2xl">🌍</span>
          <span>Scan the World</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#guide"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Guide
          </Link>
          <Link
            href="#datasets"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Datasets
          </Link>
          <Link
            href="#leaderboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Leaderboard
          </Link>
        </div>

        {/* Auth / CTA */}
        {!loadingUser && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Points badge */}
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-zinc-300">
                  <span className="text-cyan-400 font-semibold">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-zinc-500">pts</span>
                </span>

                {/* Username */}
                <span className="hidden sm:block text-sm text-zinc-300">
                  {user.username ?? user.email}
                </span>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/submit"
                  className="px-5 py-2 rounded-full bg-cyan-400 text-[#0a0a0a] text-sm font-semibold hover:bg-cyan-300 transition-colors"
                >
                  Start Scanning
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
