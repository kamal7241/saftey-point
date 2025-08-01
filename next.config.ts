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
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4444",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "4444",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "safetypointacademy.com",
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
        destination: `${process.env.NEXT_PUBLIC_API_URL}/safety-point-academy/api/v1/upload`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
