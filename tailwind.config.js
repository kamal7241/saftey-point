/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        black: "#1F1F1F",
        primary: "#AA2D41",
        primaryLight: "#B34254",
        dark: "#4B4B4B",
        gray: {
          100: "#FAFAFA",
          200: "#CED0D3",
          300: "#8E8E8E",
          400: "#F2F4F7",
          500: "#F1F1F1",
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
  plugins: [],
};
