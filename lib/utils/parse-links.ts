/**
 * Enlaces entre entradas dentro de una descripción: `El rey de [Götaland] hizo…`.
 *
 * Es una función pura (sin dependencias del proyecto) para poder probarla suelta. Lo que no se
 * resuelve —`[WIP]`, un nombre que no existe— se queda tal cual, con sus corchetes: nunca hay
 * un enlace roto ni se pierde lo que el autor escribió.
 */

export type LinkKind = "character" | "creature" | "item" | "place" | "world";

export interface LinkTarget {
  readonly kind: LinkKind;
  readonly identifier: string;
  readonly href: string;
}

export type Segment =
  | { readonly t: "text"; readonly v: string }
  | { readonly t: "link"; readonly v: string; readonly href: string; readonly kind: LinkKind; readonly identifier: string };

/** Sin acentos ni mayúsculas ni espacios de más: "gotaland" casa con "Götaland". */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** `[Nombre|lugar]`: sufijo opcional para desambiguar un nombre repetido entre colecciones. */
const KIND_ALIASES: Record<string, LinkKind> = {
  character: "character", personaje: "character", charakter: "character",
  creature: "creature", criatura: "creature", kreatur: "creature",
  item: "item", objeto: "item", gegenstand: "item",
  place: "place", lugar: "place", ort: "place",
  world: "world", mundo: "world", welt: "world",
};

/** Si un nombre existe en varias colecciones y no hay sufijo, gana la primera de esta lista. */
export const KIND_PRIORITY: readonly LinkKind[] = ["place", "world", "character", "creature", "item"];

export type Resolver = (name: string, kind?: LinkKind) => LinkTarget | null;

export function parseLinks(text: string, resolve: Resolver): Segment[] {
  const out: Segment[] = [];
  const re = /\[([^\[\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;

  const pushText = (v: string) => {
    if (!v) return;
    const prev = out[out.length - 1];
    if (prev?.t === "text") out[out.length - 1] = { t: "text", v: prev.v + v };
    else out.push({ t: "text", v });
  };

  while ((m = re.exec(text))) {
    const [raw, inner] = m;
    const [namePart, kindPart] = inner.split("|").map((s) => s.trim());
    const kind = kindPart ? KIND_ALIASES[fold(kindPart)] : undefined;
    const target = namePart ? resolve(namePart, kind) : null;

    pushText(text.slice(last, m.index));
    if (target) out.push({ t: "link", v: namePart, href: target.href, kind: target.kind, identifier: target.identifier });
    else pushText(raw);
    last = m.index + raw.length;
  }
  pushText(text.slice(last));
  return out;
}
