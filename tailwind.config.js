/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sewa-blue': '#3158f6',
        'sewa-dark': '#1E2336',
      }
    },
  },
  plugins: [],
}
