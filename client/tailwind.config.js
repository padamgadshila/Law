/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "scroll-vertical": "scroll-vertical 10s linear infinite",
      },
      keyframes: {
        "scroll-vertical": {
          "0%": { transform: "translateY(0)", opacity: "100" },
          "50%": { transform: "translateY(-100%)", opacity: "0" },
          "51%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "100" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".animation-paused": {
          "animation-play-state": "paused",
        },
        ".animation-running": {
          "animation-play-state": "running",
        },
      });
    },
  ],
};
