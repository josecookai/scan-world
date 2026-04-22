"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex flex-col items-center justify-center px-8 technical-grid overflow-hidden" style={{ paddingTop: "64px" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131313]/50 to-[#131313] z-10" />

      <div className={`z-20 text-center max-w-4xl transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="inline-block border border-white/10 px-3 py-1.5 mb-8" style={{ background: "rgba(255,255,255,0.03)" }}>
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
            Decentralized Data Engine for Physical AI
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.1] tracking-tight text-white" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          The world trains<br /><span className="text-white/30">the world.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#c4c7c8] max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          Submit first-person video from anywhere on Earth. Earn tokens. Feed the next generation of robots, world models, and embodied AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/submit" className="bg-white text-[#2f3131] px-10 py-4 text-xs font-bold tracking-[0.1em] uppercase active:scale-[0.98] transition-transform" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
            <span className="flex items-center justify-center gap-2">Launch Engine</span>
          </Link>
          <Link href="/datasets" className="border border-white/20 bg-transparent text-white px-10 py-4 text-xs font-bold tracking-[0.1em] uppercase hover:border-white transition-colors active:scale-[0.98] transition-transform" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
            <span className="flex items-center justify-center gap-2">Documentation</span>
          </Link>
        </div>
      </div>

      <div className={`relative mt-16 w-full max-w-5xl aspect-video border border-white/10 overflow-hidden z-20 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ background: "#0e0e0e" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-20 h-20 text-white/10 mx-auto mb-4" strokeWidth={0.5} />
            <p className="text-xs tracking-[0.2em] uppercase text-white/30" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>Global Sensor Network Active</p>
            <p className="text-[10px] tracking-wider text-white/20 mt-2" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>196 COUNTRIES · 12,847 VIDEOS · 4,200 HOURS</p>
          </div>
        </div>
        <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
        <div className="absolute top-4 left-4 text-[10px] text-white/30 uppercase tracking-wider" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>System Status: Scanning...</div>
        <div className="absolute bottom-4 right-4 text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
        </div>
      </div>
    </section>
  );
}
