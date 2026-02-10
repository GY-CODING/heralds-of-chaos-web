import { itemRepository } from "../database/repositories/item.repository";
import type { Item, ItemFilters } from "@/types/item.types";

/**
 * Servicio de Items
 * Capa de lógica de negocio entre los repositorios y las API routes
 */
export class ItemService {
  /**
   * Obtiene todos los ítems
   */
  async getAllItems(): Promise<Item[]> {
    try {
      return await itemRepository.findAll();
    } catch (error) {
      console.error("[ItemService.getAllItems] Error:", error);
      throw new Error("Failed to fetch items");
    }
  }

  /**
   * Obtiene un ítem por su identifier
   */
  async getItemByIdentifier(identifier: string): Promise<Item | null> {
    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      return await itemRepository.findByIdentifier(identifier);
    } catch (error) {
      console.error(`[ItemService.getItemByIdentifier] Error:`, error);
      throw new Error("Failed to fetch item");
    }
  }

  /**
   * Busca ítems con filtros
   */
  async searchItems(filters: ItemFilters): Promise<Item[]> {
    try {
      return await itemRepository.findWithFilters(filters);
    } catch (error) {
      console.error("[ItemService.searchItems] Error:", error);
      throw new Error("Failed to search items");
    }
  }

  /**
   * Cuenta el total de ítems
   */
  async countItems(): Promise<number> {
    try {
      return await itemRepository.count();
    } catch (error) {
      console.error("[ItemService.countItems] Error:", error);
      throw new Error("Failed to count items");
    }
  }
}

export const itemService = new ItemService();
