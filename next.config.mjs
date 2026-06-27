/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/keyboardshortcutsapp',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
