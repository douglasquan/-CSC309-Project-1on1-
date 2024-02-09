/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "green-low": "rgb(204, 255, 204)",
        "green-medium": "rgb(102, 255, 102)",
        "green-high": "rgb(0, 153, 51)",
        "custom-light-gray": "#f7fafc",
        "custom-text-color": "#333333",
        "custom-cyan": "#92C7CF",
      },

      fontFamily: {
        custom: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },

      fontSize: {
        "custom-standard": "16px",
      },

      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to bottom, #92C7CF 0%, #FFFFFF 100%)",
      },
    },
  },
  plugins: [],
};
