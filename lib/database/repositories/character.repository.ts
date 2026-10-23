/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "@/constants/database.constants";
import type { Character, CharacterFilters } from "@/types/character.types";

/**
 * Repositorio para la entidad Character
 * Extiende el repositorio base con operaciones específicas de personajes
 */
export class CharacterRepository extends BaseRepository<Character> {
  protected collectionName = COLLECTIONS.CHARACTERS;

  /**
   * Encuentra personajes por mundo
   */
  async findByWorld(worldId: string): Promise<Character[]> {
    try {
      const filter: Filter<Character> = {
        "world.$id.$oid": worldId,
      } as Filter<Character>;

      return await this.findByFilter(filter);
    } catch (error) {
      this.handleError("findByWorld", error);
      throw error;
    }
  }

  /**
   * Encuentra personajes aplicando filtros
   */
  async findWithFilters(filters: CharacterFilters): Promise<Character[]> {
    try {
      const mongoFilter: Filter<Character> = {};

      if (filters.worldId) {
        Object.assign(mongoFilter, {
          "world.$id.$oid": filters.worldId,
        });
      }

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

      if (filters.race) {
        Object.assign(mongoFilter, {
          $or: [
            { "race.es": { $regex: filters.race, $options: "i" } },
            { "race.en": { $regex: filters.race, $options: "i" } },
          ],
        });
      }

      return await this.findByFilter(mongoFilter as Filter<Character>);
    } catch (error) {
      this.handleError("findWithFilters", error);
      throw error;
    }
  }
  /**
   * Otros nombres del mismo reino, para el final de una ficha. Los que tienen ilustración van
   * primero: la fila de "por dónde seguir" tiene que dar ganas de seguir.
   */
  async findCompanions(
    worldId: string,
    excludeIdentifier: string,
    limit: number,
  ): Promise<Character[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection
        .find({}, { projection: { name: 1, identifier: 1, image: 1, title: 1, world: 1 } })
        .toArray();

      return documents
        .filter(
          (d: any) =>
            worldIdOf(d.world) === worldId && d.identifier !== excludeIdentifier,
        )
        .sort((a: any, b: any) => {
          const art = (d: any) => (d.image && !String(d.image).includes("none.webp") ? 0 : 1);
          return art(a) - art(b);
        })
        .slice(0, limit)
        .map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          world: worldIdOf((doc as any).world) ?? "",
        })) as unknown as Character[];
    } catch (error) {
      this.handleError("findCompanions", error);
      return [];
    }
  }

  /**
   * Cuántos personajes vive cada mundo, por id de mundo.
   *
   * Se lee en bruto (solo el campo `world`) y se agrupa en JS en vez de con un `$group` de
   * MongoDB: la referencia al mundo está guardada como DBRef y su forma exacta cambia entre
   * registros, así que normalizarla aquí es lo único que funciona con todos.
   */
  async countByWorld(): Promise<Record<string, number>> {
    try {
      const collection = await this.getCollection();
      const documents = await collection
        .find({}, { projection: { world: 1 } })
        .toArray();

      const census: Record<string, number> = {};
      for (const document of documents) {
        const id = worldIdOf((document as any).world);
        if (id) census[id] = (census[id] ?? 0) + 1;
      }
      return census;
    } catch (error) {
      this.handleError("countByWorld", error);
      return {};
    }
  }
}

/** La referencia al mundo llega como string, como DBRef o como ObjectId. */
function worldIdOf(value: any): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value.$id) return value.$id.$oid ?? value.$id.toString();
  if (value.oid) return value.oid.toString();
  if (typeof value.toString === "function") return value.toString();
  return null;
}

export const characterRepository = new CharacterRepository();
