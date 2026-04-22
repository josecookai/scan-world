import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Admin nav */}
      <nav className="border-b border-white/10 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-violet-400 font-bold text-base hover:text-violet-300 transition-colors">
              Admin
            </Link>
            <div className="hidden md:flex items-center gap-5">
              <Link href="/admin/review" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Review Queue
              </Link>
              <Link href="/admin/submissions" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Submissions
              </Link>
              <Link href="/admin/users" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Users
              </Link>
            </div>
          </div>
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to site
          </Link>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}
