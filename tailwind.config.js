/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        foreground: 'var(--foreground-color)',
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        fontFamily: {
          cairo: ['Cairo', 'sans-serif'],
        },

      }

    },
  },
  plugins: [],
}
