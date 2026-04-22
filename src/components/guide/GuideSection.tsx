import { ReactNode } from "react"

interface GuideSectionProps {
  id: string
  title: string
  icon: string
  children: ReactNode
}

export default function GuideSection({ id, title, icon, children }: GuideSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white relative pl-4 border-l-4 border-cyan-400">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
