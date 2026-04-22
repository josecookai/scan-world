export default function WhyItMatters() {
  return (
    <section className="py-28 px-6 bg-[#0d0d0d] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
              The bigger picture
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              You&apos;re training the next generation of robots.
            </h2>
            <div className="space-y-5 text-zinc-400 leading-relaxed">
              <p>
                Robot AI — like{" "}
                <span className="text-white font-medium">OpenVLA</span> and other
                embodied foundation models — needs to understand the world before it
                can act in it. That requires massive, diverse, real-world video data.
              </p>
              <p>
                Current lab datasets are narrow: a few controlled environments, limited
                geographies, predictable scenes. Robots trained on them fail in the
                messy, beautiful complexity of reality.
              </p>
              <p>
                Your footage fills the gap. A market in Cairo. A rainy street in Seoul.
                A forest trail in Brazil. Every scene you capture makes the next
                generation of{" "}
                <span className="text-white font-medium">embodied AI</span> more
                capable — and more human.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["OpenVLA", "Robot Foundation Models", "Embodied AI", "Real-world Data"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: abstract network/grid visual */}
          <div className="relative h-80 lg:h-96">
            {/* Grid background */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Node connections */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
              {/* Connection lines */}
              <line x1="80" y1="80" x2="200" y2="160" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
              <line x1="200" y1="160" x2="320" y2="100" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
              <line x1="200" y1="160" x2="140" y2="260" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="160" x2="300" y2="240" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
              <line x1="80" y1="80" x2="140" y2="260" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
              <line x1="320" y1="100" x2="300" y2="240" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
              <line x1="50" y1="200" x2="200" y2="160" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
              <line x1="50" y1="200" x2="140" y2="260" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
              <line x1="360" y1="200" x2="200" y2="160" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />

              {/* Nodes */}
              <circle cx="200" cy="160" r="8" fill="rgba(0,212,255,0.8)" />
              <circle cx="200" cy="160" r="16" fill="rgba(0,212,255,0.1)" />

              <circle cx="80" cy="80" r="5" fill="rgba(0,212,255,0.5)" />
              <circle cx="320" cy="100" r="5" fill="rgba(0,212,255,0.5)" />
              <circle cx="140" cy="260" r="5" fill="rgba(0,212,255,0.5)" />
              <circle cx="300" cy="240" r="5" fill="rgba(0,212,255,0.5)" />
              <circle cx="50" cy="200" r="4" fill="rgba(0,212,255,0.3)" />
              <circle cx="360" cy="200" r="4" fill="rgba(0,212,255,0.3)" />

              {/* Country labels */}
              <text x="55" y="75" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">🇧🇷 Brazil</text>
              <text x="325" y="95" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">🇯🇵 Japan</text>
              <text x="105" y="275" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">🇪🇬 Egypt</text>
              <text x="265" y="258" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">🇮🇳 India</text>
              <text x="155" y="155" fill="rgba(0,212,255,0.9)" fontSize="11" fontFamily="monospace" fontWeight="bold">Robot AI</text>
            </svg>

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-cyan-400/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
