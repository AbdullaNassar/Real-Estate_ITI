import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        testcolor: "#ff00ff",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
};
