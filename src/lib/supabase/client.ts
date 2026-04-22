import { createBrowserClient } from "@supabase/ssr"

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // During SSR / build, we can't access env vars that are only in browser.
  // Return a lazy-initialized client so the error only happens at runtime.
  if (typeof window === "undefined") {
    // Return a proxy that defers creation until first property access
    return new Proxy(
      {} as ReturnType<typeof createBrowserClient>,
      {
        get(_target, prop) {
          if (!browserClient) {
            browserClient = createBrowserClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
          }
          return (browserClient as any)[prop]
        },
      }
    )
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}
