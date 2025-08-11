import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Danh sách các route cần xác thực
const protectedRoutes = ['/dashboard']

// Danh sách các route dành cho guest (đã logout)
const guestOnlyRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Lấy token từ cookie
  const token = request.cookies.get('auth_token')?.value

  // Kiểm tra route được bảo vệ
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Kiểm tra route chỉ dành cho guest
  const isGuestOnlyRoute = guestOnlyRoutes.some(route => 
    pathname === route
  )

  // Nếu truy cập route được bảo vệ mà không có token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Nếu đã đăng nhập mà truy cập trang login/register
  if (isGuestOnlyRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
