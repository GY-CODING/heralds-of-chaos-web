import type { BaseEntity, MultiLanguageText } from "./common.types";

/**
 * Representa un lugar dentro de un mundo
 */
export interface Place extends BaseEntity {
  readonly worldId?: string;
}

/**
 * Place con información del mundo poblada
 */
export interface PlaceWithWorld extends BaseEntity {
  readonly world?: {
    readonly identifier: string;
    readonly name: MultiLanguageText;
    readonly mainColor: string;
    /** La runa del reino, para el sello de la lámina. */
    readonly detailedIcon: string;
  };
}

/**
 * Parámetros para filtrar lugares
 */
export interface PlaceFilters {
  readonly worldId?: string;
  readonly search?: string;
}
