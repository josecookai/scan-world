# 🌍 Scan the World

> **Every person with a phone is a sensor. Together, they scan the world — and teach robots to understand it.**

---

## The Vision

Robot foundation models are about to change everything. But they have a critical blind spot: **they've never lived in the real world.**

Existing robotics datasets (DROID, Open X-Embodiment, BridgeData) are lab-grown — collected in controlled environments with narrow geographic scope. Meanwhile, 5 billion people carry a high-quality camera in their pocket, recording real streets, kitchens, construction sites, and markets every single day.

**The data exists. The bridge doesn't.**

Scan the World is that bridge. A crowdsourced video contribution platform where humans become the ground-truth sensors for embodied AI. You submit a video. We validate it. It becomes training data for the robots that will navigate, manipulate, and understand the world we actually live in.

---

## Why This Matters

| What exists today | What's missing |
|-------------------|----------------|
| Lab-recorded robot demonstrations | Real-world human perspective |
| Controlled indoor scenes | Streets, weather, crowds, chaos |
| Narrow geography (mostly US/EU) | Global diversity — Africa, Asia, South America |
| Synthetic environments | Natural light, real textures, actual physics |

**Robot models trained on lab data fail the moment they step outside.** We need footage from the places robots will actually operate — and only the people who live there can capture it.

---

## How It Works

### For Contributors (Anyone with a phone)

```
1. Sign up → Get your unique #scanworld{code}
2. Shoot or find your video → Add the hashtag
3. Submit the URL → Earn points when accepted
4. Climb the leaderboard → Unlock tiers & recognition
```

**Points system:**
- Base points for every accepted submission
- Bonus for rare locations, high quality, precise GPS tags
- Daily streaks, referral rewards, community upvotes

**Tiers:** Scout → Explorer → Correspondent → Field Agent → World Scanner

### For Researchers & Model Builders

- Browse indexed video metadata (location, category, quality scores)
- Filter by geography, scene type, device, time range
- Export structured datasets (HuggingFace-compatible format)
- Combine with existing robotics datasets for richer training

---

## What We're Building

### MVP Features (Live)
- ✅ User auth (email/password) with Supabase
- ✅ Video URL submission (YouTube + TikTok)
- ✅ Ownership verification via hashtag
- ✅ Admin moderation queue with scoring UI
- ✅ Points & tier system
- ✅ Global + country leaderboards
- ✅ "How to Shoot" guide for contributors
- ✅ External dataset catalog (DROID, Ego4D, EPIC-Kitchens, etc.)

### Coming Next
- 🔄 Frame extraction + CLIP embeddings
- 🔄 HuggingFace dataset export API
- 🔄 Google/Apple OAuth
- 🔄 Map view of global submissions
- 🔄 Referral tracking & daily streaks
- 🔄 Community upvotes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Video metadata | YouTube oEmbed / TikTok oEmbed |
| Moderation | Rule-based + admin scoring UI |
| Dataset export | Planned: HuggingFace Datasets format |
| Hosting | Vercel (frontend) + Supabase (DB) |

---

## Database Architecture

Key tables:
- `users` — profiles, points, tiers, roles
- `submissions` — video URLs with metadata, status, quality scores
- `point_events` — immutable ledger of all point transactions
- `external_datasets` — catalog of third-party robotics datasets

See `supabase/migrations/` for full schema, RLS policies, and PL/pgSQL functions for tier calculation and point awarding.

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/josecookai/scan-world.git
cd scan-world
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase URL, anon key, and service role key

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Product Requirements

Full PRD with detailed specifications: [`PRD.md`](./PRD.md)

---

## License

MIT — built in the open for the future of embodied AI.

---

> *"The best dataset for training robots isn't in a lab. It's in your pocket."*
