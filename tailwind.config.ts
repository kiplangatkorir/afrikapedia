import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "kente-gold": "#F5A623",
        "kente-red": "#C0392B",
        "kente-green": "#1E6B3A",
        "kente-black": "#0D0D0D",
        sand: "#F2EBD9",
        clay: "#B5651D",
        ink: "#1A0A00",
        muted: "#8B7355",
        "accent-teal": "#0E7C6B",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
        serif: ["Noto Serif", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
