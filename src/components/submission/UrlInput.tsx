"use client"

import { useState, useCallback } from "react"

interface VideoMeta {
  platform: "youtube" | "tiktok"
  video_id: string
  title: string | null
  thumbnail_url: string | null
}

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onValidated: (meta: VideoMeta | null) => void
}

type ValidationState = "idle" | "loading" | "valid" | "invalid"

export default function UrlInput({ value, onChange, onValidated }: UrlInputProps) {
  const [validationState, setValidationState] = useState<ValidationState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validate = useCallback(
    async (url: string) => {
      if (!url.trim()) {
        setValidationState("idle")
        setErrorMessage(null)
        onValidated(null)
        return
      }

      setValidationState("loading")
      setErrorMessage(null)

      try {
        const response = await fetch("/api/submit/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        })
        const data = await response.json() as {
          valid: boolean
          error?: string
          platform?: "youtube" | "tiktok"
          video_id?: string
          title?: string | null
          thumbnail_url?: string | null
        }

        if (data.valid && data.platform && data.video_id) {
          setValidationState("valid")
          onValidated({
            platform: data.platform,
            video_id: data.video_id,
            title: data.title ?? null,
            thumbnail_url: data.thumbnail_url ?? null,
          })
        } else {
          setValidationState("invalid")
          setErrorMessage(data.error ?? "Invalid URL")
          onValidated(null)
        }
      } catch {
        setValidationState("invalid")
        setErrorMessage("Could not validate URL")
        onValidated(null)
      }
    },
    [onValidated]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    // Auto-prepend https:// if user types a raw domain (no protocol)
    if (newValue && !newValue.match(/^https?:\/\//i) && newValue.includes(".")) {
      // Only prepend if it looks like a URL starting with a domain
      const domainStart = newValue.match(/^[\w-]+\./)
      if (domainStart) {
        newValue = `https://${newValue}`
      }
    }
    onChange(newValue)
    // Reset state while typing
    if (validationState !== "idle") {
      setValidationState("idle")
      setErrorMessage(null)
      onValidated(null)
    }
  }

  const handleBlur = () => {
    validate(value)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text")
    // Validate immediately on paste
    setTimeout(() => validate(pasted), 0)
  }

  const borderColor =
    validationState === "valid"
      ? "border-emerald-500"
      : validationState === "invalid"
      ? "border-red-500"
      : "border-white/10 focus-within:border-cyan-400/50"

  const platformIcon =
    validationState === "valid"
      ? value.includes("tiktok")
        ? "🎵"
        : "▶️"
      : null

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Video URL <span className="text-red-400">*</span>
      </label>
      <div className={`relative flex items-center rounded-xl border bg-white/5 transition-colors ${borderColor}`}>
        <input
          type="url"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder="Paste your YouTube or TikTok URL here…"
          className="flex-1 bg-transparent px-4 py-4 text-white placeholder-zinc-500 outline-none text-base"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="pr-4 flex items-center gap-2">
          {validationState === "loading" && (
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-cyan-400 animate-spin" />
          )}
          {validationState === "valid" && (
            <div className="flex items-center gap-1.5">
              {platformIcon && <span className="text-lg">{platformIcon}</span>}
              <span className="text-emerald-400">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10l4.5 4.5L16 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          )}
          {validationState === "invalid" && (
            <span className="text-red-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 6l8 8M14 6l-8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
        </div>
      </div>
      {validationState === "invalid" && errorMessage && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
      {validationState === "idle" && (
        <p className="text-xs text-zinc-500">
          Supported: youtube.com, youtu.be, youtube.com/shorts, tiktok.com, vm.tiktok.com
        </p>
      )}
    </div>
  )
}
