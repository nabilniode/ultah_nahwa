/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: '#FFFDF9',
          DEFAULT: '#FAF6EE',
          dark: '#F4ECE1',
        },
        blush: {
          light: '#FFF0F0',
          DEFAULT: '#FADADD',
          dark: '#E8A5A5',
          accent: '#D47575',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
