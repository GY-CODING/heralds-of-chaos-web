/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FAF8F5",
          100: "#F5F1EB",
          200: "#F0E6D2",
          300: "#E4D4B4",
          400: "#D4BD8D",
          500: "#C8AA6E",
          600: "#B59657",
          700: "#9D7F44",
          800: "#785A28",
          900: "#5A421E",
        },
        background: "var(--background)",
        "background-alt": "var(--background-alt)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
      },
      fontSize: {
        "display-lg": [
          "4.5rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-md": [
          "3.5rem",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-sm": [
          "2.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "heading-xl": [
          "2rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-lg": [
          "1.5rem",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-md": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "gold-sm": "0 2px 8px rgba(200, 170, 110, 0.12)",
        "gold-md": "0 4px 12px rgba(200, 170, 110, 0.18)",
        "gold-lg": "0 8px 20px rgba(200, 170, 110, 0.25)",
        "gold-xl": "0 12px 28px rgba(200, 170, 110, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        shimmer: "shimmer 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { textShadow: "0 0 10px rgba(200, 170, 110, 0.3)" },
          "50%": { textShadow: "0 0 20px rgba(200, 170, 110, 0.5)" },
        },
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #785A28 0%, #C8AA6E 50%, #F0E6D2 100%)",
        "gold-gradient-hover":
          "linear-gradient(135deg, #5A421E 0%, #B59657 50%, #E4D4B4 100%)",
      },
    },
  },
  plugins: [],
};
