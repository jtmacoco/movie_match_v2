/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors:{
        dark_back:"#0c0c0c",
        dark_border:"#1C1C1C",
        light_border:"#FFFFFF",
        light_back:"#F2F2F7"
      },
      fontFamily:{
        movieMatch:["Satisfy","cursive"],
      }
    },
  },
  plugins: [],
}