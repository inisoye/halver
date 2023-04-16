/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        naira: ['Halver-Naira'],
        'sans-medium': ['Halver-Medium'],
        'sans-bold': ['Halver-Semibold'],
      },
    },
  },
  plugins: [],
};
