import { itemRepository } from "../database/repositories/item.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import { normalizeItemType } from "@/constants/races.constants";
import type { Item, ItemFilters } from "@/types/item.types";
import { sortByOrder } from "@/lib/utils/sort-by-order";
import { getOrder } from "../database/repositories/order.repository";

/** La clase llega como enum crudo (`SWORD`): aquí se convierte en texto por idioma. */
const withType = (i: Item): Item => ({ ...i, type: normalizeItemType(i.type) });

/**
 * Servicio de Items
 * Capa de lógica de negocio entre los repositorios y las API routes
 */
export class ItemService {
  /**
   * Obtiene todos los objetos
   */
  async getAllItems(): Promise<Item[]> {
    try {
      const [all, order] = await Promise.all([itemRepository.findAll(), getOrder(COLLECTIONS.ITEMS)]);
      return sortByOrder(all, order).map(withType);
    } catch (error) {
      console.error("[ItemService.getAllItems] Error:", error);
      throw new Error("Failed to fetch items");
    }
  }

  /**
   * Obtiene un objeto por su identifier
   */
  async getItemByIdentifier(identifier: string): Promise<Item | null> {
    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      const item = await itemRepository.findByIdentifier(identifier);
      return item ? withType(item) : null;
    } catch (error) {
      console.error(`[ItemService.getItemByIdentifier] Error:`, error);
      throw new Error("Failed to fetch item");
    }
  }

  /**
   * Busca objetos con filtros
   */
  async searchItems(filters: ItemFilters): Promise<Item[]> {
    try {
      return (await itemRepository.findWithFilters(filters)).map(withType);
    } catch (error) {
      console.error("[ItemService.searchItems] Error:", error);
      throw new Error("Failed to search items");
    }
  }

  /**
   * Cuenta el total de objetos
   */
  async countItems(): Promise<number> {
    try {
      return await itemRepository.count();
    } catch (error) {
      console.error("[ItemService.countItems] Error:", error);
      throw new Error("Failed to count items");
    }
  }
  /**
   * Una muestra con ilustración para las tiras de la home.
   */
  async getIllustrated(limit: number): Promise<Item[]> {
    try {
      return (await itemRepository.findIllustrated(limit)).map(withType);
    } catch (error) {
      console.error("[ItemService.getIllustrated] Error:", error);
      return [];
    }
  }
}

export const itemService = new ItemService();
