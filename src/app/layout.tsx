import type React from "react";
import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"; 
import "./globals.css";
import { AntdLayout } from "./components/basic-layout/basic-layout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Picture Book App",
  description: "A picture book app",
};

export default function RootLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdLayout>{children}</AntdLayout>
      </body>
    </html>
  );
}
