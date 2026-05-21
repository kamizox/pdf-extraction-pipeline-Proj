/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        flood: {
          bg: '#f0fdf4',
          card: '#dcfce7',
          primary: '#16a34a',
          dark: '#15803d',
          text: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
