import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#141413",
        secondary: "#828179",
        accent: "#C7FB76",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#EF4444",
        info: "#3B82F6",
        background: "#FAFAF8",
        surface: "#FFFFFF",
        muted: "#C4C3BB",
        "muted-foreground": "#A3A299",
        border: "#E6E4DD",
        input: "#F0EFEA",
        foreground: "#141413",
        "popover-foreground": "#141413",
        "card-foreground": "#141413",
        "accent-foreground": "#141413",
        "destructive-foreground": "#FFFFFF",
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #C7FB76 0%, #34D399 100%)',
        'background-gradient': 'linear-gradient(180deg, #FAFAF8 0%, #F0EFEA 100%)',
        'dark-gradient': 'linear-gradient(135deg, #141413 0%, #1E1E1C 100%)',
      },
      boxShadow: {
        'hover': '0 8px 30px rgba(0,0,0,0.12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scale': 'scale 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;