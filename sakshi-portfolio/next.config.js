/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: [".jsx", ".js", ".json"],
    },
  },
};

module.exports = nextConfig;