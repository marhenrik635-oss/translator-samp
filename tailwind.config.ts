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
        samp: {
          dark: "#0b0f17",
          card: "#121824",
          border: "#1f293d",
          accent: "#22c55e", // GTA green
          cyan: "#00ffff", // SAMP cyan chat
          yellow: "#ffff00", // SAMP yellow
          purple: "#c2a2da", // SAMP /me purple
          blue: "#38bdf8",
          orange: "#fb923c",
          red: "#ef4444"
        }
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;
