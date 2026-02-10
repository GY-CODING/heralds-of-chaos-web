/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseEntity } from "@/types/common.types";
import { Collection, Filter, FindOptions, ObjectId } from "mongodb";
import { getDatabase } from "../mongodb";

/**
 * Serializa un documento de MongoDB para uso en Next.js
 * Convierte ObjectId y DBRef a strings planos
 */
function serializeDocument<T>(doc: any): T {
  if (!doc) return doc;

  const serialized = { ...doc };

  // Convertir _id a string
  if (serialized._id) {
    serialized._id = serialized._id.toString();
  }

  // Convertir referencias (DBRef) a strings o removerlas
  Object.keys(serialized).forEach((key) => {
    const value = serialized[key];

    // Si es un array, procesar cada elemento
    if (Array.isArray(value)) {
      serialized[key] = value.map((item) => {
        // Si el item es un DBRef con $id
        if (item && typeof item === "object" && item.$id) {
          return item.$id.toString();
        }
        // Si tiene oid (formato extendido)
        else if (item && typeof item === "object" && item.oid) {
          return item.oid.toString();
        }
        // Si es un ObjectId
        else if (
          item &&
          typeof item === "object" &&
          item._bsontype === "ObjectId"
        ) {
          return item.toString();
        }
        return item;
      });
    }
    // Si es un DBRef (tiene $ref y $id)
    else if (value && typeof value === "object" && value.$id) {
      serialized[key] = value.$id.toString();
    }
    // Si es un ObjectId
    else if (
      value &&
      typeof value === "object" &&
      value._bsontype === "ObjectId"
    ) {
      serialized[key] = value.toString();
    }
    // Si es un objeto con collection, oid, db, fields (DBRef extendido)
    else if (value && typeof value === "object" && value.oid) {
      serialized[key] = value.oid.toString();
    }
  });

  return serialized as T;
}

/**
 * Repositorio base abstracto que implementa operaciones CRUD comunes
 * Sigue el patrón Repository para abstraer el acceso a datos
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract collectionName: string;

  /**
   * Obtiene la colección de MongoDB
   */
  protected async getCollection(): Promise<Collection<T>> {
    const db = await getDatabase();
    return db.collection<T>(this.collectionName);
  }

  /**
   * Encuentra todos los documentos
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find({}, options).toArray();
      return documents.map((doc) => serializeDocument<T>(doc));
    } catch (error) {
      this.handleError("findAll", error);
      throw error;
    }
  }

  /**
   * Encuentra un documento por su identifier
   */
  async findByIdentifier(identifier: string): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const document = await collection.findOne({ identifier } as Filter<T>);
      return document ? serializeDocument<T>(document) : null;
    } catch (error) {
      this.handleError("findByIdentifier", error);
      throw error;
    }
  }

  /**
   * Encuentra un documento por su ID de MongoDB
   */
  async findById(id: string): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const document = await collection.findOne({
        _id: new ObjectId(id),
      } as Filter<T>);
      return document ? serializeDocument<T>(document) : null;
    } catch (error) {
      this.handleError("findById", error);
      throw error;
    }
  }

  /**
   * Encuentra documentos que coincidan con el filtro
   */
  async findByFilter(filter: Filter<T>, options?: FindOptions): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find(filter, options).toArray();
      return documents.map((doc) => serializeDocument<T>(doc));
    } catch (error) {
      this.handleError("findByFilter", error);
      throw error;
    }
  }

  /**
   * Cuenta documentos que coincidan con el filtro
   */
  async count(filter: Filter<T> = {}): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments(filter);
    } catch (error) {
      this.handleError("count", error);
      throw error;
    }
  }

  /**
   * Verifica si existe un documento con el filtro dado
   */
  async exists(filter: Filter<T>): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }

  /**
   * Maneja errores del repositorio
   */
  protected handleError(method: string, error: unknown): void {
    console.error(`[${this.collectionName}Repository.${method}] Error:`, error);
  }
}
