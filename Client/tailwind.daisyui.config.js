import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {}, // your customizations
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
};
