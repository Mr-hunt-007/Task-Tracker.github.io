/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  distDir: 'out',   // Output folder for static files

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  basePath: "/Task-Tracker.github.io",      // 👈 Set your repo name here
  assetPrefix: "/Task-Tracker.github.io",   // 👈 For resolving static assets
};

export default nextConfig;
