import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import type { World } from "@/types/world.types";
import { sortByOrder } from "@/lib/utils/sort-by-order";
import { getOrder, WORLD_ORDER } from "./order.repository";

/**
 * Repositorio para la entidad World
 * Extiende el repositorio base con operaciones específicas de mundos
 */
export class WorldRepository extends BaseRepository<World> {
  protected collectionName = COLLECTIONS.WORLDS;

  /**
   * Encuentra todos los mundos en el orden de la cosmología (Asgard, Alfheim, Vanaheim…).
   * `_Order` rellena lo que `WORLD_ORDER` no nombre, por si algún día hay un mundo nuevo.
   */
  async findAllSorted(): Promise<World[]> {
    try {
      const [worlds, stored] = await Promise.all([this.findAll(), getOrder(COLLECTIONS.WORLDS)]);
      return sortByOrder(worlds, [...WORLD_ORDER, ...stored]);
    } catch (error) {
      this.handleError("findAllSorted", error);
      throw error;
    }
  }
}

export const worldRepository = new WorldRepository();
