/**
 * Representa un texto multiidioma soportado por la aplicación
 */
export interface MultiLanguageText {
  readonly es: string;
  readonly en: string;
  readonly de?: string;
}

/**
 * Idiomas soportados por la aplicación
 */
export type Language = "es" | "en";

/**
 * Entidad base con campos comunes a todas las entidades
 */
export interface BaseEntity {
  readonly _id: string;
  readonly identifier: string;
  readonly name: MultiLanguageText;
  readonly description: MultiLanguageText;
  readonly image: string;
}

/**
 * Referencia a otra entidad en MongoDB
 */
export interface DatabaseReference {
  readonly $ref: string;
  readonly $id: {
    readonly $oid: string;
  };
}

/**
 * Estado de carga de datos
 */
export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

/**
 * Respuesta genérica de la API
 */
export interface ApiResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly status: number;
}
