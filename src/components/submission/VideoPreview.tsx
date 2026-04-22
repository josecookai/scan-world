interface VideoPreviewProps {
  platform: "youtube" | "tiktok"
  title: string | null
  thumbnail_url: string | null
  video_id: string
}

export default function VideoPreview({ platform, title, thumbnail_url, video_id }: VideoPreviewProps) {
  const resolvedThumbnail =
    thumbnail_url ??
    (platform === "youtube"
      ? `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`
      : null)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden flex gap-4 p-4 items-start">
      {resolvedThumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedThumbnail}
          alt={title ?? "Video thumbnail"}
          className="w-32 h-20 object-cover rounded-lg flex-shrink-0 bg-zinc-800"
        />
      ) : (
        <div className="w-32 h-20 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{platform === "youtube" ? "▶️" : "🎵"}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
            {platform === "youtube" ? "▶️ YouTube" : "🎵 TikTok"}
          </span>
        </div>
        {title ? (
          <p className="text-sm text-white font-medium line-clamp-2">{title}</p>
        ) : (
          <p className="text-sm text-zinc-500 italic">Title not available</p>
        )}
      </div>
    </div>
  )
}
