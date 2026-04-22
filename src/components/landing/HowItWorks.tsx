const steps = [
  {
    icon: "🎥",
    step: "01",
    title: "Record",
    description:
      "Use your iPhone, GoPro, or Insta360 to capture the world around you — streets, buildings, nature, interiors. The more diverse, the better.",
  },
  {
    icon: "🔗",
    step: "02",
    title: "Submit",
    description:
      "Post your footage to TikTok or YouTube, then paste the URL here. No upload needed — we index your content directly from the platform.",
  },
  {
    icon: "💰",
    step: "03",
    title: "Earn",
    description:
      "Get scored by our team on a 0-100 quality scale. Better quality footage earns more points. Points unlock higher tiers and rewards.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Simple process
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Scan. Submit. Earn.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="relative group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all duration-300"
            >
              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 w-6 h-px bg-white/10 z-10" />
              )}

              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-5xl font-black text-white/5 group-hover:text-cyan-400/10 transition-colors">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">{step.description}</p>

              {/* Bottom glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
