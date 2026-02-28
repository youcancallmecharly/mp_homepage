/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  async rewrites() {
    return [
      // Lightning Address: pinky@<domain>
      // Wallets rufen /.well-known/lnurlp/pinky auf → API-Route
      {
        source: "/.well-known/lnurlp/pinky",
        destination: "/api/lnurlp/pinky",
      },
    ];
  },
};

export default nextConfig;


