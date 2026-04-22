"use client"

import { useState } from "react"

type Device = "iphone" | "gopro" | "insta360"

const DEVICE_LABELS: { id: Device; label: string }[] = [
  { id: "iphone", label: "iPhone" },
  { id: "gopro", label: "GoPro" },
  { id: "insta360", label: "Insta360" },
]

const DEVICE_SETTINGS: Record<Device, { label: string; detail: string }[]> = {
  iphone: [
    { label: "Resolution", detail: "4K 30fps for static scenes, 1080p 60fps for fast motion" },
    {
      label: "Lock exposure + focus",
      detail: "Long-press on your subject before recording to lock both",
    },
    { label: "Disable Live Photos", detail: "Turn off Live Photos during recording sessions" },
    {
      label: "Enable grid lines",
      detail: "Settings → Camera → Grid — helps keep horizons level",
    },
    {
      label: "Stabilization",
      detail: "Use Action mode for movement, standard mode for static scenes",
    },
    {
      label: "Format",
      detail: "High Efficiency (HEVC) is fine — we handle conversion automatically",
    },
  ],
  gopro: [
    {
      label: "Resolution",
      detail: "4K 30fps using Linear mode — avoid SuperView for training data",
    },
    { label: "HyperSmooth", detail: "On (Boost if possible for maximum stabilization)" },
    { label: "GPS", detail: "Enable — adds valuable location metadata to each clip" },
    {
      label: "Color",
      detail: "GoPro Color (not Flat/Log — too much post-processing needed)",
    },
    {
      label: "FOV",
      detail: "Wide or Linear — avoid Ultra Wide, distortion affects training quality",
    },
  ],
  insta360: [
    { label: "Resolution", detail: "5.7K or 8K for 360° content" },
    {
      label: "Mode",
      detail: "360° mode preferred — most unique value for robot training",
    },
    { label: "Stabilization", detail: "FlowState On for smooth footage" },
    {
      label: "Action Camera mode",
      detail: "If using flat mode: 4K 30fps, same rules as GoPro",
    },
    {
      label: "360° bonus",
      detail: "360° videos receive a +100 point bonus — the rarest content type",
    },
  ],
}

export default function DeviceTab() {
  const [active, setActive] = useState<Device>("iphone")
  const settings = DEVICE_SETTINGS[active]

  return (
    <div>
      {/* Tab pills */}
      <div className="flex gap-2 mb-6 bg-white/5 rounded-full p-1 w-fit">
        {DEVICE_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              active === id
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Settings list */}
      <div className="space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.label}
            className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex gap-4"
          >
            <div className="w-1 rounded-full bg-cyan-400/60 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">{setting.label}</p>
              <p className="text-sm text-zinc-400">{setting.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
