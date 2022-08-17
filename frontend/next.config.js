/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  nx: {
    svgr: false,
  },
  // fix for running the docker container
  output: 'standalone',
  experimental: {
    outputStandalone: true,
  }
}

module.exports = nextConfig