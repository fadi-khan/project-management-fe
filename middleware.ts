import { httpService } from '@/lib/services/HttpService'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/signup']

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }



  try {
    const res = await httpService.get("auth/profile")

    if (!res) throw new Error('Invalid token')

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
