"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

/**
 * Tipos de tema soportados
 */
export type Theme = "light" | "dark";

/**
 * Store de Zustand para el manejo de tema
 */
interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Hook personalizado para el manejo del tema de la aplicación
 * Persiste el tema seleccionado en localStorage
 */
export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "heralds-theme-storage",
    },
  ),
);

/**
 * Hook que aplica el tema al documentElement
 * Debe usarse en el provider raíz
 */
export const useThemeEffect = () => {
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    // Añadir transición suave
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";

    // Remover ambos temas y aplicar el actual
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Limpiar la transición después de aplicarla
    const timeout = setTimeout(() => {
      root.style.transition = "";
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);
};
