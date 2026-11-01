import type { MultiLanguageText } from "@/types/common.types";

/**
 * Las razas llegan de la base de datos como el enum crudo del back (`LIGHT_ELF`, `JOTUN`…).
 * Aquí se traducen al texto que se enseña, igual que hace el back en castellano.
 */
export const RACE_LABELS: Record<string, MultiLanguageText> = {
  AESIR: { es: "Æsir", en: "Æsir", de: "Asen" },
  VANIR: { es: "Vanir", en: "Vanir", de: "Wanen" },
  VALKYRIA: { es: "Valkyria", en: "Valkyrie", de: "Walküre" },
  LIGHT_ELF: { es: "Elfo de Luz", en: "Light Elf", de: "Lichtelf" },
  DARK_ELF: { es: "Elfo Oscuro", en: "Dark Elf", de: "Dunkelelf" },
  HUMAN: { es: "Humano", en: "Human", de: "Mensch" },
  VEGAR: { es: "Vegar", en: "Vegar", de: "Vegar" },
  NIBELUNG: { es: "Nibelungo", en: "Nibelung", de: "Nibelunge" },
  JOTUN: { es: "Gigante de Hielo", en: "Frost Giant", de: "Frostriese" },
  MUSPEL: { es: "Gigante de Fuego", en: "Fire Giant", de: "Feuerriese" },
  // Sin equivalente en el back: se deja como "Gigante" genérico hasta confirmarlo.
  GIANT: { es: "Gigante", en: "Giant", de: "Riese" },
  PRIMORDIAL_ENTITY: { es: "Entidad Primigenia", en: "Primordial Entity", de: "Urwesen" },
  UNKNOWN: { es: "Desconocida", en: "Unknown", de: "Unbekannt" },
};

/** `SOME_NEW_RACE` → "Some New Race": una raza nueva nunca vuelve a verse con `_` ni en mayúsculas. */
function prettify(value: string): string {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Las criaturas guardan su especie en `race` como enum (`HORSE`, `DRAGON`…). es/en, como en el back; el back no trae alemán: `de` vacío. */
export const CREATURE_RACE_LABELS: Record<string, MultiLanguageText> = {
  HORSE: { es: "Caballo", en: "Horse", de: "" },
  DRAGON: { es: "Dragón", en: "Dragon", de: "" },
  WOLF: { es: "Lobo", en: "Wolf", de: "" },
  GOAT: { es: "Cabra", en: "Goat", de: "" },
  RAVEN: { es: "Cuervo", en: "Raven", de: "" },
  COW: { es: "Vaca", en: "Cow", de: "" },
  EAGLE: { es: "Águila", en: "Eagle", de: "" },
  DEER: { es: "Ciervo", en: "Deer", de: "" },
  SQUIRREL: { es: "Ardilla", en: "Squirrel", de: "" },
  SNAKE: { es: "Serpiente", en: "Snake", de: "" },
  BOAR: { es: "Jabalí", en: "Boar", de: "" },
  UNKNOWN: { es: "Desconocida", en: "Unknown", de: "" },
};

/** Los objetos guardan su clase en `type` como enum (`SWORD`, `OBJECT`…). es/en, como en el back; el back no trae alemán: `de` vacío. */
export const ITEM_TYPE_LABELS: Record<string, MultiLanguageText> = {
  OBJECT: { es: "Objeto", en: "Object", de: "" },
  SWORD: { es: "Espada", en: "Sword", de: "" },
  RING: { es: "Anillo", en: "Ring", de: "" },
  REMAINS: { es: "Restos", en: "Remains", de: "" },
  BOOK: { es: "Libro", en: "Book", de: "" },
  PLANT: { es: "Planta", en: "Plant", de: "" },
  CAULDRON: { es: "Caldero", en: "Cauldron", de: "" },
  HAMMER: { es: "Martillo", en: "Hammer", de: "" },
  FRUIT: { es: "Fruta", en: "Fruit", de: "" },
  CRAFT: { es: "Artesanía", en: "Craft", de: "" },
  JEWELRY: { es: "Joyería", en: "Jewelry", de: "" },
  AXE: { es: "Hacha", en: "Axe", de: "" },
  HORN: { es: "Cuerno", en: "Horn", de: "" },
  STAFF: { es: "Bastón", en: "Staff", de: "" },
  SPEAR: { es: "Lanza", en: "Spear", de: "" },
  GLOVES: { es: "Guantes", en: "Gloves", de: "" },
  BELT: { es: "Cinturón", en: "Belt", de: "" },
  SHIELD: { es: "Escudo", en: "Shield", de: "" },
  MACE: { es: "Maza", en: "Mace", de: "" },
  UNKNOWN: { es: "Desconocido", en: "Unknown", de: "" },
};

/**
 * Convierte lo que traiga el campo (enum, texto suelto o ya multiidioma) en texto multiidioma.
 * Idempotente: pasarle algo ya normalizado lo devuelve igual.
 */
function normalizeEnum(value: unknown, labels: Record<string, MultiLanguageText>): MultiLanguageText {
  if (value && typeof value === "object" && "en" in value) return value as MultiLanguageText;
  if (typeof value !== "string" || !value.trim()) return labels.UNKNOWN;

  const key = value.trim().toUpperCase().replace(/\s+/g, "_");
  const known = labels[key];
  if (known) return known;

  const nice = prettify(value);
  return { es: nice, en: nice, de: nice };
}

export const normalizeRace = (value: unknown) => normalizeEnum(value, RACE_LABELS);
export const normalizeCreatureRace = (value: unknown) => normalizeEnum(value, CREATURE_RACE_LABELS);
export const normalizeItemType = (value: unknown) => normalizeEnum(value, ITEM_TYPE_LABELS);

/** Claves del enum cuya etiqueta (en cualquier idioma) o clave coincide con el texto buscado. */
function keysMatching(query: string, labels: Record<string, MultiLanguageText>): string[] {
  const q = query.trim().toLowerCase();
  return Object.entries(labels)
    .filter(
      ([key, l]) =>
        key.toLowerCase() === q.replace(/\s+/g, "_") ||
        [l.es, l.en, l.de ?? ""].some((x) => x && x.toLowerCase() === q),
    )
    .map(([key]) => key);
}

export const raceKeysMatching = (query: string) => keysMatching(query, RACE_LABELS);
export const creatureRaceKeysMatching = (query: string) => keysMatching(query, CREATURE_RACE_LABELS);
export const itemTypeKeysMatching = (query: string) => keysMatching(query, ITEM_TYPE_LABELS);
