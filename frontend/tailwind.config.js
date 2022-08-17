module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#e26394",
          "secondary": "#76e8f7",
          "accent": "#ed44a6",
          "neutral": "#16191D",
          "base-100": "#2F354C",
          "info": "#95AAE4",
          "success": "#12735F",
          "warning": "#F3DA58",
          "error": "#EB333F",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
