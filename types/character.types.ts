import type {
  BaseEntity,
  MultiLanguageText,
  DatabaseReference,
} from "./common.types";

/**
 * Representa un personaje de la mitología nórdica
 */
export interface Character extends BaseEntity {
  readonly title: MultiLanguageText;
  readonly race: MultiLanguageText;
  readonly world: DatabaseReference | string; // String cuando está serializado
}

/**
 * Character con información del mundo poblada
 */
export interface CharacterWithWorld extends Omit<Character, "world"> {
  readonly world: {
    readonly identifier: string;
    readonly name: MultiLanguageText;
    readonly mainColor: string;
    readonly image: string;
  };
}

/**
 * Parámetros para filtrar personajes
 */
export interface CharacterFilters {
  readonly worldId?: string;
  readonly race?: string;
  readonly search?: string;
}
