const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
]

export function extractYouTubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}

export async function fetchYouTubeMetadata(
  url: string
): Promise<{ title: string; thumbnail_url: string } | null> {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const response = await fetch(oEmbedUrl)
    if (!response.ok) return null
    const data = await response.json() as { title?: string; thumbnail_url?: string }
    if (!data.title || !data.thumbnail_url) return null
    return { title: data.title, thumbnail_url: data.thumbnail_url }
  } catch {
    return null
  }
}
