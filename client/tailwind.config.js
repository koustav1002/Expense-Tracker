/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: "var(--theme)",
        black: "var(--black)",
        white: "var(--white)",
        "shadow-color": "var(--shadow-color)",
        "dark-mode": "var(--dark-mode)",
      },
    },
  },
  plugins: [],
};
