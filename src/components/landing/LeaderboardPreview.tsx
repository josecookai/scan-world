"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

const leaders = [
  { rank: 1, initials: "MK", name: "Maria K.", country: "BR", points: 48230, tier: "World Scanner" },
  { rank: 2, initials: "JT", name: "Jun T.", country: "JP", points: 31540, tier: "Field Agent" },
  { rank: 3, initials: "AR", name: "Ahmed R.", country: "EG", points: 24180, tier: "Field Agent" },
  { rank: 4, initials: "PS", name: "Priya S.", country: "IN", points: 12760, tier: "Field Agent" },
  { rank: 5, initials: "LF", name: "Lucas F.", country: "FR", points: 8490, tier: "Correspondent" },
];

const rankColor: Record<number, string> = {
  1: "text-amber-400",
  2: "text-white/60",
  3: "text-amber-600",
};

const tierColor: Record<string, string> = {
  "World Scanner": "text-amber-400",
  "Field Agent": "text-violet-400",
  Correspondent: "text-cyan-400",
  Explorer: "text-green-400",
  Scout: "text-neutral-500",
};

export default function LeaderboardPreview() {
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
    <section ref={ref} className="py-20 px-8 border-y border-white/5" style={{ background: "#131313" }}>
      <div className="max-w-4xl mx-auto">
        <div className={`mb-12 border-b border-white/5 pb-6 flex items-end justify-between transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>Community</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tighter" style={{ fontFamily: "var(--font-inter)" }}>Top Scanners</h2>
          </div>
          <Link href="/leaderboard" className="hidden sm:flex items-center gap-2 text-xs tracking-wider uppercase text-white/50 hover:text-white transition-colors" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className={`border border-white/10 overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ background: "#1b1b1b", transitionDelay: "200ms" }}>
          {leaders.map((leader, i) => (
            <div key={leader.rank} className={`flex items-center gap-4 px-6 py-4 ${i < leaders.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/[0.02] transition-colors`}>
              <span className={`w-8 text-center text-sm ${rankColor[leader.rank] ?? "text-white/30"}`} style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>{leader.rank}</span>
              <div className="w-8 h-8 flex items-center justify-center text-xs font-medium text-white" style={{ background: "rgba(255,255,255,0.1)" }}>{leader.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "var(--font-inter)" }}>{leader.name}</p>
                <p className="text-[10px] text-white/30 tracking-wider uppercase" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>{leader.country}</p>
              </div>
              <span className={`text-[10px] tracking-wider uppercase hidden sm:block ${tierColor[leader.tier] ?? "text-neutral-500"}`} style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>{leader.tier}</span>
              <span className="text-sm text-white text-right" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>{leader.points.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link href="/leaderboard" className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-white/50 hover:text-white transition-colors" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
            View Full Leaderboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
