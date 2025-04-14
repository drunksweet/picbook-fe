import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: ["./"],
  },

  async rewrites() {
    console.log("rewrites applied"); // 👈 这个要在重启时能看到
    return [
      {
        source: "/api/:path*", // 匹配以 /api 开头的请求
        destination: "http://47.92.102.209:8989/api/:path*", // 代理到目标 URL
      },
    ];
  },
};

export default nextConfig;
