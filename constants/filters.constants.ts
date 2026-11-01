import { FilterType, type FilterConfig, type FilterParams } from "@/types/filter.types";

/**
 * Reinos que no entran en el carril de reinos de personajes: no hay ni habrá personajes ligados.
 * Siguen apareciendo en mundos, home, fichas y pie.
 */
export const REALMS_WITHOUT_CHARACTERS: readonly string[] = ["niflheim"];

/**
 * Ginnungagap tiene runa, color y personajes, pero no es uno de los nueve mundos que cuelgan del
 * árbol: es el vacío anterior a todo. Fuera del árbol y del atlas; en `/worlds` y en los filtros sigue.
 */
export const NOT_A_REALM: readonly string[] = ["ginnungagap"];

/** Qué filtro de personajes vive en qué parámetro de la URL: `/characters?worlds=vanaheim`. */
export const CHARACTER_FILTER_PARAMS: FilterParams = {
  search: { param: "search" },
  race: { param: "race" },
  "world.identifier": { param: "worlds", list: true },
};

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
    id: "world.identifier",
    // Multiselección: el carril de runas deja marcar varios reinos a la vez.
    type: FilterType.MULTI_SELECT,
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
