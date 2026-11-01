import { creatureRepository } from "../database/repositories/creature.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import { normalizeCreatureRace } from "@/constants/races.constants";
import type { Creature, CreatureFilters } from "@/types/creature.types";
import { sortByOrder } from "@/lib/utils/sort-by-order";
import { getOrder } from "../database/repositories/order.repository";

/** La especie llega como enum crudo (`HORSE`): aquí se convierte en texto por idioma. */
const withRace = (c: Creature): Creature => ({ ...c, race: normalizeCreatureRace(c.race) });

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
      const [all, order] = await Promise.all([
        creatureRepository.findAll(),
        getOrder(COLLECTIONS.CREATURES),
      ]);
      return sortByOrder(all, order).map(withRace);
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

      const creature = await creatureRepository.findByIdentifier(identifier);
      return creature ? withRace(creature) : null;
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
      return (await creatureRepository.findWithFilters(filters)).map(withRace);
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
  /**
   * Una muestra con ilustración para las tiras de la home.
   */
  async getIllustrated(limit: number): Promise<Creature[]> {
    try {
      return (await creatureRepository.findIllustrated(limit)).map(withRace);
    } catch (error) {
      console.error("[CreatureService.getIllustrated] Error:", error);
      return [];
    }
  }
}

export const creatureService = new CreatureService();
