import { ROUTES } from "@/constants/routes.constants";
import { REALMS_WITHOUT_CHARACTERS } from "@/constants/filters.constants";
import type { CodexBookData, CodexEntry, CodexText } from "@/types/codex.types";
import type { MultiLanguageText } from "@/types/common.types";
import type { World } from "@/types/world.types";
import { creatureService } from "./creature.service";
import { itemService } from "./item.service";
import { placeService } from "./place.service";

const MAX_CHARS = 360;
const FALLBACK_TINT = "#C8AA6E";

/** `[Götaland]` → "Götaland"; un `[WIP]` suelto no es un texto: se queda vacío. */
function clean(text: string | undefined): string {
  if (!text) return "";
  const t = text
    .replace(/\[([^\]|]+)(?:\|[^\]]*)?\]/g, (m, inner: string) => (/^wip$/i.test(inner.trim()) ? "" : inner))
    .replace(/\s+/g, " ")
    .trim();
  return t;
}

/** Recorta a lo que cabe en una página, por frase si se puede y, si no, por palabra. */
function excerpt(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  const cut = text.slice(0, MAX_CHARS);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (sentence > MAX_CHARS * 0.55) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

const pair = (m: MultiLanguageText | undefined, f: (s: string) => string = (s) => s): CodexText => ({
  es: f(m?.es ?? m?.en ?? ""),
  en: f(m?.en ?? m?.es ?? ""),
});

const hasArt = (image: string | undefined): image is string =>
  Boolean(image) && !String(image).includes("none.webp");

/** Bestiario y relicario son una selección: las primeras con arte, en el orden de `_Order`. */
const SELECTION = 8;

/** Los tres libros de la home. El atlas es entero; los otros dos, una muestra con enlace al resto. */
export async function getCodexBooks(
  worlds: World[],
  census: Record<string, number>,
): Promise<CodexBookData[]> {
  const [creatures, items, placesByWorld] = await Promise.all([
    creatureService.getAllCreatures(),
    itemService.getAllItems(),
    Promise.all(
      worlds.map((w) =>
        placeService.getByIds((w.places ?? []).filter((id): id is string => typeof id === "string")),
      ),
    ),
  ]);

  const atlas: CodexEntry[] = worlds.map((w, i) => {
    const count = census[w._id] ?? 0;
    return {
      identifier: w.identifier,
      name: pair(w.name),
      meta: { es: "", en: "" },
      text: pair(w.description, (s) => excerpt(clean(s))),
      image: hasArt(w.image) ? w.image : null,
      tint: w.mainColor ?? FALLBACK_TINT,
      rune: w.detailedIcon ?? null,
      href: ROUTES.WORLD_DETAIL(w.identifier),
      characters:
        count > 0 && !REALMS_WITHOUT_CHARACTERS.includes(w.identifier)
          ? { count, href: `${ROUTES.CHARACTERS}?worlds=${w.identifier}` }
          : null,
      places: placesByWorld[i].map((p) => ({
        identifier: p.identifier,
        name: pair(p.name),
        href: ROUTES.PLACE_DETAIL(p.identifier),
      })),
    };
  });

  const plain =
    (href: (id: string) => string) =>
    (e: { identifier: string; name: MultiLanguageText; description: MultiLanguageText; image: string; race?: MultiLanguageText; type?: MultiLanguageText }): CodexEntry => ({
      identifier: e.identifier,
      name: pair(e.name),
      meta: pair(e.race ?? e.type),
      text: pair(e.description, (s) => excerpt(clean(s))),
      image: hasArt(e.image) ? e.image : null,
      tint: FALLBACK_TINT,
      rune: null,
      href: href(e.identifier),
      characters: null,
      places: [],
    });
  const select = <T extends { image: string }>(list: T[]) => list.filter((e) => hasArt(e.image)).slice(0, SELECTION);

  return [
    { kind: "worlds", entries: atlas, total: atlas.length, allHref: ROUTES.WORLDS },
    { kind: "creatures", entries: select(creatures).map(plain(ROUTES.CREATURE_DETAIL)), total: creatures.length, allHref: ROUTES.CREATURES },
    { kind: "items", entries: select(items).map(plain(ROUTES.ITEM_DETAIL)), total: items.length, allHref: ROUTES.ITEMS },
  ];
}
