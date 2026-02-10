import type { BaseEntity, DatabaseReference } from "./common.types";

/**
 * Representa un mundo de la mitología nórdica
 */
export interface World extends BaseEntity {
  readonly places: ReadonlyArray<DatabaseReference | string>; // String cuando está serializado
  readonly detailedIcon: string;
  readonly mainColor: string;
}

/**
 * World con información básica de lugares
 */
export interface WorldWithPlaces extends Omit<World, "places"> {
  readonly places: ReadonlyArray<{
    readonly identifier: string;
    readonly name: string;
  }>;
}
