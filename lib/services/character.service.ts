import { characterRepository } from "../database/repositories/character.repository";
import type { Character, CharacterFilters } from "@/types/character.types";

/**
 * Servicio de Characters
 * Capa de lógica de negocio entre los repositorios y las API routes
 */
export class CharacterService {
  /**
   * Obtiene todos los personajes
   */
  async getAllCharacters(): Promise<Character[]> {
    try {
      return await characterRepository.findAll();
    } catch (error) {
      console.error("[CharacterService.getAllCharacters] Error:", error);
      throw new Error("Failed to fetch characters");
    }
  }

  /**
   * Obtiene un personaje por su identifier
   */
  async getCharacterByIdentifier(
    identifier: string,
  ): Promise<Character | null> {
    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      return await characterRepository.findByIdentifier(identifier);
    } catch (error) {
      console.error(
        `[CharacterService.getCharacterByIdentifier] Error:`,
        error,
      );
      throw new Error("Failed to fetch character");
    }
  }

  /**
   * Obtiene personajes por mundo
   */
  async getCharactersByWorld(worldId: string): Promise<Character[]> {
    try {
      if (!worldId) {
        throw new Error("World ID is required");
      }

      return await characterRepository.findByWorld(worldId);
    } catch (error) {
      console.error(`[CharacterService.getCharactersByWorld] Error:`, error);
      throw new Error("Failed to fetch characters by world");
    }
  }

  /**
   * Busca personajes con filtros
   */
  async searchCharacters(filters: CharacterFilters): Promise<Character[]> {
    try {
      return await characterRepository.findWithFilters(filters);
    } catch (error) {
      console.error("[CharacterService.searchCharacters] Error:", error);
      throw new Error("Failed to search characters");
    }
  }

  /**
   * Cuenta el total de personajes
   */
  async countCharacters(): Promise<number> {
    try {
      return await characterRepository.count();
    } catch (error) {
      console.error("[CharacterService.countCharacters] Error:", error);
      throw new Error("Failed to count characters");
    }
  }
}

export const characterService = new CharacterService();
