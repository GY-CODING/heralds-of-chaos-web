import type { FilterParams, FilterValues } from "@/types/filter.types";

/** De `?worlds=vanaheim,asgard` a los valores iniciales de los filtros. */
export function parseFilterParams(
  query: Record<string, string | string[] | undefined>,
  params: FilterParams,
): FilterValues {
  const values: FilterValues = {};
  for (const [id, { param, list }] of Object.entries(params)) {
    const raw = query[param];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) continue;
    values[id] = list ? value.split(",").filter(Boolean) : value;
  }
  return values;
}

/** Y de vuelta: los filtros vacíos no ensucian la URL y las comas se quedan legibles. */
export function serializeFilterParams(values: FilterValues, params: FilterParams, search: string): string {
  const next = new URLSearchParams(search);
  for (const [id, { param }] of Object.entries(params)) {
    const value = values[id];
    const text = Array.isArray(value) ? value.join(",") : value;
    if (text && text !== "all") next.set(param, text);
    else next.delete(param);
  }
  return next.toString().replace(/%2C/g, ",");
}
