import { creatureRepository } from "../database/repositories/creature.repository";
import type { Creature, CreatureFilters } from "@/types/creature.types";

/**
 * Servicio de Creatures
 * Capa de lógica de negocio entre los repositorios y las API routes
 */
export class CreatureService {
  /**
   * Obtiene todas las criaturas
   */
  async getAllCreatures(): Promise<Creature[]> {
    try {
      return await creatureRepository.findAll();
    } catch (error) {
      console.error("[CreatureService.getAllCreatures] Error:", error);
      throw new Error("Failed to fetch creatures");
    }
  }

  /**
   * Obtiene una criatura por su identifier
   */
  async getCreatureByIdentifier(identifier: string): Promise<Creature | null> {
    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      return await creatureRepository.findByIdentifier(identifier);
    } catch (error) {
      console.error(`[CreatureService.getCreatureByIdentifier] Error:`, error);
      throw new Error("Failed to fetch creature");
    }
  }

  /**
   * Busca criaturas con filtros
   */
  async searchCreatures(filters: CreatureFilters): Promise<Creature[]> {
    try {
      return await creatureRepository.findWithFilters(filters);
    } catch (error) {
      console.error("[CreatureService.searchCreatures] Error:", error);
      throw new Error("Failed to search creatures");
    }
  }

  /**
   * Cuenta el total de criaturas
   */
  async countCreatures(): Promise<number> {
    try {
      return await creatureRepository.count();
    } catch (error) {
      console.error("[CreatureService.countCreatures] Error:", error);
      throw new Error("Failed to count creatures");
    }
  }
}

export const creatureService = new CreatureService();
