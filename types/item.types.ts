import type { BaseEntity, MultiLanguageText } from "./common.types";

/**
 * Representa un objeto o artefacto de la mitología nórdica
 */
export interface Item extends BaseEntity {
  readonly type: MultiLanguageText;
}

/**
 * Parámetros para filtrar objetos
 */
export interface ItemFilters {
  readonly type?: string;
  readonly search?: string;
}
