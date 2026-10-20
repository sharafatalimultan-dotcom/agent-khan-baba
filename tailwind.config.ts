import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#07864b", dark: "#056638", soft: "#e1f7eb" },
        panel: { DEFAULT: "#e9f4f0", border: "#cce4d8" },
        ink: { DEFAULT: "#0f172a", soft: "#475569" },
      },
      boxShadow: { card: "0 4px 18px rgba(15, 23, 42, 0.08)" },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
