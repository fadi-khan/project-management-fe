import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/signup']

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl

  // const token = request.cookies.get('access_token')?.value

  // const isPublicRoute = PUBLIC_ROUTES.some(
  //   (route) => pathname === route || pathname.startsWith(`${route}/`),
  // )

  // if (!token && !isPublicRoute) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // if (token && isPublicRoute) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  // return NextResponse.next()
}
