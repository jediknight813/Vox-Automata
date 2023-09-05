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
      colors: {
        'website-background': 'rgb(17 24 39)',
        'website-primary': 'rgb(31 41 55)',
        'website-secondary': 'rgb(55 65 81)',
        'website-accent': 'rgb(91 33 182)'
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

