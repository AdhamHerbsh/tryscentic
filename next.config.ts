import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
    domains: [
      "lh3.googleusercontent.com",
      "drive.google.com",
      "png.pngtree.com",
    ],
  },
};

export default nextConfig;
