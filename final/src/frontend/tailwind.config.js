/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fbc40e",
        "primary-dark": "#ce9b0d",
        "primary-light": "#f9e310",
        "primary-black": "#1a232e",
        "primary-white": "#c7c7c7",
        secondary: "#343f71",
        "secondary-dark": "#202844",
        "secondary-light": "#354c70",
        light: "#e0d8e4",
        "light-dark": "#aaa5ad",
        white: "#ffffff",
        pome: "#f34c19",
        "pome-dark": "#af3d15",
        "pome-light": "#ef7c1d",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms"),
  ],
};
