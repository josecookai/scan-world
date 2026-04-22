"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload, ExternalLink, Trophy } from "lucide-react";

export default function CTASection() {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 md:px-8 text-center bg-[#131313]">
      <div
        className={`max-w-3xl mx-auto border border-white/10 bg-[#2a2a2a] p-10 md:p-16 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3 uppercase tracking-tighter">
          Start Your First Scan.
        </h2>
        <p className="text-base text-[#c4c7c8] mb-10 leading-relaxed">
          Every camera is a sensor. Every upload is a contribution. The robots
          are waiting for your perspective.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/submit"
            className="flex items-center justify-center gap-2 border border-white/20 py-4 hover:bg-white hover:text-black transition-all text-xs font-medium tracking-[0.1em] uppercase font-mono"
          >
            <Upload className="w-4 h-4" />
            Submit Video
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center justify-center gap-2 border border-white/20 py-4 hover:bg-white hover:text-black transition-all text-xs font-medium tracking-[0.1em] uppercase font-mono"
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
          <Link
            href="/datasets"
            className="flex items-center justify-center gap-2 bg-white text-black py-4 text-xs font-medium tracking-[0.1em] uppercase font-mono active:scale-95 transition-transform"
          >
            <ExternalLink className="w-4 h-4" />
            Datasets
          </Link>
        </div>
      </div>
    </section>
  );
}
