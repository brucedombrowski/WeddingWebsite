/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Burgundy
        primary: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7994',
          500: '#de4d71',
          600: '#c9305a',
          700: '#a82448',
          800: '#722034',
          900: '#4a1521',
        },
        // Olive Green
        accent: {
          50: '#f6f7f4',
          100: '#e8ebe3',
          200: '#d3d9c8',
          300: '#b4c0a3',
          400: '#94a67d',
          500: '#768a5e',
          600: '#5c6d49',
          700: '#4a573c',
          800: '#3d4733',
          900: '#2d3526',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
