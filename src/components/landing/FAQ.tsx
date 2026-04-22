"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What counts as a valid submission?",
    answer:
      "TikTok or YouTube URLs of real-world footage. No gaming, skits, or music videos. We look for outdoor scenes, street-level footage, interiors, and natural environments that help robots understand the physical world.",
  },
  {
    question: "How are points calculated?",
    answer:
      "Our team scores each video on a 0–100 quality scale. Points = score × 2 + device bonus + location bonus. Device bonuses apply for iPhone, GoPro, and Insta360. Location bonuses apply for underrepresented regions. Points are awarded within 24 hours of review.",
  },
  {
    question: "Can I submit my existing videos?",
    answer:
      "Yes! If your video is already on TikTok or YouTube and shows real-world scenes, just paste the URL. There's no re-upload required. We index the link directly from the platform.",
  },
  {
    question: "Which devices earn the most points?",
    answer:
      "iPhone, GoPro, and Insta360 footage scores highest due to consistent metadata, high resolution, and stabilization quality. These devices also carry a dedicated device bonus multiplier on top of the base score.",
  },
  {
    question: "Can I transfer points to other users?",
    answer:
      "Yes, Field Agent tier and above can transfer points to other contributors. This enables team-based contributions and community rewards. Transfer limits apply per week.",
  },
  {
    question: "What happens to my videos?",
    answer:
      "We index the URL only. We don't host or store your video. The dataset references links, not files. Your content remains on TikTok or YouTube under your account — we simply catalog it as part of the training dataset metadata.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-28 px-6 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i
                  ? "border-cyan-400/30 bg-cyan-400/5"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className={`font-semibold text-sm md:text-base ${openIndex === i ? "text-white" : "text-zinc-200"}`}>
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    openIndex === i
                      ? "border-cyan-400 text-cyan-400 rotate-45"
                      : "border-white/20 text-zinc-400"
                  }`}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>

              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-zinc-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
