/** @type {import('next').NextConfig} */
const isNsiteExport = process.env.NSITE_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.moneypenny.li" }],
        destination: "https://moneypenny.li/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.moneypenny.li" }],
        destination: "https://moneypenny.li/:path*",
        permanent: true,
      },
    ];
  },
  ...(isNsiteExport
    ? {
        output: "export",
        trailingSlash: true,
      }
    : {}),
  images: {
    unoptimized: isNsiteExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  ...(!isNsiteExport
    ? {
        async rewrites() {
          return [
            // Lightning Address: pinky@<domain>
            // Wallets call /.well-known/lnurlp/pinky -> API route
            {
              source: "/.well-known/lnurlp/pinky",
              destination: "/api/lnurlp/pinky",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;


