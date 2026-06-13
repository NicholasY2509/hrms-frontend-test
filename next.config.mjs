import bundleAnalyzer from '@next/bundle-analyzer';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@hugeicons/core-free-icons', '@hugeicons/react'],
  }
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(withSerwist(nextConfig));
