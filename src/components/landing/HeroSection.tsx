"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Scan } from "lucide-react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 md:px-8 technical-grid overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131313]/50 to-[#131313] z-10" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl animate-float-1 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white/[0.02] blur-3xl animate-float-2 pointer-events-none" />

      <div
        className={`z-20 text-center max-w-4xl transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Badge */}
        <div className="inline-block border border-white/10 bg-white/[0.03] px-3 py-1.5 mb-8">
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
            Decentralized Data Engine for Physical AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.1] tracking-tight text-white">
          The world trains
          <br />
          <span className="text-white/40">the world.</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-[#c4c7c8] max-w-2xl mx-auto mb-10 leading-relaxed">
          Submit first-person video from anywhere on Earth. Earn tokens. Feed
          the next generation of robots, world models, and embodied AI.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/submit"
            className="bg-white text-[#2f3131] px-8 py-4 text-xs font-medium tracking-[0.1em] uppercase font-mono hover:bg-white/90 transition-colors active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              Start Scanning
            </span>
          </Link>
          <Link
            href="/datasets"
            className="border border-white/20 bg-transparent text-white px-8 py-4 text-xs font-medium tracking-[0.1em] uppercase font-mono hover:border-white transition-colors active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Explore Datasets
            </span>
          </Link>
        </div>
      </div>

      {/* Hero image / visual */}
      <div
        className={`relative mt-16 w-full max-w-5xl aspect-video border border-white/10 overflow-hidden bg-[#0e0e0e] z-20 transition-all duration-1000 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-20 h-20 text-white/10 mx-auto mb-4" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-white/30">
              Global Sensor Network Active
            </p>
            <p className="text-[10px] font-mono tracking-wider text-white/20 mt-2">
              196 COUNTRIES · 12,847 VIDEOS · 4,200 HOURS
            </p>
          </div>
        </div>
        <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
        <div className="absolute top-4 left-4 font-mono text-[10px] text-white/30 uppercase tracking-wider">
          System Status: Scanning...
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </div>
      </div>
    </section>
  );
}
