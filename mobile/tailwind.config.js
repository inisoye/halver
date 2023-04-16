// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('./src/theme/colors');

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
      letterSpacing: {
        snug: '-0.1px',
      },
      colors,
    },
  },
  plugins: [],
};
