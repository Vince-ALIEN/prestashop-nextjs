import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextps.panel-ufo.fr",
        port: "",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
