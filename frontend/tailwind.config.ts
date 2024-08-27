import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "8px",
      screens: {
        "2xl": "1280px",
        "xl" : "1140px",
        "lg" : "1024px",
        "md" : "768px",
        "sm" : "640px"
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors:{
        "tdc-primary" : "#006064",
        "gray-900" : "#111928",
        "gray-500" : "#6B7280",
        "gray-400" : "#9CA3AF"
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;

export default config;
