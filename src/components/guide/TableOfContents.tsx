"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "camera-settings", label: "Camera Settings" },
  { id: "shooting-principles", label: "Shooting Principles" },
  { id: "what-to-document", label: "What to Document" },
  { id: "before-you-upload", label: "Before You Upload" },
  { id: "safety-guidelines", label: "Safety Guidelines" },
]

export default function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id)
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="space-y-1">
      <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
        On this page
      </p>
      {SECTIONS.map(({ id, label }, index) => (
        <button
          key={id}
          onClick={() => handleClick(id)}
          className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
            activeId === id
              ? "bg-cyan-400/10 text-cyan-400 font-medium"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <span
            className={`text-xs font-bold w-5 flex-shrink-0 ${
              activeId === id ? "text-cyan-400" : "text-zinc-600"
            }`}
          >
            {index + 1}
          </span>
          {label}
        </button>
      ))}
    </nav>
  )
}
