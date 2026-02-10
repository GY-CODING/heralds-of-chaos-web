/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLanguage } from "./use-language";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";
import deTranslations from "@/locales/de.json";

type Translations = typeof enTranslations;

const translations: Record<string, Translations> = {
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
};

/**
 * Hook para obtener las traducciones según el idioma actual
 * @returns Objeto con todas las traducciones del idioma seleccionado
 */
export function useTranslations(): Translations {
  const { language } = useLanguage();
  return translations[language] || translations.en;
}

/**
 * Función helper para obtener una traducción anidada usando dot notation
 * Ejemplo: t('pages.characters.title')
 */
export function useT() {
  const t = useTranslations();

  return (key: string): string => {
    const keys = key.split(".");
    let value: any = t;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return typeof value === "string" ? value : key;
  };
}
