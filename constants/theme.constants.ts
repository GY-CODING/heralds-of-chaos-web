/**
 * Constantes de tema para la aplicación Heralds of Chaos
 * Inspirado en League of Legends Universe design system
 */

export const THEME_COLORS = {
  GOLD: {
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
  BACKGROUND: {
    LIGHT: "#F9F6F2",
    LIGHT_ALT: "#EEEAE3",
    DARK: "#010A13",
    DARK_ALT: "#0A1428",
  },
  SURFACE: {
    LIGHT: "#FFFFFF",
    LIGHT_ELEVATED: "rgba(255, 255, 255, 0.8)",
    LIGHT_HOVER: "rgba(200, 170, 110, 0.04)",
    DARK: "#0F1923",
    DARK_ELEVATED: "rgba(15, 25, 35, 0.9)",
    DARK_HOVER: "rgba(200, 170, 110, 0.06)",
  },
  BORDER: {
    LIGHT: "rgba(120, 90, 40, 0.06)",
    LIGHT_STRONG: "rgba(120, 90, 40, 0.12)",
    DARK: "rgba(200, 170, 110, 0.08)",
    DARK_STRONG: "rgba(200, 170, 110, 0.15)",
  },
  TEXT: {
    LIGHT_PRIMARY: "#1A1A1A",
    LIGHT_SECONDARY: "#5A5A5A",
    LIGHT_TERTIARY: "#8A8A8A",
    DARK_PRIMARY: "#F0E6D2",
    DARK_SECONDARY: "#A09B8C",
    DARK_TERTIARY: "#6A6A6A",
  },
  SHADOW: {
    LIGHT: {
      SM: "0 1px 2px rgba(0, 0, 0, 0.02)",
      MD: "0 4px 8px rgba(0, 0, 0, 0.04)",
      LG: "0 8px 16px rgba(0, 0, 0, 0.06)",
      XL: "0 12px 24px rgba(0, 0, 0, 0.08)",
      GOLD: "0 4px 12px rgba(200, 170, 110, 0.15)",
    },
    DARK: {
      SM: "0 1px 2px rgba(0, 0, 0, 0.4)",
      MD: "0 4px 8px rgba(0, 0, 0, 0.5)",
      LG: "0 8px 16px rgba(0, 0, 0, 0.6)",
      XL: "0 12px 24px rgba(0, 0, 0, 0.7)",
      GOLD: "0 4px 12px rgba(200, 170, 110, 0.25)",
    },
  },
} as const;

export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
    EASE_OUT: "cubic-bezier(0, 0, 0.2, 1)",
    EASE_IN: "cubic-bezier(0.4, 0, 1, 1)",
    SPRING: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const SPACING = {
  SECTION: {
    VERTICAL: {
      SM: "4rem",
      MD: "6rem",
      LG: "8rem",
      XL: "10rem",
    },
    HORIZONTAL: {
      SM: "1rem",
      MD: "1.5rem",
      LG: "2rem",
      XL: "3rem",
    },
  },
  CONTAINER: {
    MAX_WIDTH: "1400px",
    PADDING: {
      SM: "1rem",
      MD: "1.5rem",
      LG: "2rem",
    },
  },
} as const;
