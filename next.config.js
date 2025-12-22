/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per immagini esterne (Unsplash, Pexels, ecc.)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  // Ottimizzazioni per AWS Amplify
  output: 'standalone',
}

module.exports = nextConfig
