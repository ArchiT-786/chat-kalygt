import type { NextConfig } from "next";

const nextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
