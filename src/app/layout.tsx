import type React from "react";
import type { Metadata } from "next";
import { ConfigProvider, App as AntApp } from "antd";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.sass";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Picture Book App",
  description: "A picture book app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
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
      </body>
    </html>
  );
}
