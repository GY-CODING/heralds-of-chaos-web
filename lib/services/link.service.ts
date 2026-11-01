import { ROUTES } from "@/constants/routes.constants";
import { COLLECTIONS } from "@/constants/database.constants";
import type { MultiLanguageText } from "@/types/common.types";
import {
  fold,
  KIND_PRIORITY,
  parseLinks,
  type LinkKind,
  type LinkTarget,
  type Segment,
} from "@/lib/utils/parse-links";
import { getDatabase } from "../database/mongodb";

/** Una entrada a la que apunta alguna descripción: lo que se enseña bajo «Relacionados». */
export interface RelatedLink {
  readonly kind: LinkKind;
  readonly identifier: string;
  readonly href: string;
  readonly name: MultiLanguageText;
}

/** Descripción ya troceada, una vez por idioma, y las entradas a las que apunta. */
export interface LinkedDescription {
  readonly segments: Record<"es" | "en" | "de", Segment[]>;
  readonly related: RelatedLink[];
}

interface IndexEntry extends LinkTarget {
  readonly name: MultiLanguageText;
}

const SOURCES: ReadonlyArray<{ collection: string; kind: LinkKind; href: (id: string) => string }> = [
  { collection: COLLECTIONS.PLACES, kind: "place", href: ROUTES.PLACE_DETAIL },
  { collection: COLLECTIONS.WORLDS, kind: "world", href: ROUTES.WORLD_DETAIL },
  { collection: COLLECTIONS.CHARACTERS, kind: "character", href: ROUTES.CHARACTER_DETAIL },
  { collection: COLLECTIONS.CREATURES, kind: "creature", href: ROUTES.CREATURE_DETAIL },
  { collection: COLLECTIONS.ITEMS, kind: "item", href: ROUTES.ITEM_DETAIL },
];

const TTL_MS = 10 * 60 * 1000;
let cache: { at: number; byName: Map<string, IndexEntry[]> } | null = null;

/** Índice `nombre sin acentos → entradas` de las cinco colecciones (≈ 600 nombres, en memoria). */
async function getIndex(): Promise<Map<string, IndexEntry[]>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.byName;

  const byName = new Map<string, IndexEntry[]>();
  try {
    const db = await getDatabase();
    const lists = await Promise.all(
      SOURCES.map((s) =>
        db.collection(s.collection).find({}, { projection: { identifier: 1, name: 1 } }).toArray(),
      ),
    );
    lists.forEach((docs, i) => {
      const { kind, href } = SOURCES[i];
      for (const doc of docs) {
        const name = doc.name as MultiLanguageText | undefined;
        if (!name || !doc.identifier) continue;
        const entry: IndexEntry = { kind, identifier: doc.identifier, href: href(doc.identifier), name };
        for (const label of new Set([name.es, name.en, name.de].filter(Boolean).map((n) => fold(n as string)))) {
          const list = byName.get(label) ?? [];
          list.push(entry);
          byName.set(label, list);
        }
      }
    });
    cache = { at: Date.now(), byName };
  } catch (error) {
    console.error("[LinkService.getIndex] Error:", error);
    return cache?.byName ?? byName;
  }
  return byName;
}

/**
 * Convierte `[Nombre]` de una descripción en enlaces a su ficha, en los tres idiomas, y reúne
 * las entradas enlazadas (sin repetir y sin la propia ficha) para la sección «Relacionados».
 */
export async function linkDescription(
  description: MultiLanguageText,
  self?: { kind: LinkKind; identifier: string },
): Promise<LinkedDescription> {
  const empty: LinkedDescription = {
    segments: {
      es: [{ t: "text", v: description.es ?? "" }],
      en: [{ t: "text", v: description.en ?? "" }],
      de: [{ t: "text", v: description.de ?? description.en ?? "" }],
    },
    related: [],
  };
  const texts = [description.es, description.en, description.de ?? description.en];
  if (!texts.some((t) => t && t.includes("["))) return empty;

  const index = await getIndex();
  const found = new Map<string, IndexEntry>();

  const resolve = (name: string, kind?: LinkKind): LinkTarget | null => {
    const candidates = index.get(fold(name));
    if (!candidates?.length) return null;
    const pool = kind ? candidates.filter((c) => c.kind === kind) : candidates;
    const entry = [...pool].sort(
      (a, b) => KIND_PRIORITY.indexOf(a.kind) - KIND_PRIORITY.indexOf(b.kind),
    )[0];
    if (!entry) return null;
    if (self && entry.kind === self.kind && entry.identifier === self.identifier) return null;
    found.set(`${entry.kind}:${entry.identifier}`, entry);
    return entry;
  };

  return {
    segments: {
      es: parseLinks(description.es ?? "", resolve),
      en: parseLinks(description.en ?? "", resolve),
      de: parseLinks(description.de ?? description.en ?? "", resolve),
    },
    related: [...found.values()].map(({ kind, identifier, href, name }) => ({ kind, identifier, href, name })),
  };
}
