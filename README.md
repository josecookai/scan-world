# 🌍 Scan the World

> **The world's first decentralized Data Engine for Physical AI.**
> 
> *Inspired by [LeRobot](https://github.com/huggingface/lerobot) · Powered by humans · Owned by no one*

---

## The Mission

**Scale AI built the data engine for LLMs. We're building the data engine for World Models.**

The next frontier of AI isn't chatbots. It's robots that understand the physical world — that can walk into any kitchen, any construction site, any forest path, and just *know* what to do.

But here's the problem: **the models don't have eyes.**

World models and robotics foundation models need billions of hours of first-person, real-world video. Not lab footage. Not synthetic renders. *Human perspective* — the way we actually see and move through the world.

**5 billion people carry a camera in their pocket.** Every day they record streets, stairs, doorways, workshops, markets, bedrooms, hikes, traffic jams, sunsets, rain. The data exists. It just isn't organized, validated, or connected to the AI systems that desperately need it.

**Scan the World is that bridge.**

A blockchain-incentivized, open-data engine that turns every phone on Earth into a sensor for physical AI. Contributors submit first-person videos. Validators verify quality. Researchers download structured datasets. Everyone earns tokens for their contribution.

No company owns it. No single lab controls it. The world trains the world.

---

## What We Believe

| Centralized Data Engines (Scale AI) | Decentralized Data Engine (Scan the World) |
|---|---|
| Pay contractors in developing countries pennies | **Tokenized rewards — anyone earns, everywhere** |
| Single company owns the data | **Community-owned dataset, open to all researchers** |
| Limited geographic coverage | **Global by default — every country, every terrain** |
| Synthetic or studio-captured | **Real human perspective — egocentric, authentic** |
| Closed APIs, opaque pricing | **Open source, transparent, HuggingFace-compatible** |

---

## How It Works

### For Contributors — *"Your eyes are valuable"*

```
1. Sign up → Get your wallet + unique #scanworld{code}
2. Shoot first-person video → iPhone, GoPro, any camera
3. Add your scan code → Upload to YouTube/TikTok with hashtag
4. Submit the URL → Validators review for quality & authenticity
5. Earn tokens → Instant rewards for accepted submissions + ongoing royalties
```

**What to film:**
- **Navigation:** walking through doorways, up stairs, across streets, into elevators
- **Manipulation:** cooking, assembling, sorting, opening containers, using tools
- **Environments:** rain, snow, dusk, crowded markets, quiet forests, busy highways
- **Human interaction:** handing objects, gesturing, working alongside others
- **Terrain:** gravel, grass, tiles, carpet, mud, sand, ice

**The rule:** Film what a robot would need to see to understand your world.

### For Validators — *"Quality is the product"*

- Review submissions for authenticity, relevance, and quality
- Stake tokens to validate — earn rewards for accurate assessments, lose stake for fraud
- Help curate the world's most diverse physical AI dataset

### For Researchers — *"Data that doesn't exist anywhere else"*

- Browse indexed video by location, category, device, quality score
- Download structured exports (HuggingFace Dataset format, Parquet + manifest)
- Combine with LeRobot, Open X-Embodiment, DROID for richer training
- Attribution to original contributors in dataset cards

---

## The Token Economy

### $SCAN Token

| Action | Reward |
|---|---|
| Submit first video | 50 $SCAN |
| Video accepted | 100-500 $SCAN (based on quality + rarity) |
| Validate correctly | 10 $SCAN per review |
| Rare location bonus | 2x multiplier (first 10 videos from a country) |
| Precise GPS tag | +25 $SCAN |
| Video ≥ 3 min | +50 $SCAN |
| Daily streak | +30 $SCAN/day |
| Referral submits first video | +150 $SCAN |

### Tiers

| Tier | Points | Badge | Perks |
|---|---|---|---|
| **Scout** | 0 | 🔍 | Basic access |
| **Explorer** | 500 | 🌍 | Priority review |
| **Correspondent** | 2,000 | 📡 | Featured contributor |
| **Field Agent** | 10,000 | 🛰️ | Validator rights, API access |
| **World Scanner** | 50,000 | 🌐 | Governance voting, dataset curation |

### Dataset Royalties

When researchers download or cite a dataset containing your footage, you earn ongoing $SCAN rewards. The more useful your data, the more you earn — forever.

---

## Target Model Ecosystem

Scan the World feeds directly into the open robotics ecosystem:

- **[LeRobot](https://github.com/huggingface/lerobot)** — End-to-end robot learning in PyTorch
- **[Open X-Embodiment](https://robotics-transformer-x.github.io)** — Cross-robot generalization
- **[π₀ (Physical Intelligence)](https://www.physicalintelligence.company)** — Generalist robot policies
- **[OpenVLA](https://openvla.github.io)** — Open vision-language-action models
- **World Models** — Video prediction models for embodied reasoning

**What we add that no one else has:**
- Billions of hours of egocentric, unscripted, global footage
- Natural human behavior (not teleoperated robot demos)
- Geographic diversity that lab datasets can't replicate
- Real-world lighting, weather, wear-and-tear on environments

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Contributors   │────▶│  Scan the World  │────▶│   Researchers   │
│  (5B phones)     │     │  Protocol        │     │  (Robotics AI)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                        ▲
         │                       ▼                        │
         │            ┌──────────────────┐               │
         │            │  Validation      │               │
         └───────────▶│  Layer (Staked)  │───────────────┘
                      │  Quality Scoring │
                      └──────────────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │  Dataset Engine  │
                      │  Frame extract   │
                      │  CLIP embed      │
                      │  HuggingFace exp │
                      └──────────────────┘
```

**Tech Stack:**

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + TypeScript + Tailwind |
| Auth | Supabase Auth (email + OAuth coming) |
| Database | Supabase Postgres with RLS |
| Blockchain | Solana / EVM (planned — currently points system) |
| Video pipeline | yt-dlp + ffmpeg frame extraction |
| Embeddings | CLIP via HuggingFace |
| Dataset export | HuggingFace Datasets (Parquet + JSONL) |
| Hosting | Vercel + Supabase |

---

## Database Schema (Key Concepts)

- `users` — profiles, wallet addresses, points, tiers, roles
- `submissions` — video URLs with metadata, quality scores, on-chain hashes
- `point_events` — immutable ledger of all token transactions
- `dataset_items` — processed frames with CLIP embeddings, dataset version
- `external_datasets` — catalog of third-party robotics datasets (DROID, Ego4D, etc.)

See `supabase/migrations/` for full schema, triggers, and PL/pgSQL functions.

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/josecookai/scan-world.git
cd scan-world
npm install

# Set up environment
cp .env.example .env.local
# Add Supabase URL, anon key, service role key
# Add YouTube Data API key (optional, for ownership verification)

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Roadmap

### Now (MVP)
- ✅ User auth & profiles
- ✅ Video submission (YouTube/TikTok) with hashtag verification
- ✅ Admin moderation queue + quality scoring
- ✅ Points & leaderboard system
- ✅ External dataset catalog

### Next
- 🔄 Wallet integration + $SCAN token on-chain
- 🔄 Staked validator network
- 🔄 Frame extraction pipeline + CLIP embeddings
- 🔄 HuggingFace dataset export
- 🔄 Map view of global submissions

### Future
- 🌑 On-chain dataset NFTs (attribution + royalty tracking)
- 🌑 Real-time streaming for live robot training
- 🌑 Partnership with LeRobot for native dataset integration
- 🌑 Mobile app for direct capture & upload

---

## Why This Wins

**Scale AI** charges enterprises $millions for curated data. They hire contractors in low-wage countries. The data is proprietary. The workers are invisible.

**Scan the World** inverts that:
- Contributors are owners, not labor
- Data is open, not locked in a vault
- Quality is enforced by economic stake, not managers
- Geography is a feature, not a bug
- The more diverse the data, the more valuable the dataset

**The best data engine for physical AI isn't a company. It's a protocol.**

---

## Join Us

- 🌐 **Website:** [scantheworld.xyz](https://scantheworld.xyz) *(coming)*
- 💬 **Discord:** *(coming)*
- 🐦 **Twitter/X:** *(coming)*
- 📧 **Contact:** *(coming)*

---

## License

MIT — built in the open for the future of embodied AI.

---

> *"The camera in your pocket is the most important sensor for the next generation of AI. Don't let it go to waste."*
