import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import DatasetCard from "@/components/DatasetCard"
import { DATASETS, getDatasetById, getRelatedDatasets } from "@/lib/datasets"
import type { DatasetEntry } from "@/lib/datasets"

export async function generateStaticParams() {
  return DATASETS.map((d) => ({ id: d.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dataset = getDatasetById(id)
  if (!dataset) return {}
  return {
    title: `${dataset.name} | Robotics Datasets | Scan the World`,
    description: dataset.description.slice(0, 160),
  }
}

function LicenseBadge({ license }: { license: DatasetEntry["license"] }) {
  const config: Record<
    DatasetEntry["license"],
    { label: string; className: string }
  > = {
    "apache-2.0": {
      label: "Apache 2.0",
      className: "bg-green-400/10 text-green-400 border-green-400/20",
    },
    "cc-by-4.0": {
      label: "CC BY 4.0",
      className: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    },
    "research-only": {
      label: "Research Only",
      className: "bg-gray-400/10 text-gray-400 border-gray-400/20",
    },
    mixed: {
      label: "Mixed",
      className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    },
  }
  const { label, className } = config[license]
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}
    >
      {label}
    </span>
  )
}

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dataset = getDatasetById(id)

  if (!dataset) {
    notFound()
  }

  const related = getRelatedDatasets(dataset)

  const deviceLabels: Record<string, string> = {
    iphone: "📱 iPhone",
    android: "📱 Android",
    robot: "🤖 Robot",
    gopro: "👁️ GoPro",
    insta360: "👁️ Insta360",
    other: "📷 Other",
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/datasets" className="hover:text-zinc-300 transition-colors">
            Datasets
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{dataset.name}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {dataset.name}
            </h1>
            <LicenseBadge license={dataset.license} />
          </div>
          <p className="text-zinc-400 text-sm">{dataset.fullName}</p>
        </div>

        {/* Description */}
        <p className="text-lg text-zinc-300 leading-relaxed">
          {dataset.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {dataset.item_count !== null && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1">
              <p className="text-3xl font-bold">
                {dataset.item_count.toLocaleString()}
              </p>
              <p className="text-sm text-zinc-500">Items / Episodes</p>
            </div>
          )}
          {dataset.duration_hours !== null && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1">
              <p className="text-3xl font-bold">
                {dataset.duration_hours.toLocaleString()}h
              </p>
              <p className="text-sm text-zinc-500">Hours of Footage</p>
            </div>
          )}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
            <p className="text-sm text-zinc-500">Device Types</p>
            <div className="flex flex-wrap gap-2">
              {dataset.device_types.map((dt) => (
                <span key={dt} className="text-sm text-zinc-200">
                  {deviceLabels[dt] ?? dt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Focus / domain tags */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
            Focus &amp; Domain
          </h2>
          <div className="flex flex-wrap gap-2">
            {dataset.focus.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
              >
                {tag}
              </span>
            ))}
            {dataset.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/5 text-zinc-400 border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
            Links
          </h2>
          <div className="flex flex-wrap gap-3">
            {dataset.paper_url && (
              <a
                href={dataset.paper_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
              >
                📄 Paper (arXiv)
              </a>
            )}
            {dataset.download_url && (
              <a
                href={dataset.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
              >
                ⬇️ Download
              </a>
            )}
            <a
              href={dataset.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
            >
              🌐 Project Page
            </a>
          </div>
        </div>

        {/* Scan the World relationship */}
        <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest">
            How it relates to Scan the World
          </h2>
          <p className="text-zinc-300 leading-relaxed">{dataset.scan_world_note}</p>
        </div>

        {/* Related datasets */}
        {related.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold">Related Datasets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <DatasetCard key={rel.id} dataset={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <Link
          href="/datasets"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back to all datasets
        </Link>
      </main>
    </div>
  )
}
