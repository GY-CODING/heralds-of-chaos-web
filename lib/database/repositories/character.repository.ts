import { Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import type { Character, CharacterFilters } from "@/types/character.types";

/**
 * Repositorio para la entidad Character
 * Extiende el repositorio base con operaciones específicas de personajes
 */
export class CharacterRepository extends BaseRepository<Character> {
  protected collectionName = COLLECTIONS.CHARACTERS;

  /**
   * Encuentra personajes por mundo
   */
  async findByWorld(worldId: string): Promise<Character[]> {
    try {
      const filter: Filter<Character> = {
        "world.$id.$oid": worldId,
      } as Filter<Character>;

      return await this.findByFilter(filter);
    } catch (error) {
      this.handleError("findByWorld", error);
      throw error;
    }
  }

  /**
   * Encuentra personajes aplicando filtros
   */
  async findWithFilters(filters: CharacterFilters): Promise<Character[]> {
    try {
      const mongoFilter: Filter<Character> = {};

      if (filters.worldId) {
        Object.assign(mongoFilter, {
          "world.$id.$oid": filters.worldId,
        });
      }

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

      return await this.findByFilter(mongoFilter as Filter<Character>);
    } catch (error) {
      this.handleError("findWithFilters", error);
      throw error;
    }
  }
}

export const characterRepository = new CharacterRepository();
