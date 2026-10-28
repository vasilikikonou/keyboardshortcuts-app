/** @type {import('next').NextConfig} */
const basePath =
  process.env.GITHUB_PAGES === 'true' ? '/keyboardshortcuts-app' : '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;