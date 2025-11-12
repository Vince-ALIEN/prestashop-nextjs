/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permet tous les domaines HTTPS
        port: '',
        pathname: '/api/images/**',
      },
    ],
    // ✅ Permettre les query strings dans les URLs d'images
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
};

export default nextConfig;