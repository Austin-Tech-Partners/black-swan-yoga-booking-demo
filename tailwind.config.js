/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bsy': {
          primary: '#FF4B2B',
          secondary: '#FF416C',
          dark: '#1A1A1A',
          light: '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
} 