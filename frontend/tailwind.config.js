/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sedgwick-ave-display': ['Sedgwick Ave Display', 'cursive'],
        'Comfortaa': ['Comfortaa', 'cursive'],
      },
    },
  },
  plugins: [require("daisyui"), require('tailwind-scrollbar')({ nocompatible: true })],
  daisyui: {
    themes: ['dark'],
    base: false,
    utils: true,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },
}

