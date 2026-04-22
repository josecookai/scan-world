interface Step {
  text: string
}

interface StepListProps {
  steps: Step[]
}

export default function StepList({ steps }: StepListProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-5 items-start">
          <span className="text-4xl font-bold text-cyan-400 leading-none w-10 flex-shrink-0 text-right">
            {index + 1}
          </span>
          <div className="flex-1 pt-1.5 border-b border-white/5 pb-4">
            <p className="text-zinc-200 leading-relaxed">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
