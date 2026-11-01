import { COLLECTIONS } from "@/constants/database.constants";
import { getDatabase } from "../mongodb";

/** Orden de los mundos pedido por el producto; manda sobre `_Order` hasta que el documento coincida. */
export const WORLD_ORDER = [
  "asgard",
  "alfheim",
  "vanaheim",
  "svartalfheim",
  "midgard",
  "jotunheim",
  "muspelheim",
  "niflheim",
  "helheim",
  "ginnungagap",
] as const;

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; order: string[] }>();

/**
 * Lee los documentos de ordenación (`_Order`: `{ collection, order: [identifier…] }`).
 * Son cuatro documentos casi inmutables: se cachean por proceso.
 */
export async function getOrder(collection: string): Promise<string[]> {
  const hit = cache.get(collection);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.order;

  try {
    const db = await getDatabase();
    const doc = await db
      .collection<{ collection: string; order: string[] }>(COLLECTIONS.ORDER)
      .findOne({ collection });
    const order = Array.isArray(doc?.order) ? doc.order : [];
    cache.set(collection, { at: Date.now(), order });
    return order;
  } catch (error) {
    console.error(`[order.repository.getOrder(${collection})] Error:`, error);
    return hit?.order ?? [];
  }
}
