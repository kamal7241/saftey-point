import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#1F1F1F",
        primary: "#AA2D41",
        primaryLight: "#B34254",
        dark: "#4B4B4B",
        gray: {
          100: "#FAFAFA",
          101: "#A5A7AA",
          200: "#CED0D3",
          201: "#EEEEEE",
          300: "#8E8E8E",
          400: "#F2F4F7",
          500: "#F1F1F1",
          600: "#4A4F55",
          700: "#4B4B4B",
          800: "#484B50",
          900: "#787C84",
        },
        light: {
          100: "#F5F5F5",
          200: "#CACACA",
          300: "#E1E1E1",
        },
        green: {
          100: "#C0E5D1",
          200: "#F4FCF7",
          400: "#0C9D61",
        },
        blue: {
          400: "#3A70E2",
        },
        red: {
          400: "#EC2D30",
        },
      },
      maxWidth: {
        "6xl": "1140px",
      },
      spacing: {
        20: "70px",
      },
      borderRadius: {
        "4xl": "45px",
      },
      fontFamily: {
        Jost: ["Jost", "sans-serif"],
        Cairo: ["Cairo", "sans-serif"],
      },
      boxShadow: {
        custom: "0px 4px 4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  safelist: [
    'text-blue-400',
    'text-gray-900',
  ],
  plugins: [],
} satisfies Config;
