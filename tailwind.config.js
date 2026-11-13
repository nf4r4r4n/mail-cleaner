export default {
  darkMode: "class",
  content: ["./src/client/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#0057FF",
          hover: "#0046CC",
          soft: "#E6EDFF",
          dark: "#4D8BFF",
        },
        status: {
          danger: "#D00000",
          warning: "#B26A00",
          success: "#0A7A3D",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
