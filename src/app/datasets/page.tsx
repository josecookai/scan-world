import Navbar from "@/components/Navbar"
import DatasetFilterBar from "@/components/DatasetFilterBar"
import Link from "next/link"

export const metadata = {
  title: "Robotics Video Datasets | Scan the World",
  description:
    "Existing publicly available video datasets relevant to robot foundation model training, and how Scan the World complements them.",
}

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-20">
        {/* Page header */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Robotics Video Datasets
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Existing datasets we complement and integrate with.
          </p>
        </div>

        {/* Filter bar + grid */}
        <DatasetFilterBar />

        {/* Our Dataset section */}
        <section className="border border-white/10 rounded-3xl p-8 sm:p-12 bg-white/[0.02] space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              Our Contribution
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              The Scan the World Dataset
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-2xl">
              Our community-built dataset of real-world video footage, optimized
              for robot foundation model training. Human-submitted,
              quality-scored, and freely available.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-zinc-500">Videos</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-zinc-500">Countries</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-zinc-500">Hours</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Format</span>
              <span className="text-zinc-300">
                HuggingFace-compatible{" "}
                <span className="text-zinc-500">(coming soon)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">License</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20">
                CC BY 4.0
              </span>
              <span className="text-zinc-500 text-xs">
                user-submitted metadata only
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-[#0a0a0a] text-sm font-semibold hover:bg-cyan-300 transition-colors"
          >
            Start Contributing
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    </div>
  )
}
