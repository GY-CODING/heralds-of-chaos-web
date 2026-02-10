"use client";

import type { Language } from "@/types/common.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Store de Zustand para el manejo de idioma
 */
interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

/**
 * Hook personalizado para el manejo del idioma de la aplicación
 * Persiste el idioma seleccionado en localStorage
 */
export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({
          language: state.language === "en" ? "es" : "en",
        })),
    }),
    {
      name: "heralds-language-storage",
    },
  ),
);

/**
 * Helper para obtener el texto en el idioma actual
 * Maneja casos de undefined/null de forma segura
 */
export function useTranslate() {
  const language = useLanguage((state) => state.language);

  return function <T extends { es: string; en: string; de?: string }>(
    text: T | undefined | null,
  ): string {
    if (!text) {
      return "";
    }
    return text[language] || text.en || "";
  };
}
