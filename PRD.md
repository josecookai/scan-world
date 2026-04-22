# Scan the World — Product Requirements Document

**Version:** 0.2 draft  
**Date:** 2026-04-22  
**Status:** Draft for review

---

## 1. Vision

> Every person with a phone is a sensor. Together, they scan the world — and teach robots to understand it.

**Scan the World** is a crowdsourced video contribution platform. Users submit short video URLs (TikTok, YouTube) documenting real places, events, and moments. Each submission earns points. The aggregate becomes a living, human-curated world dataset — ground truth captured by the people who were there, structured for training robot foundation models.

---

## 2. Problem

Robot foundation models (embodied AI) need massive, diverse, real-world video data. Existing datasets (DROID, Open X-Embodiment, BridgeData V2) are lab-centric and geographically narrow. Meanwhile, billions of people carry a high-quality camera (iPhone) everywhere and post to TikTok and YouTube daily — but there is no incentive layer connecting contributors to an AI training mission. The data exists; the collection infrastructure and community layer do not.

---

## 3. Product Components

### 3.1 Landing Page

**Goal:** Convert visitors into contributors in < 60 seconds.

**Content sections:**
- **Hero** — mission statement + CTA ("Start scanning")
- **How it works** — 3 steps: Sign up → Shoot or find your video → Submit URL → Earn points
- **Why it matters** — "Your video trains the next generation of robots that understand the real world"
- **Leaderboard preview** — top contributors (social proof)
- **iPhone setup teaser** — "Don't know how to shoot? We'll teach you."
- **Dataset stats** — live counter: videos submitted, countries covered, hours of footage
- **FAQ** — what counts as a valid submission, point values, moderation

**Design direction:** Clean, mission-driven. Wikipedia × TikTok × academic credibility.

---

### 3.2 User Login System

**Requirements:**
- Sign up / login via: Email+password, Google OAuth, Apple Sign-In
- JWT-based session (Supabase Auth)
- User profile: username, avatar, bio, country, total points, submission count
- Email verification before first submission accepted
- Account deletion (GDPR)

**Profile page shows:**
- Points balance + tier badge
- Submission history (thumbnails, status, points earned)
- Referral link (bonus points when referral submits first video)
- Contribution to dataset stats (hours of footage contributed)

---

### 3.3 Video URL Submission

**Supported platforms (MVP):**
- TikTok (`tiktok.com/@*/video/*`)
- YouTube (`youtube.com/watch?v=*`, `youtu.be/*`, YouTube Shorts)

**Submission flow:**
1. User pastes a video URL
2. System validates URL + fetches metadata (title, thumbnail, duration, uploader) via oEmbed / public API
3. User adds: location tag (country + optional city), category tag, short description (optional)
4. System checks: not already submitted, video is public, duration ≥ 10 sec and ≤ 10 min
5. Submission enters `pending` → auto-moderation → `accepted` or `flagged`
6. On acceptance: points credited, submission enters dataset pipeline

**Submission categories:** nature, urban, infrastructure, transport, culture, weather, agriculture, construction, crowds, other

**Rejection criteria:** duplicates, private/deleted, NSFW, unrelated content (gaming, skits, music videos), military installations

---

### 3.4 Points System

**Earning points:**

| Action | Points |
|--------|--------|
| First submission ever | +50 |
| Submission accepted | +100 base |
| Rare location bonus (< 10 submissions from country) | +200 |
| Precise GPS tag added | +25 |
| Video ≥ 3 min | +50 |
| Daily streak (1+ submission/day) | +30/day |
| Referral signup (invitee submits first video) | +150 |
| Community upvote (per 10 votes) | +20 |

**Tiers:**

| Tier | Points | Badge | Perks |
|------|--------|-------|-------|
| Scout | 0 | 🔍 | Basic access |
| Explorer | 500 | 🌍 | Priority review |
| Correspondent | 2,000 | 📡 | Featured on homepage |
| Field Agent | 10,000 | 🛰️ | API access, early features |
| World Scanner | 50,000 | 🌐 | Global leaderboard, recognition |

**Leaderboard:** Global + by country. Monthly reset with bonus points for top 10.

---

### 3.5 iPhone Setup Guide — "How to Shoot"

**Goal:** Turn any smartphone user into a capable field recorder for robot-training data.

**Format:** In-app guide page + short video walkthroughs.

#### A. Camera settings
- Lock exposure + focus: long-press before recording
- Resolution: 4K 30fps (best for training data) or 1080p 60fps for motion
- Enable grid lines; disable Live Photos during recording
- Stabilization: Action mode for movement, standard for static scenes

#### B. Shooting principles
- **Horizontal always** — landscape orientation
- **Hold still** — brace against surfaces; slow intentional pans
- **Minimum 15 seconds per shot** — let the scene complete
- **Show full context** — wide establishing shot before close-ups
- **Natural light preferred** — avoid backlight; golden hour ideal

#### C. What to document (robot-relevant scenes)
- **Navigation scenes:** walking paths, stairs, doorways, corridors, crosswalks
- **Manipulation contexts:** kitchens, workshops, markets, construction sites
- **Human-object interaction:** carrying, opening, pouring, sorting, assembling
- **Outdoor environments:** varied terrain, weather conditions, different times of day
- **Urban infrastructure:** streets, transit, building entrances, parking

#### D. Before you upload
- Verify video is public on TikTok/YouTube
- Add accurate location tag
- Choose correct category
- Write a 1-line description of scene content

#### E. Safety
- Never film military installations or private property without permission
- Be aware of local recording laws
- Your safety > any video

---

### 3.6 Robot Foundation Model Dataset Pipeline

**Goal:** Aggregate user-submitted videos + existing iPhone-recorded robotics datasets into a unified, clean dataset suitable for training or fine-tuning robot foundation models (visual pre-training, VLA fine-tuning, world model training).

#### A. Existing Dataset Aggregation

Crawl, index, and mirror (or link) existing publicly available iPhone-recorded video datasets relevant to robotics:

| Dataset | Focus | Size | License |
|---------|-------|------|---------|
| DROID | Diverse robot manipulation | 76k episodes | Apache 2.0 |
| Open X-Embodiment | Cross-robot generalization | 1M+ episodes | Mixed |
| BridgeData V2 | Tabletop manipulation | 60k demos | CC BY 4.0 |
| Something-Something v2 | Hand-object interaction | 220k clips | Research |
| Ego4D | Egocentric daily life | 3,670 hours | Research |
| EPIC-Kitchens | Kitchen activities | 100 hours | Research |

Pipeline: metadata index → download links → standardized format → filtering for iPhone/first-person videos → embedding index.

#### B. User Submission Processing

For each accepted video URL:
1. **Download proxy:** fetch video via yt-dlp (no storage of raw video; extract frames only)
2. **Frame extraction:** 1 fps for scene diversity, 10 fps for motion-heavy segments
3. **Metadata enrichment:** GPS (if available), timestamp, device metadata (iPhone detection via EXIF)
4. **Quality filter:** blur detection, exposure check, minimum resolution (720p+)
5. **Scene classification:** indoor/outdoor, static/dynamic, category confirmation
6. **Embedding generation:** CLIP embeddings per frame → stored in vector DB
7. **Dataset record:** structured entry in `dataset_items` table with all metadata

#### C. Fine-tuning / Training Interface

Expose dataset for model consumption:

- **Download API:** filtered dataset export as HuggingFace Dataset format (parquet + JSONL manifest)
- **Streaming API:** frame-level stream for online training pipelines
- **Filter dimensions:** location, category, time range, quality score, minimum duration
- **Dataset cards:** auto-generated per dataset version (HuggingFace hub compatible)

**Target model families for fine-tuning:**
- OpenVLA (open vision-language-action)
- Octo (generalist robot policy)
- π0 (Physical Intelligence) — fine-tuning interface when open-sourced
- Custom visual pre-training (CLIP / SigLIP fine-tune on world footage)

#### D. Dataset Versioning

- Snapshot dataset monthly (frozen versions for reproducible research)
- Changelog per version: new videos added, videos removed (DMCA), quality threshold changes
- DOI registration for each frozen version (Zenodo integration post-MVP)

---

## 4. User Journey (MVP)

```
Land on homepage
  → Read mission / see live dataset stats + leaderboard
  → Sign up (Google or email)
  → Onboarding: "How to Shoot" guide (skippable)
  → Submit first URL → validate → add location + category
  → Pending → Email: "Accepted! +150 points"
  → Profile: see points, tier progress, hours contributed to dataset
  → Keep submitting / share referral link
```

---

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| Auth | Supabase Auth (Google, Apple, email) |
| Database | Supabase Postgres |
| Video metadata | YouTube Data API v3, TikTok oEmbed |
| Video processing | yt-dlp + ffmpeg (frame extraction, worker service) |
| Embeddings | CLIP via HuggingFace transformers |
| Vector DB | pgvector (Supabase extension) |
| Moderation | Rule-based v0.1 → Claude Haiku for flagged content |
| Dataset export | HuggingFace Datasets library |
| Hosting | Vercel (frontend) + Supabase (DB) + Cloud Run (video worker) |

---

## 6. Database Schema (Key Tables)

```sql
users               -- extends auth.users: username, bio, country, points, tier
submissions         -- url, platform, video_id, title, thumbnail, duration,
                    --   location_country, location_city, lat, lng, category,
                    --   description, status, points_awarded, submitted_at
point_events        -- user_id, amount, reason, metadata, created_at
referrals           -- referrer_id, referee_id, bonus_awarded
dataset_items       -- submission_id, frame_count, quality_score, clip_embedding_ids,
                    --   processing_status, dataset_version
external_datasets   -- name, source_url, license, item_count, download_url, indexed_at
```

---

## 7. MVP Scope (v0.1)

**In scope:**
- Landing page with live stats counter
- Supabase Auth (Google + email)
- Video URL submission (TikTok + YouTube) with oEmbed validation
- Points on acceptance (rule-based)
- User profile + submission history
- Global + country leaderboard
- "How to Shoot" guide page
- External dataset index (metadata only, no processing)

**Post-MVP (v0.2+):**
- Video frame extraction + CLIP embeddings
- HuggingFace dataset export API
- Referral tracking
- Daily streak calculation
- Community upvotes
- Map view of submissions
- Fine-tuning pipeline integration

---

## 8. Open Questions

1. **Video hosting** — we fetch metadata from TikTok/YouTube but don't host video. Frame extraction requires temporary download. What's the legal / ToS posture for yt-dlp usage?
2. **TikTok API** — oEmbed works for thumbnails. Duration requires scraping or TikTok developer API approval. How to handle?
3. **CLIP compute cost** — embedding 1fps frames at scale requires GPU. Cloud Run with GPU, or batch via Modal/Replicate?
4. **Dataset licensing** — user-submitted URL metadata is ours; the underlying video content is the creator's. Dataset cards must be clear that we index references, not host content. Legal review needed.
5. **Sybil resistance** — points economy must be non-gameable before any real reward layer. Minimum: email verification + rate limiting + duplicate video detection. What else?
6. **iPhone detection** — not all user videos will be iPhone-recorded. Do we filter strictly (iPhone only) or accept all mobile video and tag device?
7. **Existing dataset licensing** — DROID (Apache 2.0) is clean. Some datasets are research-only. Need legal review before including in a commercial pipeline.

---

## 9. Agent Build Plan

See `AGENTS.md` for the 10-agent parallel build breakdown.
