import Link from "next/link"
import type { DatasetEntry } from "@/lib/datasets"

interface LicenseBadgeProps {
  license: DatasetEntry["license"]
}

function LicenseBadge({ license }: LicenseBadgeProps) {
  const config: Record<
    DatasetEntry["license"],
    { label: string; className: string }
  > = {
    "apache-2.0": {
      label: "Apache 2.0",
      className:
        "bg-green-400/10 text-green-400 border border-green-400/20",
    },
    "cc-by-4.0": {
      label: "CC BY 4.0",
      className:
        "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    },
    "research-only": {
      label: "Research Only",
      className:
        "bg-gray-400/10 text-gray-400 border border-gray-400/20",
    },
    mixed: {
      label: "Mixed",
      className:
        "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
    },
  }

  const { label, className } = config[license]

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {label}
    </span>
  )
}

function DeviceIcon({
  type,
}: {
  type: DatasetEntry["device_types"][number]
}) {
  const icons: Record<string, string> = {
    iphone: "📱",
    android: "📱",
    robot: "🤖",
    gopro: "👁️",
    insta360: "👁️",
    other: "👁️",
  }
  const labels: Record<string, string> = {
    iphone: "Mobile",
    android: "Mobile",
    robot: "Robot POV",
    gopro: "Egocentric",
    insta360: "Egocentric",
    other: "Other",
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-zinc-400"
      title={labels[type] ?? type}
    >
      <span>{icons[type] ?? "📷"}</span>
      <span>{labels[type] ?? type}</span>
    </span>
  )
}

interface DatasetCardProps {
  dataset: DatasetEntry
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  const uniqueDeviceLabels = Array.from(
    new Set(
      dataset.device_types.map((dt) => {
        if (dt === "iphone" || dt === "android") return "iphone"
        return dt
      })
    )
  ) as DatasetEntry["device_types"]

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-white text-lg leading-tight">
          {dataset.name}
        </h3>
        <LicenseBadge license={dataset.license} />
      </div>

      {/* Focus tags */}
      <div className="flex flex-wrap gap-1.5">
        {dataset.focus.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
        {dataset.description}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        {dataset.item_count !== null && (
          <span className="text-zinc-300">
            <span className="font-semibold text-white">
              {dataset.item_count.toLocaleString()}
            </span>{" "}
            <span className="text-zinc-500">items</span>
          </span>
        )}
        {dataset.duration_hours !== null && (
          <span className="text-zinc-300">
            <span className="font-semibold text-white">
              {dataset.duration_hours.toLocaleString()}
            </span>{" "}
            <span className="text-zinc-500">hours</span>
          </span>
        )}
      </div>

      {/* Device types */}
      <div className="flex flex-wrap gap-3">
        {uniqueDeviceLabels.map((dt) => (
          <DeviceIcon key={dt} type={dt} />
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-auto pt-2 border-t border-white/5">
        <Link
          href={`/datasets/${dataset.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          View Details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
