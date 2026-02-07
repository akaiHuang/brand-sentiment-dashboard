/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 環境變數
  env: {
    OLLAMA_API_KEY: process.env.OLLAMA_API_KEY,
    NEXT_PUBLIC_CRAWLER_API: process.env.NEXT_PUBLIC_CRAWLER_API || 'http://localhost:3002',
  },
}

module.exports = nextConfig
