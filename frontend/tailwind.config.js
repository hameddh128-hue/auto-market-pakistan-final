/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14211B",
        brand: {
          DEFAULT: "#0E7C53",
          dark: "#0A5E3F",
          light: "#E4F3EC",
        },
        sand: "#F6F3EC",
        amber: {
          DEFAULT: "#E8A33D",
          dark: "#C9821F",
        },
        slate: {
          muted: "#5C6B63",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "lane-dash": "repeating-linear-gradient(90deg, #E8A33D 0px, #E8A33D 24px, transparent 24px, transparent 48px)",
      },
    },
  },
  plugins: [],
};
