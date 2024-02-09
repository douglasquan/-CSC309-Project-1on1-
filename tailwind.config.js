/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*/.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'green-low': 'rgb(204, 255, 204)',
        'green-medium': 'rgb(102, 255, 102)',
        'green-high': 'rgb(0, 153, 51)',
        'grey-blue' : 'rgb(116,139,151)' ,
      },
    },
  },
  plugins: [],
}