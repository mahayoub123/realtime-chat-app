/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1220",
          light: "#131B2E",
          lighter: "#1B2438",
        },
        signal: {
          DEFAULT: "#5EEAD4",
          dim: "#2DD4BF",
          soft: "#99F6E4",
        },
        flare: "#F472B6",
        mist: {
          DEFAULT: "#E7ECF3",
          dim: "#8B97AC",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "80%": { transform: "scale(1.8)", opacity: "0" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeInUp: "fadeInUp 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
