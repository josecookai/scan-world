"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, CheckCircle, Play } from "lucide-react";

const steps = [
  {
    num: "01",
    label: "CAPTURE",
    title: "Film Your World",
    desc: "Record first-person video of real environments — kitchens, streets, workshops, nature. Add your unique #scanworld code to the description.",
  },
  {
    num: "02",
    label: "PROCESS",
    title: "Validation & Scoring",
    desc: "Staked validators review submissions for quality, authenticity, and relevance. AI-assisted checks + human oversight ensure dataset integrity.",
  },
  {
    num: "03",
    label: "INTERACT",
    title: "Feed the Models",
    desc: "Researchers download structured datasets in HuggingFace format. Your footage trains world models, robot policies, and embodied AI.",
  },
];

export default function Workflow() {
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
      className="py-24 md:py-32 px-6 md:px-8 bg-[#0e0e0e] border-y border-white/5"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tighter">
            The Protocol
          </h2>
        </div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 md:gap-16 items-center border-b border-white/5 pb-16 last:border-0 last:pb-0 transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 150 + 200}ms` }}
            >
              <div className="w-full md:w-1/2">
                <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase mb-2">
                  {step.num} / {step.label}
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-base text-[#c4c7c8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  {i === 0 && (
                    <Upload className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  )}
                  {i === 1 && (
                    <CheckCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  )}
                  {i === 2 && (
                    <Play className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  )}
                  <p className="font-mono text-[10px] text-white/20 tracking-wider uppercase">
                    {step.label}_PHASE
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
