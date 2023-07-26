/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        login_background_color:"#0c0c0c"
      },
      fontFamily:{
        movieMatch:["Satisfy","cursive"],
      }
    },
  },
  plugins: [],
}