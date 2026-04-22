import Link from "next/link"
import Navbar from "@/components/Navbar"
import GuideSection from "@/components/guide/GuideSection"
import TipCard from "@/components/guide/TipCard"
import StepList from "@/components/guide/StepList"
import SafetyNote from "@/components/guide/SafetyNote"
import DeviceTab from "@/components/guide/DeviceTab"
import TableOfContents from "@/components/guide/TableOfContents"
import MobileTOC from "@/components/guide/MobileTOC"

export const metadata = {
  title: "How to Shoot — Scan the World",
  description:
    "Record footage that scores high and helps train the next generation of robots.",
}

const SHOOTING_PRINCIPLES = [
  {
    icon: "📐",
    title: "Horizontal Always",
    body: "Landscape orientation only. Portrait video cannot be used for robot training. Zero exceptions.",
  },
  {
    icon: "🏗️",
    title: "Hold Still",
    body: "Brace against walls, lampposts, or fences. If walking, walk slowly and smoothly. Jerky footage scores below 40.",
  },
  {
    icon: "⏱️",
    title: "Minimum 15 Seconds",
    body: "Each clip should show the scene completing. Don't cut too early — give the model time to learn.",
  },
  {
    icon: "🔭",
    title: "Wide to Close",
    body: "Start with an establishing wide shot showing context, then move closer to the subject.",
  },
  {
    icon: "☀️",
    title: "Natural Light",
    body: "Avoid backlighting. Golden hour (dawn/dusk) footage scores highest. Midday harsh shadows reduce your score.",
  },
  {
    icon: "🔄",
    title: "Slow Pans",
    body: "If you must move the camera, pan at 5–10 seconds per 90 degrees. Fast pans score poorly.",
  },
]

const UPLOAD_STEPS = [
  { text: "Make sure your video is PUBLIC on TikTok or YouTube" },
  { text: "Add an accurate location (country + city)" },
  { text: "Choose the closest category" },
  { text: "Write a 1-sentence description of what's in the video" },
  { text: "Check duration: minimum 10 seconds, maximum 10 minutes" },
  { text: "Come back here and submit the URL" },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-blue-600/8 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Shooting guide
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              How to Shoot for
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              World Scanning
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Record footage that scores high and helps train the next generation of robots.
          </p>
        </div>
      </section>

      {/* Main layout: sidebar + content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex gap-12">
          {/* Sticky sidebar — desktop only */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-16">
            {/* Mobile TOC */}
            <MobileTOC />

            {/* Section 1: Camera Settings */}
            <GuideSection id="camera-settings" title="Camera Settings" icon="📷">
              <p className="text-zinc-400 text-sm mb-6">
                Select your device to see the recommended settings.
              </p>
              <DeviceTab />
            </GuideSection>

            {/* Section 2: Shooting Principles */}
            <GuideSection id="shooting-principles" title="Shooting Principles" icon="🎬">
              <div className="grid gap-3 sm:grid-cols-2">
                {SHOOTING_PRINCIPLES.map((tip) => (
                  <TipCard
                    key={tip.title}
                    icon={tip.icon}
                    title={tip.title}
                    body={tip.body}
                  />
                ))}
              </div>
            </GuideSection>

            {/* Section 3: What to Document */}
            <GuideSection id="what-to-document" title="What to Document" icon="🗺️">
              <div className="space-y-5">
                {/* Navigation */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🚶</span>
                    <h3 className="font-bold text-white">Navigation Scenes</h3>
                    <span className="ml-auto text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full">
                      +30 pts bonus
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                    Walking paths, stairs, doorways, corridors, crosswalks.
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-3">
                    <span className="text-zinc-300 font-medium">Why it matters:</span> Robots
                    need to navigate these spaces. Real-world diversity is scarce in lab datasets.
                  </p>
                  <TipCard
                    icon="💡"
                    title="Pro tip"
                    body="Walk through the scene yourself, recording from your own perspective — first-person navigation data is especially valuable."
                    variant="green"
                  />
                </div>

                {/* Manipulation */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🤖</span>
                    <h3 className="font-bold text-white">Manipulation Contexts</h3>
                    <span className="ml-auto text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full">
                      +25 pts bonus
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                    Kitchens, workshops, markets, construction sites, labs.
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-3">
                    <span className="text-zinc-300 font-medium">Why it matters:</span> Robot
                    manipulation models train on these environments to learn how to handle objects.
                  </p>
                  <TipCard
                    icon="💡"
                    title="Pro tip"
                    body="Film objects on surfaces, hands working, tools being used — the more context the better."
                    variant="green"
                  />
                </div>

                {/* Outdoor Environments */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🌤️</span>
                    <h3 className="font-bold text-white">Outdoor Environments</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                    Varied terrain, different weather, different times of day.
                  </p>
                  <TipCard
                    icon="❄️"
                    title="Rare conditions score high"
                    body="Snow, rain, and fog are especially valuable — they're underrepresented in most datasets. Different countries also increase geographic diversity and your score."
                    variant="cyan"
                  />
                </div>

                {/* Urban Infrastructure */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🏙️</span>
                    <h3 className="font-bold text-white">Urban Infrastructure</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Streets, transit, building entrances, parking structures, traffic,
                    pedestrians, signage. Valuable for autonomous vehicle and delivery robot
                    training.
                  </p>
                </div>

                {/* Nature + Agriculture */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🌾</span>
                    <h3 className="font-bold text-white">Nature + Agriculture</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Forests, farms, coastlines, mountains. Animal interactions, farming
                    activities. Severely underrepresented in robot datasets — every clip counts.
                  </p>
                </div>
              </div>
            </GuideSection>

            {/* Section 4: Before You Upload */}
            <GuideSection id="before-you-upload" title="Before You Upload" icon="📤">
              <p className="text-zinc-400 text-sm mb-6">
                Run through this checklist before submitting your URL.
              </p>
              <StepList steps={UPLOAD_STEPS} />
            </GuideSection>

            {/* Section 5: Safety Guidelines */}
            <GuideSection id="safety-guidelines" title="Safety Guidelines" icon="🛡️">
              <div className="space-y-3">
                <SafetyNote>
                  Never film military bases, checkpoints, or sensitive government buildings
                </SafetyNote>
                <SafetyNote>
                  Check local laws — some countries restrict public recording in certain areas
                </SafetyNote>
                <SafetyNote>
                  Never put yourself in danger for footage. No video is worth injury.
                </SafetyNote>
                <SafetyNote>
                  Respect people&apos;s privacy — avoid filming individuals&apos; faces without
                  consent
                </SafetyNote>
                <SafetyNote type="ok">
                  Public spaces, nature, infrastructure, and your own environment are generally
                  fine to film
                </SafetyNote>
              </div>
            </GuideSection>

            {/* CTA */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-400/20 bg-cyan-400/5 p-10 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-cyan-400/10 blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to start?
                </h2>
                <p className="text-zinc-400 mb-8">
                  You know what you need. Go capture the world.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-400 text-[#0a0a0a] font-bold text-base hover:bg-cyan-300 transition-all hover:scale-105 shadow-lg shadow-cyan-400/20"
                >
                  Submit your first video →
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
