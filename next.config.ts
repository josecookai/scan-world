import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.youtube.com" },
      { hostname: "i.ytimg.com" },
      { hostname: "*.tiktokcdn.com" },
      { hostname: "p16-sign.tiktokcdn-us.com" },
      { hostname: "p19-sign.tiktokcdn-us.com" },
      { hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
