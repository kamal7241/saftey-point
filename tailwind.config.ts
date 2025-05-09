import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // black: "#1F1F1F",
        primary: "#AA2D41",
        primaryLight: "#B34254",
        dark: "#4B4B4B",
        gray: {
          100: "#FAFAFA",
          101: "#A5A7AA",
          200: "#CED0D3",
          201: "#EEEEEE",
          300: "#8E8E8E",
          301: "#888891",
          400: "#F2F4F7",
          500: "#F1F1F1",
          600: "#4A4F55",
          800: "#484B50",
          900: "#787C84",
          901: "#6E7277",
        },
        light: {
          100: "#F5F5F5",
          200: "#CACACA",
          300: "#E1E1E1",
          400: "#5C6166",
        },
        black: {
          100: "#3D4245",
          200: "#000",
          300: "#000",
          400: "#1F1F1F",
        },
        green: {
          100: "#C0E5D1",
          101: "#E5F5EC",
          200: "#F4FCF7",
          400: "#0C9D61",
        },
        blue: {
          400: "#3A70E2",
        },
        red: {
          300: "#FFCCD2",
          400: "#EC2D30",
          700: "#EC2D30",
        },
        warning: {
          300: "#FFEAB3",
          700: "#FE9B0E",
        },
        success: {
          300: "#C0E5D1",
          700: "#0C9D61",
        },
        brand: {
          300: "#E6C0C6",
          700: "#AA2D41",
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
        custom3: "0px -4px 4px rgba(0, 0, 0, 0.05)",
        custom2: "0 0 0 20px #E5F5EC",
      },
    },
  },
  safelist: [
    'text-blue-400',
    'text-gray-900',
    'bg-brand-300',
    'text-brand-700',
    'bg-success-300',
    'text-success-700',
    'bg-warning-300',
    'text-warning-700',
    'bg-red-300',
    'text-red-700',
    'after:bg-primary'
  ],
  plugins: [],
} satisfies Config;
