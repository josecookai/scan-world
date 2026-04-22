import Link from "next/link";

const leaders = [
  { rank: 1, initials: "MK", name: "Maria K.", country: "🇧🇷", points: "48,230", tier: "World Scanner", color: "bg-amber-400" },
  { rank: 2, initials: "JT", name: "Jun T.", country: "🇯🇵", points: "31,540", tier: "Field Agent", color: "bg-cyan-400" },
  { rank: 3, initials: "AR", name: "Ahmed R.", country: "🇪🇬", points: "24,180", tier: "Field Agent", color: "bg-blue-500" },
  { rank: 4, initials: "PS", name: "Priya S.", country: "🇮🇳", points: "12,760", tier: "Field Agent", color: "bg-violet-500" },
  { rank: 5, initials: "LF", name: "Lucas F.", country: "🇫🇷", points: "8,490", tier: "Correspondent", color: "bg-emerald-500" },
];

const rankStyles: Record<number, string> = {
  1: "text-amber-400 font-black",
  2: "text-zinc-300 font-black",
  3: "text-amber-600 font-black",
};

export default function LeaderboardPreview() {
  return (
    <section id="leaderboard" className="py-28 px-6 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Community
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Top World Scanners this month
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-white/10 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Contributor</span>
            <span className="col-span-3 text-right">Points</span>
            <span className="col-span-3 text-right">Tier</span>
          </div>

          {/* Rows */}
          {leaders.map((leader, i) => (
            <div
              key={leader.rank}
              className={`grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-white/5 ${
                i < leaders.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              {/* Rank */}
              <span className={`col-span-1 text-lg ${rankStyles[leader.rank] ?? "text-zinc-500 font-semibold"}`}>
                {leader.rank}
              </span>

              {/* Avatar + Name */}
              <div className="col-span-5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${leader.color} flex items-center justify-center text-[#0a0a0a] text-xs font-black flex-shrink-0`}>
                  {leader.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{leader.name}</p>
                  <p className="text-zinc-600 text-xs">{leader.country}</p>
                </div>
              </div>

              {/* Points */}
              <span className="col-span-3 text-right text-amber-400 font-bold text-sm">
                {leader.points}
              </span>

              {/* Tier */}
              <span className="col-span-3 text-right">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-xs font-medium">
                  {leader.tier}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/leaderboard"
            className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            View Full Leaderboard
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
