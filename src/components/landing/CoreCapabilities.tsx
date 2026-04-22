"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Globe, Database, Award } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "First-Person Capture",
    desc: "Submit egocentric video from any device — iPhone, GoPro, Android. The human perspective robots need to learn from.",
    span: "md:col-span-8",
    tags: ["POV", "EGOCENTRIC", "MOBILE"],
  },
  {
    icon: Globe,
    title: "Global by Default",
    desc: "Every country, every terrain. From Tokyo streets to Nairobi markets. Geographic diversity lab datasets can't replicate.",
    span: "md:col-span-4",
  },
  {
    icon: Database,
    title: "Structured Export",
    desc: "Download curated datasets in HuggingFace format. Parquet + manifest. Ready for LeRobot, OpenVLA, π₀.",
    span: "md:col-span-4",
  },
  {
    icon: Award,
    title: "Tokenized Rewards",
    desc: "Earn $SCAN for every accepted submission. Rare locations, quality footage, and dataset usage all generate ongoing rewards.",
    span: "md:col-span-8",
    tags: ["$SCAN", "BLOCKCHAIN", "ROYALTIES"],
    footer: "INCENTIVE_LAYER: ACTIVE",
  },
];

export default function CoreCapabilities() {
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
    <section ref={ref} className="py-20 px-8" style={{ background: "#131313" }}>
      <div className="max-w-6xl mx-auto">
        <div className={`mb-12 border-b border-white/5 pb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tighter" style={{ fontFamily: "var(--font-inter)" }}>Core Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`${f.span} group border border-white/10 p-10 flex flex-col justify-between hover:border-white/40 transition-colors duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ background: "#1b1b1b", transitionDelay: `${i * 100 + 200}ms` }}>
                <div>
                  <Icon className="w-6 h-6 text-white mb-6" strokeWidth={1.5} />
                  <h3 className="text-2xl font-medium text-white mb-3 uppercase tracking-tight" style={{ fontFamily: "var(--font-inter)" }}>{f.title}</h3>
                  <p className="text-base text-[#c4c7c8] leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{f.desc}</p>
                </div>
                {f.tags && (
                  <div className="mt-8 flex gap-2">
                    {f.tags.map((tag) => (
                      <span key={tag} className="px-2 py-[2px] border border-white/10 text-[10px] text-white/50 tracking-wider" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>{tag}</span>
                    ))}
                  </div>
                )}
                {f.footer && (
                  <div className="mt-8 text-[10px] text-white/30 tracking-wider" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>{f.footer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
