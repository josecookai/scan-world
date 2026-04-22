import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-black border-t border-white/5">
      <div className="flex flex-col gap-1 items-center md:items-start">
        <span className="text-white font-bold tracking-[0.2em] uppercase text-sm">
          SCAN WORLD
        </span>
        <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 text-center md:text-left">
          Decentralized Data Engine for Physical AI
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <Link
          href="/guide"
          className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 hover:text-white transition-colors"
        >
          Guide
        </Link>
        <Link
          href="/datasets"
          className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 hover:text-white transition-colors"
        >
          Datasets
        </Link>
        <Link
          href="/leaderboard"
          className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 hover:text-white transition-colors"
        >
          Leaderboard
        </Link>
        <a
          href="https://github.com/josecookai/scan-world"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 hover:text-white transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
