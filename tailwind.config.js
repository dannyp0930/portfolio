/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "kbo": [ "KBO Dia Gothic", "serif", "sans-serif" ]
      },
      colors: {
        "theme": "#ffdab9",
        "theme-sub": "#522a28",
        "bg": "#ffdab9",
      },
      height: {
        "header": "6.25rem",
        "footer": "12.5rem"
      }
    }
  },
  plugins: [],
}

