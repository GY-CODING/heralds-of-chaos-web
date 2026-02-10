/**
 * Nombres de las colecciones en MongoDB
 */
export const COLLECTIONS = {
  CHARACTERS: "Character",
  CREATURES: "Creature",
  ITEMS: "Item",
  WORLDS: "World",
  PLACES: "Place",
} as const;

/**
 * Tipos de las colecciones
 */
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
