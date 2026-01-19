/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4FF33', // Neon Lime
        dark: '#0A0A0A',    // Deep Background
        card: '#121212',    // Card Background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure Inter is used
      }
    },
  },
  plugins: [],
}