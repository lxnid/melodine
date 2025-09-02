import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/playlists",
        destination: "/dashboard/playlists",
        permanent: false,
      },
      {
        source: "/playlists/:id",
        destination: "/dashboard/playlists/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
