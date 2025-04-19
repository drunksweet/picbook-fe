"use client"

import type React from "react"
import { ConfigProvider, App as AntApp } from "antd"
import { Geist, Geist_Mono } from "next/font/google"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { setCookie, getCookie } from "src/utils/cookies"
import "./globals.sass"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// 不需要鉴权的路由列表
const publicRoutes = ["/login", "/register"]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // 客户端鉴权逻辑
  useEffect(() => {
    // 检查当前路径是否是公开路由
    const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route))

    // 如果不是公开路由，检查是否有token
    if (!isPublicRoute) {
      const token = localStorage.getItem("authToken")

      // 如果localStorage中有token，确保cookie中也有
      if (token) {
        const cookieToken = getCookie("authToken")
        if (!cookieToken) {
          setCookie("authToken", token, 30) // 设置7天过期
        }
      } else {
        // 如果没有token，重定向到登录页面
        router.push(`/login?redirect_to=${encodeURIComponent(pathname || "/")}`)
      }
    }
  }, [pathname, router])

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#F59A23",
            colorLink: "#F59A23",
          },
        }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </div>
  )
}
