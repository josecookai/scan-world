const tiers = [
  { badge: "🔍", name: "Scout", points: "0", highlighted: false },
  { badge: "🌍", name: "Explorer", points: "500+", highlighted: true },
  { badge: "📡", name: "Correspondent", points: "2,000+", highlighted: false },
  { badge: "🛰️", name: "Field Agent", points: "10,000+", highlighted: false },
  { badge: "🌐", name: "World Scanner", points: "50,000+", highlighted: false },
];

const pointFactors = [
  { label: "Video Quality", detail: "0–100 score per submission" },
  { label: "Device Type", detail: "iPhone, GoPro, Insta360 earn a bonus" },
  { label: "Location Rarity", detail: "Underrepresented regions score higher" },
  { label: "Scene Category", detail: "Diverse environments valued more" },
];

export default function TiersSection() {
  return (
    <section className="py-28 px-6 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Reward system
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            The more you contribute,
            <br className="hidden sm:block" />
            the higher you climb.
          </h2>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                tier.highlighted
                  ? "bg-amber-400/10 border-amber-400/40 shadow-lg shadow-amber-400/10"
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-[#0a0a0a] text-xs font-bold">
                  Your tier
                </div>
              )}
              <span className="text-3xl">{tier.badge}</span>
              <div className="text-center">
                <p className={`font-bold text-sm ${tier.highlighted ? "text-amber-400" : "text-white"}`}>
                  {tier.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{tier.points} pts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Point factors */}
        <div className="border-t border-white/10 pt-10">
          <p className="text-center text-zinc-500 text-sm font-medium mb-6 uppercase tracking-wider">
            How points are calculated
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pointFactors.map((factor) => (
              <div key={factor.label} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-400/20 transition-all">
                <p className="text-amber-400 text-sm font-semibold mb-1">{factor.label}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{factor.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
