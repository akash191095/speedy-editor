import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0px 0px 105px 45px rgba(148,85,211,0.9);",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
