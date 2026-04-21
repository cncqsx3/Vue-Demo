/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // LAN / private-IP dev: HMR WebSocket sends Origin with the page host (e.g. 10.0.1.163).
  // Without this, Next.js returns 403 on /_next/webpack-hmr and the browser reports WS failed.
  // Patterns use the same segment wildcards as image remotePatterns (see Next.js docs).
  allowedDevOrigins: [
    "127.*.*.*",
    "10.*.*.*",
    "192.168.*.*",
    "172.*.*.*",
    ...(process.env.ALLOWED_DEV_ORIGINS ?? "")
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean),
  ],
}

export default nextConfig
