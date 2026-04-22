"use client"

import { useState } from "react"
import DatasetCard from "@/components/DatasetCard"
import { DATASETS, filterDatasets } from "@/lib/datasets"
import type { FilterCategory } from "@/lib/datasets"

const FILTER_OPTIONS: { label: string; value: FilterCategory }[] = [
  { label: "All", value: "all" },
  { label: "iPhone & Mobile", value: "iphone-mobile" },
  { label: "Robot POV", value: "robot-pov" },
  { label: "Egocentric", value: "egocentric" },
  { label: "Outdoor", value: "outdoor" },
]

export default function DatasetFilterBar() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all")

  const filtered = filterDatasets(DATASETS, activeFilter)

  return (
    <div className="space-y-8">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeFilter === option.value
                ? "bg-white text-black border-white"
                : "text-gray-400 border-white/10 hover:text-white hover:border-white/30"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Dataset grid */}
      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm py-12 text-center">
          No datasets match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      )}
    </div>
  )
}
