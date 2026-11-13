export default {
  darkMode: "class",
  content: ["./src/client/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3F51B5",
          hover: "#303F9F",
          soft: "#E8EAF6",
          dark: "#7986CB",
        },
        secondary: {
          DEFAULT: "#FF4081",
          hover: "#F50057",
          soft: "#FCE4EC",
          dark: "#FF80AB",
        },
        // keep accent alias for existing components
        accent: {
          DEFAULT: "#3F51B5",
          hover: "#303F9F",
          soft: "#E8EAF6",
          dark: "#7986CB",
        },
        status: {
          danger: "#D32F2F",
          warning: "#F57C00",
          success: "#388E3C",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "28px",
        full: "9999px",
      },
      boxShadow: {
        "elev-1": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "elev-2": "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
        "elev-3": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        "elev-4": "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      },
    },
  },
  plugins: [],
};
