module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}, // your customizations
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false, // ⛔ disables all built-in themes
  },
};
