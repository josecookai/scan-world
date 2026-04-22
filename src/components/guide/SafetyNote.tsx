interface SafetyNoteProps {
  children: string
  type?: "warning" | "ok"
}

export default function SafetyNote({ children, type = "warning" }: SafetyNoteProps) {
  if (type === "ok") {
    return (
      <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">✅</span>
        <p className="text-sm text-zinc-300 leading-relaxed">{children}</p>
      </div>
    )
  }

  return (
    <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 flex gap-3 items-start">
      <span className="text-xl flex-shrink-0">⚠️</span>
      <p className="text-sm text-zinc-300 leading-relaxed">{children}</p>
    </div>
  )
}
