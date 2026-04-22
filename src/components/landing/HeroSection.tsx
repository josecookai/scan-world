import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="orb-2 absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-blue-600/12 blur-3xl" />
        <div className="orb-3 absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Rotating ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="animate-spin-slow w-full h-full rounded-full border border-cyan-400/10" />
        <div className="absolute inset-8 rounded-full border border-cyan-400/6" style={{ animation: "spin-slow 28s linear infinite reverse" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Now collecting training data for robot foundation models
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
          <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Every phone is
          </span>
          <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            a world sensor.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Submit your videos. Earn points. Help robots understand the real world.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/submit"
            className="px-8 py-4 rounded-full bg-cyan-400 text-[#0a0a0a] font-bold text-base hover:bg-cyan-300 transition-all hover:scale-105 shadow-lg shadow-cyan-400/20"
          >
            Start Scanning
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-base hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all"
          >
            See How It Works
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}
