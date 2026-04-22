"use client"

import { useState } from "react"

const SECTIONS = [
  { id: "camera-settings", label: "Camera Settings" },
  { id: "shooting-principles", label: "Shooting Principles" },
  { id: "what-to-document", label: "What to Document" },
  { id: "before-you-upload", label: "Before You Upload" },
  { id: "safety-guidelines", label: "Safety Guidelines" },
]

export default function MobileTOC() {
  const [open, setOpen] = useState(false)

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setOpen(false)
  }

  return (
    <div className="md:hidden mb-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 font-medium"
      >
        <span>Jump to section</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="mt-2 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          {SECTIONS.map(({ id, label }, index) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
            >
              <span className="text-xs font-bold text-zinc-600 w-4">{index + 1}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
