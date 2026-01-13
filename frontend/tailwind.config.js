/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        card: "#121212",
        primary: "#D4FF33",
        textMain: "#FFFFFF",
        textMuted: "#A1A1AA"
      }
    },
  },
  plugins: [],
}