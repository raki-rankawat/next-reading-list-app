import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every cover in the list is an Open Library cover, stored as a full URL on
    // the book. next/image needs the host allow-listed to serve it.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/b/id/**",
      },
    ],
  },
};

export default nextConfig;
