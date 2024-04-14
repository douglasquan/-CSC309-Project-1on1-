/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        pastelPurple: '#faf4ff',
        pastelGreenBlue: '#a7d2cb',
        pastelPink: '#fec5bb',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      'pastel',
    ],
  },
}