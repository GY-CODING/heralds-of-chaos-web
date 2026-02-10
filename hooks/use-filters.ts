/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { MultiLanguageText } from "@/types/common.types";
import type {
  FilterConfig,
  FilterValues,
  SelectFilterConfig,
  UseFiltersResult,
} from "@/types/filter.types";
import { useMemo, useState } from "react";
import { useLanguage } from "./use-language";

/**
 * Normaliza texto removiendo acentos y convirtiendo a minúsculas
 * @param text - Texto a normalizar
 * @returns Texto normalizado sin acentos y en minúsculas
 */
function normalizeText(text: string | null | undefined): string {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Verifica si un texto multiidioma contiene el término de búsqueda en cualquier idioma
 * @param multiLangText - Texto multiidioma
 * @param searchTerm - Término de búsqueda normalizado
 * @returns true si encuentra el término en cualquier idioma
 */
function multiLanguageTextMatches(
  multiLangText: MultiLanguageText | string | null | undefined,
  searchTerm: string,
): boolean {
  if (!multiLangText || !searchTerm) return false;

  if (typeof multiLangText === "string") {
    return normalizeText(multiLangText).includes(normalizeText(searchTerm));
  }

  const normalizedSearch = normalizeText(searchTerm);

  // Buscar en todos los idiomas
  return (
    normalizeText(multiLangText.en).includes(normalizedSearch) ||
    normalizeText(multiLangText.es).includes(normalizedSearch) ||
    normalizeText(multiLangText.de).includes(normalizedSearch)
  );
}

/**
 * Obtiene el valor de una propiedad, soportando notación con punto para propiedades anidadas
 * @param obj - Objeto del cual extraer el valor
 * @param path - Ruta de la propiedad (ej: 'world.name')
 */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

/**
 * Genera opciones dinámicas a partir de los datos
 */
function generateDynamicOptions<T extends Record<string, any>>(
  data: T[],
  fieldId: string,
  language: "en" | "es",
): Array<{ value: string; label: { en: string; es: string; de: string } }> {
  const uniqueValuesMap = new Map<
    string,
    { en: string; es: string; de: string }
  >();

  // Extraer valores únicos
  data.forEach((item) => {
    const value = getNestedValue(item, fieldId);

    if (value) {
      if (typeof value === "string") {
        // Si es string simple, usar el mismo valor para todos los idiomas
        const key = value.toLowerCase();
        if (!uniqueValuesMap.has(key)) {
          uniqueValuesMap.set(key, { en: value, es: value, de: value });
        }
      } else if (typeof value === "object" && "en" in value) {
        // Es MultiLanguageText, extraer todos los idiomas
        const multiLangValue = value as MultiLanguageText;
        const key = multiLangValue.en.toLowerCase(); // Usar inglés como key
        if (!uniqueValuesMap.has(key)) {
          uniqueValuesMap.set(key, {
            en: multiLangValue.en,
            es: multiLangValue.es,
            de: multiLangValue.de || multiLangValue.en,
          });
        }
      }
    }
  });

  // Convertir a opciones y ordenar por el idioma actual
  const options = Array.from(uniqueValuesMap.entries())
    .sort((a, b) => {
      const aLabel = a[1][language] || a[1].en || "";
      const bLabel = b[1][language] || b[1].en || "";
      return aLabel.localeCompare(bLabel);
    })
    .map(([key, labels]) => ({
      value: key,
      label: labels,
    }));

  return options;
}

/**
 * Hook genérico para manejar filtros en listas
 * @param data - Datos a filtrar
 * @param filterConfigs - Configuración de filtros
 * @returns Datos filtrados y funciones de control
 */
export function useFilters<T extends Record<string, any>>(
  data: T[],
  filterConfigs: FilterConfig[],
): UseFiltersResult<T> {
  const { language } = useLanguage();
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  /**
   * Enriquece la configuración de filtros con opciones dinámicas
   */
  const enrichedConfigs = useMemo(() => {
    return filterConfigs.map((config) => {
      if (
        (config.type === "select" || config.type === "multiSelect") &&
        config.dynamicOptions
      ) {
        const dynamicOptions = generateDynamicOptions(
          data,
          config.id,
          language,
        );

        return {
          ...config,
          options: [
            {
              value: "all",
              label: config.placeholder || config.label,
            },
            ...dynamicOptions,
          ],
        } as SelectFilterConfig;
      }
      return config;
    });
  }, [data, filterConfigs, language]);

  /**
   * Actualiza el valor de un filtro específico
   */
  const setFilterValue = (filterId: string, value: string | string[]) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    setFilterValues({});
  };

  /**
   * Verifica si hay filtros activos
   */
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filterValues).some(([value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== "" && value !== "all";
    });
  }, [filterValues]);

  /**
   * Filtra los datos según los valores de filtros activos
   */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return enrichedConfigs.every((config) => {
        const filterValue = filterValues[config.id];

        // Si no hay valor de filtro, no filtrar
        if (!filterValue || filterValue === "all") {
          return true;
        }

        // Filtro de texto (búsqueda)
        if (config.type === "text" && typeof filterValue === "string") {
          const searchTerm = normalizeText(filterValue);
          if (!searchTerm) return true;

          // Buscar SOLO en nombre (más específico y relevante)
          if (item.name) {
            return multiLanguageTextMatches(item.name, searchTerm);
          }

          // Si no tiene nombre, buscar en identifier como fallback
          if (item.identifier && typeof item.identifier === "string") {
            return normalizeText(item.identifier).includes(searchTerm);
          }

          return false;
        }

        // Filtro select simple
        if (config.type === "select" && typeof filterValue === "string") {
          const itemValue = getNestedValue(item, config.id);
          const normalizedFilterValue = normalizeText(filterValue);

          if (typeof itemValue === "string") {
            return normalizeText(itemValue) === normalizedFilterValue;
          }

          // Si es MultiLanguageText, comparar en todos los idiomas
          if (itemValue && typeof itemValue === "object" && "en" in itemValue) {
            const multiLang = itemValue as MultiLanguageText;
            return (
              normalizeText(multiLang.en) === normalizedFilterValue ||
              normalizeText(multiLang.es) === normalizedFilterValue ||
              normalizeText(multiLang.de || "") === normalizedFilterValue
            );
          }

          return false;
        }

        // Filtro multi-select
        if (config.type === "multiSelect" && Array.isArray(filterValue)) {
          if (filterValue.length === 0) {
            return true;
          }

          const itemValue = getNestedValue(item, config.id);
          const normalizedFilterValues = filterValue.map(normalizeText);

          if (typeof itemValue === "string") {
            return normalizedFilterValues.includes(normalizeText(itemValue));
          }

          // Si es MultiLanguageText, comparar en todos los idiomas
          if (itemValue && typeof itemValue === "object" && "en" in itemValue) {
            const multiLang = itemValue as MultiLanguageText;
            return normalizedFilterValues.some(
              (fv) =>
                normalizeText(multiLang.en) === fv ||
                normalizeText(multiLang.es) === fv ||
                normalizeText(multiLang.de || "") === fv,
            );
          }

          if (Array.isArray(itemValue)) {
            return itemValue.some((iv) => {
              if (typeof iv === "string") {
                return normalizedFilterValues.includes(normalizeText(iv));
              }
              if (iv && typeof iv === "object" && "en" in iv) {
                const multiLang = iv as MultiLanguageText;
                return normalizedFilterValues.some(
                  (fv) =>
                    normalizeText(multiLang.en) === fv ||
                    normalizeText(multiLang.es) === fv ||
                    normalizeText(multiLang.de || "") === fv,
                );
              }
              return false;
            });
          }

          return false;
        }

        return true;
      });
    });
  }, [data, filterValues, enrichedConfigs]);

  return {
    filteredData,
    filterValues,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
    enrichedConfigs, // Exportar configs enriquecidos para el componente FilterBar
  };
}
