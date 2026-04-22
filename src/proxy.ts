import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const PROTECTED_ROUTES = ["/submit", "/profile", "/points"]
const ADMIN_ROUTES = ["/admin"]

function isProtected(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
}

function isAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run on protected or admin routes
  if (!isProtected(pathname) && !isAdmin(pathname)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Validate the session — getUser() is safer than getSession() in middleware
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin route check
  if (isAdmin(pathname)) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/submit/:path*",
    "/profile/:path*",
    "/points/:path*",
    "/admin/:path*",
    "/admin",
  ],
}
