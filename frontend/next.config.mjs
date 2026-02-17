/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: [
    // tiptap
    "@tiptap/pm",
    "@tiptap/core",
    "@tiptap/react",
    "@tiptap/starter-kit",
    "@tiptap/extension-bold",
    "@tiptap/extension-bubble-menu",
    "@tiptap/extension-bullet-list",
    "@tiptap/extension-code",
    "@tiptap/extension-code-block-lowlight",
    "@tiptap/extension-color",
    "@tiptap/extension-document",
    "@tiptap/extension-history",
    "@tiptap/extension-italic",
    "@tiptap/extension-link",
    "@tiptap/extension-list-item",
    "@tiptap/extension-paragraph",
    "@tiptap/extension-placeholder",
    "@tiptap/extension-strike",
    "@tiptap/extension-text",
    "@tiptap/extension-underline",
    // date / ui packages with many small ESM files
    "date-fns",
    "lucide-react",
    "@heroicons/react",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-icons",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-slot",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toast",
    "@radix-ui/react-tooltip",
    "recharts",
  ],
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
