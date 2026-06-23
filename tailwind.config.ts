import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.json"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ea",
        ink: "#171512",
        muted: "#6d675d",
        rule: "#d9d0c1",
        evidence: "#1f6f68",
        amber: "#b7791f",
        blue: "#245f8f",
        clay: "#9f4f38"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "ui-serif", "serif"]
      },
      boxShadow: {
        dossier: "0 18px 60px rgba(23, 21, 18, 0.08)"
      }
    }
  },
  plugins: [forms]
};

export default config;
