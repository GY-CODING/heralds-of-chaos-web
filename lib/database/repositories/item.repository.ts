import { Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import { itemTypeKeysMatching } from "@/constants/races.constants";
import type { Item, ItemFilters } from "@/types/item.types";

/**
 * Repositorio para la entidad Item
 * Extiende el repositorio base con operaciones específicas de objetos
 */
export class ItemRepository extends BaseRepository<Item> {
  protected collectionName = COLLECTIONS.ITEMS;

  /**
   * Encuentra objetos aplicando filtros
   */
  async findWithFilters(filters: ItemFilters): Promise<Item[]> {
    try {
      const mongoFilter: Filter<Item> = {};

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

      if (filters.type) {
        // `type` se guarda como enum (`SWORD`); se acepta clave o etiqueta en cualquier idioma.
        Object.assign(mongoFilter, { type: { $in: itemTypeKeysMatching(filters.type) } });
      }

      return await this.findByFilter(mongoFilter as Filter<Item>);
    } catch (error) {
      this.handleError("findWithFilters", error);
      throw error;
    }
  }
}

export const itemRepository = new ItemRepository();
