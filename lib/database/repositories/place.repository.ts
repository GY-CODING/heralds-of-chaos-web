import { Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import type { Place, PlaceFilters } from "@/types/place.types";

/**
 * Repositorio para la entidad Place
 * Extiende el repositorio base con operaciones específicas de lugares
 */
export class PlaceRepository extends BaseRepository<Place> {
  protected collectionName = COLLECTIONS.PLACES;

  /**
   * Encuentra lugares aplicando filtros
   */
  async findWithFilters(filters: PlaceFilters): Promise<Place[]> {
    try {
      const mongoFilter: Filter<Place> = {};

      if (filters.search) {
        Object.assign(mongoFilter, {
          $or: [
            { "name.es": { $regex: filters.search, $options: "i" } },
            { "name.en": { $regex: filters.search, $options: "i" } },
            { "description.es": { $regex: filters.search, $options: "i" } },
            { "description.en": { $regex: filters.search, $options: "i" } },
          ],
        });
      }

      return await this.findByFilter(mongoFilter as Filter<Place>);
    } catch (error) {
      this.handleError("findWithFilters", error);
      throw error;
    }
  }
}

export const placeRepository = new PlaceRepository();
