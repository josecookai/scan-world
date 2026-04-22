"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "12,847", label: "Videos Submitted", suffix: "" },
  { value: "196", label: "Countries Covered", suffix: "" },
  { value: "4,200", label: "Hours of Footage", suffix: "" },
];

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-1 transition-all duration-700 ${
        visible ? "stat-visible opacity-100" : "opacity-0 translate-y-2"
      }`}
    >
      <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
        {value}
      </span>
      <span className="text-sm text-zinc-500 font-medium tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-white/3 border-y border-white/10 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/10">
          {stats.map((stat) => (
            <StatItem key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
