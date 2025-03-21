
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
        accent: "#3B82F6",  
        success: "#3B82F6",  
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        background: "#FAFAF8",
        surface: "#FFFFFF",
        muted: "#C4C3BB",
        "muted-foreground": "#4B5563",
        border: "#E6E4DD",
        input: "#F0EFEA",
        foreground: "#141413",
        "popover-foreground": "#141413",
        "card-foreground": "#141413",
        "accent-foreground": "#FFFFFF",
        "destructive-foreground": "#FFFFFF",
        // New blue shades
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        'background-gradient': 'linear-gradient(180deg, #FAFAF8 0%, #F0EFEA 100%)',
        'dark-gradient': 'linear-gradient(135deg, #141413 0%, #1E1E1C 100%)',
        'blue-gradient': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      },
      boxShadow: {
        'hover': '0 8px 30px rgba(0,0,0,0.12)',
        'card': '0 4px 16px rgba(0,0,0,0.08)',
        'button': '0 4px 12px rgba(37, 99, 235, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scale': 'scale 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
