import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#070A12",
        ash: "#0A0E19",
        panel: "#0D1220",
        "panel-2": "#141B2E",
        line: "rgba(148, 163, 199, 0.10)",
        "line-strong": "rgba(148, 163, 199, 0.22)",
        bone: "#F2F4F8",
        dim: "#93A0B8",
        faint: "#5C6780",
        accent: "#3B82F6",
        "accent-soft": "#60A5FA",
        neon: "#22D3EE",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        grotesk: ["\"Space Grotesk Variable\"", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        jakarta: ["\"Plus Jakarta Sans Variable\"", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        hand: ["\"Caveat Variable\"", "cursive"],
      },
      backgroundImage: {
        "glow-accent": "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.14), transparent 65%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,0.4), 0 0 24px rgba(59,130,246,0.25)",
        "glow-sm": "0 0 0 1px rgba(59,130,246,0.3), 0 0 12px rgba(59,130,246,0.18)",
      },
      animation: {
        "float-slow": "float 9s ease-in-out infinite",
        marquee: "marquee 46s linear infinite",
        "marquee-reverse": "marquee-reverse 60s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
