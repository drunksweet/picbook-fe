import type React from "react"
import { AntdLayout } from "@/components/basic-layout/basic-layout"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AntdLayout>{children}</AntdLayout>
}

