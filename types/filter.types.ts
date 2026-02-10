/**
 * Tipos de filtros disponibles
 */
export enum FilterType {
  TEXT = "text",
  SELECT = "select",
  MULTI_SELECT = "multiSelect",
}

/**
 * Configuración base de un filtro
 */
export interface BaseFilterConfig {
  id: string;
  type: FilterType;
  label: {
    en: string;
    es: string;
    de: string;
  };
  placeholder?: {
    en: string;
    es: string;
    de: string;
  };
}

/**
 * Configuración de filtro de texto
 */
export interface TextFilterConfig extends BaseFilterConfig {
  type: FilterType.TEXT;
}

/**
 * Configuración de filtro select
 */
export interface SelectFilterConfig extends BaseFilterConfig {
  type: FilterType.SELECT;
  dynamicOptions?: boolean; // Si es true, las opciones se generan dinámicamente de los datos
  options?: Array<{
    value: string;
    label: {
      en: string;
      es: string;
      de: string;
    };
  }>;
}

/**
 * Configuración de filtro multi-select
 */
export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: FilterType.MULTI_SELECT;
  dynamicOptions?: boolean; // Si es true, las opciones se generan dinámicamente de los datos
  options?: Array<{
    value: string;
    label: {
      en: string;
      es: string;
      de: string;
    };
  }>;
}

/**
 * Unión de todos los tipos de filtros
 */
export type FilterConfig =
  | TextFilterConfig
  | SelectFilterConfig
  | MultiSelectFilterConfig;

/**
 * Valores de filtros aplicados
 */
export interface FilterValues {
  [key: string]: string | string[];
}

/**
 * Resultado del hook de filtros
 */
export interface UseFiltersResult<T> {
  filteredData: T[];
  filterValues: FilterValues;
  setFilterValue: (filterId: string, value: string | string[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  enrichedConfigs: FilterConfig[]; // Configs con opciones dinámicas generadas
}
