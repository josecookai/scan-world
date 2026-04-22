"use client"

interface ScoreSliderProps {
  value: number
  onChange: (value: number) => void
}

function scoreColor(value: number): string {
  if (value >= 90) return "#4ade80" // green-400
  if (value >= 70) return "#86efac" // green-300
  if (value >= 50) return "#facc15" // yellow-400
  if (value >= 30) return "#fb923c" // orange-400
  return "#f87171" // red-400
}

function scoreLabel(value: number): string {
  if (value >= 90) return "Exceptional"
  if (value >= 70) return "Good"
  if (value >= 50) return "Average"
  if (value >= 30) return "Below Average"
  return "Poor"
}

export default function ScoreSlider({ value, onChange }: ScoreSliderProps) {
  const color = scoreColor(value)
  const label = scoreLabel(value)
  const pct = value

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400 w-6">0</span>
        <div className="relative flex-1">
          <div className="h-2 rounded-full bg-zinc-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(to right, #f87171, #facc15 50%, #4ade80)`,
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none transition-all duration-150"
            style={{
              left: `calc(${pct}% - 8px)`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="text-sm text-zinc-400 w-8 text-right">100</span>
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const n = Math.max(0, Math.min(100, Number(e.target.value)))
            onChange(n)
          }}
          className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-violet-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-sm font-semibold"
          style={{ color }}
        >
          {value} — {label}
        </span>
      </div>
    </div>
  )
}
