import Link from "next/link";

const links = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Datasets", href: "/datasets" },
  { label: "Guide", href: "/guide" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <span className="text-2xl">🌍</span>
              <span>Scan the World</span>
            </div>
            <p className="text-zinc-600 text-sm">Mapping the world, one video at a time.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-zinc-500 text-sm hover:text-white transition-colors"
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-zinc-700 text-xs">
            &copy; 2026 Scan the World. Built to help robots understand the real world.
          </p>
        </div>
      </div>
    </footer>
  );
}
