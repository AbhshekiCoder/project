/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}', // if you're using the App Router
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        poppins: ['var(--font-poppins)'],
        outfit: ['var(--font-outfit)'],
        rubik: ['var(--font-rubik)'],
      },
    },
  },
  plugins: [],
}
