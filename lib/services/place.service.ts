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

      // El lugar no guarda su reino: es el reino el que lleva la lista de sus lugares
      // (`world.places`). Son diez documentos, así que se recorren y ya está. El campo
      // `place.worldId` existe en el tipo pero ningún registro lo trae.
      const worlds = await worldRepository.findAll();
      const world =
        worlds.find((w) => w.places?.some((id) => id === place._id)) ??
        (place.worldId ? worlds.find((w) => w._id === place.worldId) : undefined);

      if (world) {
        return {
          ...place,
          world: {
            identifier: world.identifier,
            name: world.name,
            mainColor: world.mainColor,
            detailedIcon: world.detailedIcon,
          },
        };
      }

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
  /**
   * Una muestra con ilustración para las tiras de la home.
   */
  async getIllustrated(limit: number): Promise<Place[]> {
    try {
      return await placeRepository.findIllustrated(limit);
    } catch (error) {
      console.error("[PlaceService.getIllustrated] Error:", error);
      return [];
    }
  }
  /**
   * Lugares concretos por id: los salones que el reino lleva en su lista.
   */
  async getByIds(ids: string[], limit?: number): Promise<Place[]> {
    try {
      return await placeRepository.findByIds(ids, limit);
    } catch (error) {
      console.error("[PlaceService.getByIds] Error:", error);
      return [];
    }
  }
}

export const placeService = new PlaceService();
