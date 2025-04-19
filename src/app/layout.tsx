import type React from "react"
import type { Metadata } from "next"
  import ClientLayout from "./CilentLayout"

export const metadata: Metadata = {
  title: "Picture Book App",
  description: "A picture book app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
