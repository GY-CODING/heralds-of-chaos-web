import { placeRepository } from "../database/repositories/place.repository";
import { worldRepository } from "../database/repositories/world.repository";
import type { Place, PlaceFilters, PlaceWithWorld } from "@/types/place.types";

/**
 * Servicio de Places
 * Capa de lógica de negocio entre los repositorios y las API routes
 */
export class PlaceService {
  /**
   * Obtiene todos los lugares
   */
  async getAllPlaces(): Promise<Place[]> {
    try {
      return await placeRepository.findAll();
    } catch (error) {
      console.error("[PlaceService.getAllPlaces] Error:", error);
      throw new Error("Failed to fetch places");
    }
  }

  /**
   * Obtiene un lugar por su identifier con información del mundo
   */
  async getPlaceByIdentifier(
    identifier: string,
  ): Promise<PlaceWithWorld | null> {
    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      const place = await placeRepository.findByIdentifier(identifier);

      if (!place) {
        return null;
      }

      // Si el lugar tiene worldId, obtener la información del mundo
      if (place.worldId) {
        const world = await worldRepository.findById(place.worldId);

        if (world) {
          return {
            ...place,
            world: {
              identifier: world.identifier,
              name: world.name,
              mainColor: world.mainColor,
            },
          };
        }
      }

      // Si no tiene mundo o no se encontró, devolver el lugar sin mundo
      return place;
    } catch (error) {
      console.error(`[PlaceService.getPlaceByIdentifier] Error:`, error);
      throw new Error("Failed to fetch place");
    }
  }

  /**
   * Busca lugares con filtros
   */
  async searchPlaces(filters: PlaceFilters): Promise<Place[]> {
    try {
      return await placeRepository.findWithFilters(filters);
    } catch (error) {
      console.error("[PlaceService.searchPlaces] Error:", error);
      throw new Error("Failed to search places");
    }
  }

  /**
   * Cuenta el total de lugares
   */
  async countPlaces(): Promise<number> {
    try {
      return await placeRepository.count();
    } catch (error) {
      console.error("[PlaceService.countPlaces] Error:", error);
      throw new Error("Failed to count places");
    }
  }
}

export const placeService = new PlaceService();
