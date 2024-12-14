import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from 'next';
const withNextIntl = createNextIntlPlugin();


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com", // Allow images from this domain
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
};

export default withNextIntl(nextConfig);
