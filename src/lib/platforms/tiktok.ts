const TIKTOK_PATTERNS = [
  /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
  /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
]

export function extractTikTokVideoId(url: string): string | null {
  for (const pattern of TIKTOK_PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function isTikTokUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.hostname === "tiktok.com" ||
      parsed.hostname === "www.tiktok.com" ||
      parsed.hostname === "vm.tiktok.com"
    )
  } catch {
    return false
  }
}

export async function fetchTikTokMetadata(
  url: string
): Promise<{ title: string; thumbnail_url: string } | null> {
  try {
    const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    const response = await fetch(oEmbedUrl)
    if (!response.ok) return null
    const data = await response.json() as { title?: string; thumbnail_url?: string }
    if (!data.title || !data.thumbnail_url) return null
    return { title: data.title, thumbnail_url: data.thumbnail_url }
  } catch {
    return null
  }
}
