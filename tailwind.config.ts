import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: "#3D5229",
          dark: "#24331A",
          light: "#536F39",
        },
        gold: {
          DEFAULT: "#C9922B",
          dark: "#A6741E",
          light: "#E0AA42",
        },
        sand: {
          DEFAULT: "#F2E8D5",
          dark: "#E3D4B8",
          light: "#FAF5EC",
        },
        dark: "#2B2B2B",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
