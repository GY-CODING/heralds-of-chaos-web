/**
 * Ordena según una lista de `_Order` (identifiers). Los que no están en la lista van detrás,
 * por nombre: `_Order` no cubre toda la colección (objetos, lugares…).
 */
export function sortByOrder<T extends { identifier: string; name?: { en?: string } }>(
  items: T[],
  order: readonly string[],
): T[] {
  // La primera aparición manda: si `order` repite un identifier, no se pisa su posición.
  const rank = new Map<string, number>();
  order.forEach((id, i) => {
    if (!rank.has(id)) rank.set(id, i);
  });
  return [...items].sort((a, b) => {
    const ra = rank.get(a.identifier) ?? Number.POSITIVE_INFINITY;
    const rb = rank.get(b.identifier) ?? Number.POSITIVE_INFINITY;
    if (ra !== rb) return ra - rb;
    return (a.name?.en ?? a.identifier).localeCompare(b.name?.en ?? b.identifier);
  });
}
