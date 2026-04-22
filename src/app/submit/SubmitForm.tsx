"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import UrlInput from "@/components/submission/UrlInput"
import VideoPreview from "@/components/submission/VideoPreview"
import { COUNTRIES } from "@/lib/countries"
import type { DeviceType, SubmissionCategory } from "@/types"

interface VideoMeta {
  platform: "youtube" | "tiktok"
  video_id: string
  title: string | null
  thumbnail_url: string | null
}

interface SuccessState {
  submission_id: string
  videoMeta: VideoMeta
  thumbnail_url: string | null
}

const DEVICE_OPTIONS: { value: DeviceType; label: string }[] = [
  { value: "iphone", label: "iPhone" },
  { value: "gopro", label: "GoPro" },
  { value: "insta360", label: "Insta360 360°" },
  { value: "android", label: "Android" },
  { value: "other", label: "Other" },
]

const CATEGORY_OPTIONS: { value: SubmissionCategory; label: string }[] = [
  { value: "nature", label: "Nature" },
  { value: "urban", label: "Urban" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "transport", label: "Transport" },
  { value: "culture", label: "Culture" },
  { value: "weather", label: "Weather" },
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "crowds", label: "Crowds" },
  { value: "other", label: "Other" },
]

interface SubmitFormProps {
  verificationCode: number
}

export default function SubmitForm({ verificationCode }: SubmitFormProps) {
  const hashtag = `#scanworld${verificationCode}`
  const [url, setUrl] = useState("")
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null)
  const [deviceType, setDeviceType] = useState<DeviceType>("iphone")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [category, setCategory] = useState<SubmissionCategory>("nature")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successState, setSuccessState] = useState<SuccessState | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleValidated = useCallback((meta: VideoMeta | null) => {
    setVideoMeta(meta)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(hashtag).then(() => {
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoMeta) return
    if (!country) {
      setSubmitError("Please select a country")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          device_type: deviceType,
          location_country: country,
          location_city: city.trim() || undefined,
          category,
          description: description.trim() || undefined,
        }),
      })

      const data = await response.json() as { success: boolean; submission_id?: string; error?: string }

      if (data.success && data.submission_id) {
        setSuccessState({
          submission_id: data.submission_id,
          videoMeta,
          thumbnail_url: videoMeta.thumbnail_url,
        })
      } else {
        setSubmitError(data.error ?? "Submission failed. Please try again.")
      }
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAnother = () => {
    setUrl("")
    setVideoMeta(null)
    setDeviceType("iphone")
    setCountry("")
    setCity("")
    setCategory("nature")
    setDescription("")
    setSubmitError(null)
    setSuccessState(null)
  }

  if (successState) {
    return <SuccessView successState={successState} onSubmitAnother={handleSubmitAnother} />
  }

  const selectClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm outline-none focus:border-cyan-400/50 transition-colors appearance-none cursor-pointer"

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm placeholder-zinc-500 outline-none focus:border-cyan-400/50 transition-colors"

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-16 px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to home
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Submit a Video
          </h1>
          <p className="text-zinc-400 text-base">
            Share real-world footage and earn points when it&apos;s accepted.
          </p>
        </div>

        {/* Verification code banner */}
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
          <p className="text-sm font-semibold text-amber-300 mb-1">
            Step 1 — Add your scan code to the video before submitting
          </p>
          <p className="text-xs text-zinc-400 mb-3">
            <span className="text-white font-medium">YouTube:</span> paste it anywhere in the video description.{" "}
            <span className="text-white font-medium">TikTok:</span> add it as a hashtag in the caption.
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 rounded-lg border border-amber-500/30 bg-black/40 px-4 py-2.5 text-sm font-mono text-amber-300 select-all">
              {hashtag}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          {/* URL Input */}
          <UrlInput value={url} onChange={setUrl} onValidated={handleValidated} />

          {/* Video preview */}
          {videoMeta && (
            <VideoPreview
              platform={videoMeta.platform}
              title={videoMeta.title}
              thumbnail_url={videoMeta.thumbnail_url}
              video_id={videoMeta.video_id}
            />
          )}

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Device type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Device Type <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className={selectClass}
                required
              >
                {DEVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-900">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Country + City row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Country <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="" className="bg-zinc-900">Select country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-900">
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                City <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Tokyo"
                className={inputClass}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SubmissionCategory)}
                className={selectClass}
                required
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-900">
                    {opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-300">
                Description <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <span className="text-xs text-zinc-500">{description.length}/200</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="What does this footage show? Any context is helpful…"
              rows={3}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Error message */}
          {submitError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {submitError}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!videoMeta || isSubmitting}
            className="w-full py-4 rounded-xl bg-cyan-400 text-[#0a0a0a] font-bold text-base hover:bg-cyan-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Video"
            )}
          </button>

          {!videoMeta && (
            <p className="text-center text-xs text-zinc-600">
              Paste a valid YouTube or TikTok URL above to enable submission
            </p>
          )}
        </form>

        {/* Info note */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Points are awarded 24 hours after admin review and acceptance
        </p>
      </div>
    </div>
  )
}

function SuccessView({
  successState,
  onSubmitAnother,
}: {
  successState: SuccessState
  onSubmitAnother: () => void
}) {
  const { videoMeta } = successState
  const thumbnail =
    videoMeta.thumbnail_url ??
    (videoMeta.platform === "youtube"
      ? `https://img.youtube.com/vi/${videoMeta.video_id}/hqdefault.jpg`
      : null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6 10-12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-2">Submitted!</h2>
          <p className="text-zinc-400">
            Your video is under review. Points will be awarded within 24 hours after scoring.
          </p>
        </div>

        {/* Video card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-left">
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={videoMeta.title ?? "Submitted video"}
              className="w-full h-44 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                {videoMeta.platform === "youtube" ? "▶️ YouTube" : "🎵 TikTok"}
              </span>
              <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Pending review
              </span>
            </div>
            {videoMeta.title && (
              <p className="text-sm text-white font-medium line-clamp-2">{videoMeta.title}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onSubmitAnother}
            className="w-full py-3 rounded-xl bg-cyan-400 text-[#0a0a0a] font-bold text-sm hover:bg-cyan-300 transition-colors"
          >
            Submit another video
          </button>
          <Link
            href="/"
            className="w-full py-3 rounded-xl border border-white/10 text-zinc-400 text-sm hover:text-white hover:border-white/20 transition-colors block"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
