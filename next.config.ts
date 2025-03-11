import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from 'next';
import { redirects } from "./redirects";
const withNextIntl = createNextIntlPlugin();


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.imtyaaz.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      // Set fallback for async_hooks only on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
      };
    }
    return config;
  },


  async redirects() {
    return redirects();
  },
  async rewrites() {
    return [
      {
        source: "/api/upload",
        destination: "https://api.imtyaaz.com/safety-point-academy/api/v1/upload",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
