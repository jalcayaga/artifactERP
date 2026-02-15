import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)",
          text: "var(--color-text)",
        },
        'deep-blue': {
          DEFAULT: '#0f172a', // Slate 900 base
          dark: '#020617',    // Slate 950
          light: '#1e293b',   // Slate 800
        },
        'dark-surface': '#1e293b', // Unified with Card Blue
        'card-blue': '#1e293b',    // Slate 800
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
});

export default config;
