import type { BaseEntity, MultiLanguageText } from "./common.types";

/**
 * Representa un ítem o artefacto de la mitología nórdica
 */
export interface Item extends BaseEntity {
  readonly type: MultiLanguageText;
}

/**
 * Parámetros para filtrar ítems
 */
export interface ItemFilters {
  readonly type?: string;
  readonly search?: string;
}
