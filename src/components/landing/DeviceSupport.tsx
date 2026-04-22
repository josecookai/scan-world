const devices = [
  {
    emoji: "📱",
    name: "iPhone",
    subtitle: "Pro & Standard",
    features: ["Cinematic 4K mode", "ProRes support", "Gyro stabilization"],
    note: "Best for everyday capture. Log format available on Pro models.",
  },
  {
    emoji: "🎬",
    name: "GoPro",
    subtitle: "Hero 11/12/13",
    features: ["5.3K resolution", "HyperSmooth stabilization", "Waterproof"],
    note: "Ideal for action & outdoor scenes. Wide FOV captures more context.",
  },
  {
    emoji: "🔵",
    name: "Insta360",
    subtitle: "360° Capture",
    features: ["360° coverage", "AI reframing", "6K sphere"],
    note: "Maximum scene coverage. One shot captures every angle simultaneously.",
  },
];

export default function DeviceSupport() {
  return (
    <section className="py-28 px-6 bg-[#0d0d0d] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Supported hardware
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Built for serious field equipment.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device.name}
              className="group bg-white/5 border border-amber-400/20 rounded-2xl p-8 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-300"
            >
              <div className="text-5xl mb-5">{device.emoji}</div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">{device.name}</h3>
                <p className="text-amber-400 text-sm font-medium">{device.subtitle}</p>
              </div>

              <ul className="space-y-2 mb-5">
                {device.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="text-zinc-500 text-xs leading-relaxed border-t border-white/10 pt-4">
                {device.note}
              </p>

              <div className="mt-4 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 inline-flex items-center gap-1.5">
                <span className="text-amber-400 text-xs font-semibold">Optimized for training data quality</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
