import { FilterType, type FilterConfig } from "@/types/filter.types";

/**
 * Configuración de filtros para la página de Characters
 */
export const CHARACTER_FILTERS: FilterConfig[] = [
  {
    id: "search",
    type: FilterType.TEXT,
    label: {
      en: "Search",
      es: "Buscar",
      de: "Suchen",
    },
    placeholder: {
      en: "Search by name...",
      es: "Buscar por nombre...",
      de: "Nach Name suchen...",
    },
  },
  {
    id: "race",
    type: FilterType.SELECT,
    label: {
      en: "Race",
      es: "Raza",
      de: "Rasse",
    },
    placeholder: {
      en: "All races",
      es: "Todas las razas",
      de: "Alle Rassen",
    },
    dynamicOptions: true, // Opciones generadas dinámicamente de los datos
  },
  {
    id: "world.name",
    type: FilterType.SELECT,
    label: {
      en: "World",
      es: "Mundo",
      de: "Welt",
    },
    placeholder: {
      en: "All worlds",
      es: "Todos los mundos",
      de: "Alle Welten",
    },
    dynamicOptions: true, // Opciones generadas dinámicamente de los datos
  },
];

/**
 * Configuración de filtros para la página de Creatures
 */
export const CREATURE_FILTERS: FilterConfig[] = [
  {
    id: "search",
    type: FilterType.TEXT,
    label: {
      en: "Search",
      es: "Buscar",
      de: "Suchen",
    },
    placeholder: {
      en: "Search by name...",
      es: "Buscar por nombre...",
      de: "Nach Name suchen...",
    },
  },
  {
    id: "race",
    type: FilterType.SELECT,
    label: {
      en: "Race",
      es: "Raza",
      de: "Rasse",
    },
    placeholder: {
      en: "All races",
      es: "Todas las razas",
      de: "Alle Rassen",
    },
    dynamicOptions: true, // Opciones generadas dinámicamente de los datos
  },
];

/**
 * Configuración de filtros para la página de Items
 */
export const ITEM_FILTERS: FilterConfig[] = [
  {
    id: "search",
    type: FilterType.TEXT,
    label: {
      en: "Search",
      es: "Buscar",
      de: "Suchen",
    },
    placeholder: {
      en: "Search by name...",
      es: "Buscar por nombre...",
      de: "Nach Name suchen...",
    },
  },
  {
    id: "type",
    type: FilterType.SELECT,
    label: {
      en: "Type",
      es: "Tipo",
      de: "Typ",
    },
    placeholder: {
      en: "All types",
      es: "Todos los tipos",
      de: "Alle Typen",
    },
    dynamicOptions: true, // Opciones generadas dinámicamente de los datos
  },
];

/**
 * Configuración de filtros para la página de Places
 */
export const PLACE_FILTERS: FilterConfig[] = [
  {
    id: "search",
    type: FilterType.TEXT,
    label: {
      en: "Search",
      es: "Buscar",
      de: "Suchen",
    },
    placeholder: {
      en: "Search by name...",
      es: "Buscar por nombre...",
      de: "Nach Name suchen...",
    },
  },
];
