/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/**/*.{js,jsx,ts,tsx,vue,html}",
    "./features/**/*.{js,jsx,ts,tsx,vue,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          background: "#111923",
          dark: "#0D131C",
          header: "#19212C",
          inactive: "#353C46",
          "input-color": "#202A39",
          icon: "#A7B5CA",
          orange: "#FE8600",
          gray: "#949494",
        },
      },
    },
  },
  plugins: [],
};
