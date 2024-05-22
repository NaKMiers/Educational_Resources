import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Require Auth
const requireAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Auth -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

// Require UnAuth
const requireUnauth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require UnAuth -')

  // check auth
  if (token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Require Admin
const requireAdmin = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Admin -')

  // check auth
  if (!['admin', 'editor'].includes(token?.role as string)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Required Joined
const requiredJoined = async (req: NextRequest, token: JWT | null) => {
  console.log('- Required Joined -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const courses: string[] = (token.courses as any).map((course: any) => course.course)
  const courseId: string = req.nextUrl.pathname.split('/learning/')[1].split('/')[0]

  // current user hasn't joined the course
  if (!courses.includes(courseId) && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Middleware
export default async function middleware(req: NextRequest) {
  console.log('- Middleware -')

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // require admin
  if (
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/api/admin')
    // || req.nextUrl.pathname.startsWith('/email')
  ) {
    return requireAdmin(req, token)
  }
  // require auth
  else if (
    req.nextUrl.pathname.startsWith('/user') ||
    req.nextUrl.pathname.startsWith('/setting') ||
    req.nextUrl.pathname.startsWith('/checkout')
  ) {
    return requireAuth(req, token)
  }
  // require unauth
  else if (req.nextUrl.pathname.startsWith('/auth')) {
    return requireUnauth(req, token)
  }
  // require joined
  else if (req.nextUrl.pathname.startsWith('/learning')) {
    return requiredJoined(req, token)
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/setting/:path*',
    '/auth/:path*',
    '/learning/:path*',
    '/checkout/:path*',
    // '/email/:path*',
  ],
}
