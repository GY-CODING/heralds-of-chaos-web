import { Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import type { Creature, CreatureFilters } from "@/types/creature.types";

/**
 * Repositorio para la entidad Creature
 * Extiende el repositorio base con operaciones específicas de criaturas
 */
export class CreatureRepository extends BaseRepository<Creature> {
  protected collectionName = COLLECTIONS.CREATURES;

  /**
   * Encuentra criaturas aplicando filtros
   */
  async findWithFilters(filters: CreatureFilters): Promise<Creature[]> {
    try {
      const mongoFilter: Filter<Creature> = {};

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

      if (filters.race) {
        Object.assign(mongoFilter, {
          $or: [
            { "race.es": { $regex: filters.race, $options: "i" } },
            { "race.en": { $regex: filters.race, $options: "i" } },
          ],
        });
      }

      return await this.findByFilter(mongoFilter as Filter<Creature>);
    } catch (error) {
      this.handleError("findWithFilters", error);
      throw error;
    }
  }
}

export const creatureRepository = new CreatureRepository();
