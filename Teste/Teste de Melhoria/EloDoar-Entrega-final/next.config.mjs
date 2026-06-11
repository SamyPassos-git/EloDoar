/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Allow accessing dev resources from different local hostnames (e.g. 127.0.0.1)
  // Useful when visiting the app via 127.0.0.1 instead of localhost.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
