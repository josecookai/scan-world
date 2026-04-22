import Link from "next/link";

const tips = [
  {
    label: "Horizontal always.",
    detail: "Portrait video is rejected. Landscape is mandatory for training data.",
  },
  {
    label: "4K 30fps.",
    detail: "The standard for training quality. 24fps or 60fps also accepted.",
  },
  {
    label: "Lock exposure.",
    detail: "Tap and hold to lock AE/AF. Flickering exposure degrades quality score.",
  },
];

export default function IphoneTeaser() {
  return (
    <section id="guide" className="py-28 px-6 bg-[#0d0d0d] border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
          Capture guide
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Don&apos;t know how to shoot?
        </h2>
        <p className="text-zinc-400 text-lg mb-12">
          Our guide teaches you exactly how to capture footage that scores high.
        </p>

        {/* Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 text-left">
          {tips.map((tip, i) => (
            <div
              key={tip.label}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-white font-bold text-sm">{tip.label}</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">{tip.detail}</p>
            </div>
          ))}
        </div>

        <Link
          href="/guide"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cyan-400/30 text-cyan-400 font-semibold hover:border-cyan-400/60 hover:bg-cyan-400/10 transition-all"
        >
          Read the Full Guide
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
