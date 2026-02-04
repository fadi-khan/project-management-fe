import { RootState } from '@/lib/store/store'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useSelector } from 'react-redux'

const PUBLIC_ROUTES = ['/login', '/signup']

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl


  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
