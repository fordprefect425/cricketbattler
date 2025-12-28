/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          green: '#2E7D32',
          pitch: '#E4D5B7',
          sky: '#1A237E',
          accent: '#FFD600',
        }
      }
    },
  },
  plugins: [],
}
