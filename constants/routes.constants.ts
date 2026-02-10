/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  HOME: "/",
  CHARACTERS: "/characters",
  CHARACTER_DETAIL: (identifier: string) => `/characters/${identifier}`,
  CREATURES: "/creatures",
  CREATURE_DETAIL: (identifier: string) => `/creatures/${identifier}`,
  ITEMS: "/items",
  ITEM_DETAIL: (identifier: string) => `/items/${identifier}`,
  WORLDS: "/worlds",
  WORLD_DETAIL: (identifier: string) => `/worlds/${identifier}`,
  PLACES: "/places",
  PLACE_DETAIL: (identifier: string) => `/places/${identifier}`,
} as const;

/**
 * Títulos de las secciones
 */
export const SECTION_TITLES = {
  characters: {
    es: "Personajes",
    en: "Characters",
  },
  creatures: {
    es: "Criaturas",
    en: "Creatures",
  },
  items: {
    es: "Ítems",
    en: "Items",
  },
  worlds: {
    es: "Mundos",
    en: "Worlds",
  },
  places: {
    es: "Lugares",
    en: "Places",
  },
} as const;
