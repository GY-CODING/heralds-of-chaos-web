import type { World, WorldWithPlaces } from "@/types/world.types";
import { placeRepository } from "../database/repositories/place.repository";
import { worldRepository } from "../database/repositories/world.repository";

/**
 * Servicio de Worlds
 * Capa de lógica de negocio entre los repositorios y las API routes
 */
export class WorldService {
  /**
   * Obtiene todos los mundos
   */
  async getAllWorlds(): Promise<World[]> {
    try {
      return await worldRepository.findAllSorted();
    } catch (error) {
      console.error("[WorldService.getAllWorlds] Error:", error);
      throw new Error("Failed to fetch worlds");
    }
  }

  /**
   * Obtiene un mundo por su identifier
   */
  async getWorldByIdentifier(identifier: string): Promise<World | null> {
    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      return await worldRepository.findByIdentifier(identifier);
    } catch (error) {
      console.error(`[WorldService.getWorldByIdentifier] Error:`, error);
      throw new Error("Failed to fetch world");
    }
  }

  /**
   * Obtiene un mundo con sus lugares poblados
   */
  async getWorldWithPlaces(
    identifier: string,
  ): Promise<WorldWithPlaces | null> {
    try {
      const world = await this.getWorldByIdentifier(identifier);

      if (!world) {
        return null;
      }

      // Extraer IDs de lugares, manejando tanto string como DatabaseReference
      const placeIds = world.places
        .map((p) => {
          if (typeof p === "string") {
            return p;
          }
          // Es DatabaseReference
          return p.$id?.$oid || (p.$id as unknown as string);
        })
        .filter((id): id is string => typeof id === "string");

      const places = await placeRepository.findByIds(placeIds);

      return {
        ...world,
        places: places.map((place) => ({
          identifier: place.identifier,
          name: place.name.en,
        })),
      };
    } catch (error) {
      console.error("[WorldService.getWorldWithPlaces] Error:", error);
      throw new Error("Failed to fetch world with places");
    }
  }

  /**
   * Cuenta el total de mundos
   */
  async countWorlds(): Promise<number> {
    try {
      return await worldRepository.count();
    } catch (error) {
      console.error("[WorldService.countWorlds] Error:", error);
      throw new Error("Failed to count worlds");
    }
  }
}

export const worldService = new WorldService();
