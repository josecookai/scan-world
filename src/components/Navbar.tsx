"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Globe, Scan, LogOut, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ username: string | null; email: string; points: number } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("username, points")
        .eq("id", authUser.id)
        .single();

      setUser(data ?? null);
      setLoadingUser(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navLinkClass =
    "text-sm font-medium uppercase tracking-tight text-neutral-500 hover:text-white transition-colors";
  const activeNavLinkClass =
    "text-sm font-medium uppercase tracking-tight text-white border-b border-white pb-1";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-white" />
        <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">
          SCAN WORLD
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 items-center">
        <Link href="/" className={activeNavLinkClass}>
          Home
        </Link>
        <Link href="/datasets" className={navLinkClass}>
          Datasets
        </Link>
        <Link href="/leaderboard" className={navLinkClass}>
          Leaderboard
        </Link>
        <Link href="/guide" className={navLinkClass}>
          Guide
        </Link>
      </div>

      {/* Auth / CTA */}
      <div className="hidden md:flex items-center gap-4">
        {!loadingUser && (
          <>
            {user ? (
              <>
                <span className="text-xs text-white/50 font-mono">
                  {user.points?.toLocaleString()} pts
                </span>
                <Link
                  href="/profile"
                  className="text-xs font-medium uppercase tracking-tight text-white hover:text-white/70 transition-colors flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  {user.username ?? "Profile"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-medium uppercase tracking-tight text-neutral-500 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 inline" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium uppercase tracking-tight text-white hover:opacity-70 transition-opacity"
              >
                Sign In
              </Link>
            )}
            {!user && (
              <Link
                href="/submit"
                className="text-xs font-medium uppercase tracking-tight text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5" />
                  Start Scanning
                </span>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 py-6 px-6 flex flex-col gap-4 md:hidden">
          <Link href="/" className="text-sm text-white uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link href="/datasets" className="text-sm text-neutral-400 uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
            Datasets
          </Link>
          <Link href="/leaderboard" className="text-sm text-neutral-400 uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
            Leaderboard
          </Link>
          <Link href="/guide" className="text-sm text-neutral-400 uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
            Guide
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="text-sm text-white uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
                Profile
              </Link>
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="text-sm text-neutral-400 uppercase tracking-wider text-left">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-white uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
