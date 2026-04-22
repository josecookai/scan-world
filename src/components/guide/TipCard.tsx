interface TipCardProps {
  icon: string
  title: string
  body: string
  variant?: "cyan" | "green"
}

export default function TipCard({ icon, title, body, variant = "cyan" }: TipCardProps) {
  const styles =
    variant === "green"
      ? "bg-green-400/10 border border-green-400/20"
      : "bg-cyan-400/10 border border-cyan-400/20"

  return (
    <div className={`${styles} rounded-xl p-4 flex gap-3`}>
      <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="font-semibold text-white mb-1">{title}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
