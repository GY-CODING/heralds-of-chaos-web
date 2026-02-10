import type { BaseEntity, MultiLanguageText } from "./common.types";

/**
 * Representa una criatura de la mitología nórdica
 */
export interface Creature extends BaseEntity {
  readonly race: MultiLanguageText;
}

/**
 * Parámetros para filtrar criaturas
 */
export interface CreatureFilters {
  readonly race?: string;
  readonly search?: string;
}
