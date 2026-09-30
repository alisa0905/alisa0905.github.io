import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets you open the dev preview from your phone on the same Wi-Fi.
  allowedDevOrigins: ["10.171.8.112", "*.local"],
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
