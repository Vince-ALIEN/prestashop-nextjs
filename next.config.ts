/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextps.panel-ufo.fr',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: false, // Garde cette option si tu veux optimiser les images
  },
};

module.exports = nextConfig;
