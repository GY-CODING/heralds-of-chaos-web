/** Los tres libros de la estantería de la home. */
export type CodexKind = "worlds" | "creatures" | "items";

export interface CodexText {
  readonly es: string;
  readonly en: string;
}

export interface CodexPlaceLink {
  readonly identifier: string;
  readonly name: CodexText;
  readonly href: string;
}

/** Una entrada ya aligerada para viajar al cliente: el texto va recortado a lo que cabe en una página. */
export interface CodexEntry {
  readonly identifier: string;
  readonly name: CodexText;
  /** La raza o el tipo, ya legibles; vacío en los mundos. */
  readonly meta: CodexText;
  readonly text: CodexText;
  /** `null` cuando aún no tiene ilustración (se pinta la lámina sellada). */
  readonly image: string | null;
  /** La luz del reino, solo como acento. */
  readonly tint: string;
  readonly rune: string | null;
  readonly href: string;
  /** Solo en el atlas: enlace a sus personajes (`null` si el reino no tiene). */
  readonly characters: { readonly count: number; readonly href: string } | null;
  /** Solo en el atlas. */
  readonly places: readonly CodexPlaceLink[];
}

export interface CodexBookData {
  readonly kind: CodexKind;
  readonly entries: readonly CodexEntry[];
  /** Cuántas hay en la colección: el libro es una selección y su última página lleva al resto. */
  readonly total: number;
  readonly allHref: string;
}
