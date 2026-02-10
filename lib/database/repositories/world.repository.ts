import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import type { World } from "@/types/world.types";

/**
 * Repositorio para la entidad World
 * Extiende el repositorio base con operaciones específicas de mundos
 */
export class WorldRepository extends BaseRepository<World> {
  protected collectionName = COLLECTIONS.WORLDS;

  /**
   * Encuentra todos los mundos ordenados por nombre
   */
  async findAllSorted(): Promise<World[]> {
    try {
      return await this.findAll({ sort: { "name.en": 1 } });
    } catch (error) {
      this.handleError("findAllSorted", error);
      throw error;
    }
  }
}

export const worldRepository = new WorldRepository();
