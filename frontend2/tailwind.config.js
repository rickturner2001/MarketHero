/** @type {import('tailwindcss').Config} */
module.exports = {
  tailwindcss: {},
  autoprefixer: {},
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["emerald"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui"), require("tailwind-scrollbar")],


}
