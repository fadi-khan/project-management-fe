import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/signup']

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookie = request.cookies.get('access_token')?.value


  console.log('cookie', cookie)
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!cookie && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (cookie) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          cookie: `access_token=${cookie}`,
        },
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Not authenticated')
      const user = await res.json()

      if (user && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      return NextResponse.next()
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}
