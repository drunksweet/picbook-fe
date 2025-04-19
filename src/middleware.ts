import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 不需要鉴权的路由列表
const publicRoutes = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是公开路由
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // 如果是公开路由，直接放行
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 从cookie或localStorage中获取token
  // 注意：中间件只能访问cookie，不能访问localStorage
  const token = request.cookies.get("authToken")?.value

  // 如果没有token，重定向到登录页面
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    // 可以添加一个redirect_to参数，以便登录后重定向回原页面
    loginUrl.searchParams.set("redirect_to", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 如果有token，继续访问请求的页面
  return NextResponse.next()
}

// 配置中间件应用的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api路由（可以根据需要调整）
     * - _next（Next.js内部路由）
     * - 静态文件（images, files等）
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
