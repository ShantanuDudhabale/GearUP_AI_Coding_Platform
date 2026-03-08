import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#564fdcff",
        secondary: "#FFB703",
        accent: "#00C2FF",
        dark: "#060618",
        "dark-2": "#0d0d2b",
        "dark-3": "#12123a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-fira-code)", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse at top, #1a1060 0%, #060618 60%)",
        "card-gradient": "linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(0,194,255,0.05) 100%)",
        "mic-gradient": "radial-gradient(circle, #6C63FF 0%, #4a41d4 100%)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
