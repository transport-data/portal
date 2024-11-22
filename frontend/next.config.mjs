/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    unoptimized: true,
    loader: "custom",
    loaderFile: "./image-loader.js",
    domains: [
      "portal.transport-data.org",
      "ckan.tdc.dev.datopian.com",
      "ckan.tdc.prod.datopian.com",
    ],
  },
  reactStrictMode: true,
  output: "standalone",
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/:all*(css|js|gif|svg|jpg|jpeg|png|woff|woff2)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
    ];
  },
};

export default config;
