"use client";

/**
 * Las caras de los libros: portada, pergamino (izquierda y derecha) y la versión de una sola página
 * para móvil. Todo el texto se dimensiona en `cqw` (unidades del contenedor): la composición es la
 * misma en la estantería y abierto, mida lo que mida la página.
 *
 * Paleta: negro de cuero, oro y hueso de siempre; el pergamino lleva tinta marrón oscura. El color
 * del reino sigue siendo solo luz: la runa y el filete, nunca una superficie.
 */

import { FOIL, Rule, RuneSigil, SealedPlate } from "@/components/ui/scene/scene";
import type { useTranslations } from "@/hooks/use-translations";
import type { CodexBookData, CodexEntry, CodexKind } from "@/types/codex.types";
import Link from "next/link";
import { useState } from "react";

export type Spread =
  | { t: "front"; no: number }
  | { t: "entry"; no: number; entry: CodexEntry; n: number }
  | { t: "end"; no: number };

type Lang = "es" | "en";

export interface PageCtx {
  language: Lang;
  t: ReturnType<typeof useTranslations>;
  interactive: boolean;
  book: CodexBookData;
  goTo: (spread: number) => void;
}

const GOLD_INK = "#7a5a1e";

/** La runa sobre pergamino: sin chapa ni halo. Está dibujada en colores de luz, así que se oscurece como tinta. */
const INK_RUNE = "[&>span]:hidden [&_img]:brightness-[0.5] [&_img]:saturate-[2]";

/* ── Emblemas ─────────────────────────────────────────────────────────────── */

/**
 * Lo que distingue un libro de otro en la estantería, estampado en oro:
 * el atlas lleva el anillo de los nueve mundos; el bestiario, a Jörmungandr mordiéndose
 * la cola; el relicario, a Mjölnir.
 */
export function Emblem({ kind, className = "" }: { kind: CodexKind; className?: string }) {
  const gold = "#D4B97F";
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className} fill="none" stroke={gold} strokeWidth="2">
      {kind === "worlds" && (
        <>
          <circle cx="60" cy="60" r="50" strokeWidth="1.2" opacity="0.6" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
            const x = (60 + Math.cos(a) * 50).toFixed(2);
            const y = (60 + Math.sin(a) * 50).toFixed(2);
            return <rect key={i} x={-4} y={-4} width="8" height="8" fill={gold} stroke="none" transform={`translate(${x} ${y}) rotate(45)`} />;
          })}
        </>
      )}
      {kind === "creatures" && (
        <>
          {/* el cuerpo, con una abertura donde la boca muerde la cola */}
          <path d="M 76 21 A 42 42 0 1 1 52 19" strokeWidth="9" strokeLinecap="round" />
          <path d="M 76 21 A 42 42 0 1 1 52 19" strokeWidth="1.4" stroke="#0d0b09" strokeDasharray="2 7" />
          <path d="M 40 21 L 60 8 L 74 17 L 62 32 Z" fill={gold} stroke="none" />
          <circle cx="60" cy="18" r="2.2" fill="#0d0b09" stroke="none" />
          <path d="M 60 44 L 72 60 L 60 76 L 48 60 Z" strokeWidth="1.4" opacity="0.8" />
          <path d="M 60 53 L 65 60 L 60 67 L 55 60 Z" fill={gold} stroke="none" />
        </>
      )}
      {kind === "items" && (
        <>
          <path d="M 22 24 H 98 L 92 58 H 28 Z" fill={gold} stroke="none" />
          <path d="M 34 33 H 86 M 37 49 H 83" stroke="#0d0b09" strokeWidth="1.6" />
          <path d="M 60 37 L 66 41 L 60 45 L 54 41 Z" fill="#0d0b09" stroke="none" />
          <path d="M 54 58 H 66 L 64 96 H 56 Z" fill={gold} stroke="none" />
          <path d="M 56 68 L 64 72 M 56 76 L 64 80 M 56 84 L 64 88" stroke="#0d0b09" strokeWidth="1.4" />
          <circle cx="60" cy="104" r="6" strokeWidth="2.4" />
        </>
      )}
    </svg>
  );
}

/* ── Portada ──────────────────────────────────────────────────────────────── */

/** Cuero negro con marco, emblema y título en pan de oro. La misma en la estantería y abierto. */
export function CoverFront({ kind, t }: { kind: CodexKind; t: PageCtx["t"] }) {
  return (
    <div className="leather absolute inset-0 overflow-hidden rounded-[6px_12px_12px_6px]" style={{ containerType: "size" }}>
      {/* el marco: dos filetes de oro y los herrajes de las esquinas */}
      <div className="absolute inset-[4.5cqw] rounded-[4px] border border-[rgba(200,170,110,0.55)]" />
      <div className="absolute inset-[6.4cqw] rounded-[3px] border border-[rgba(200,170,110,0.22)]" />
      {["left-[3.4cqw] top-[3.4cqw]", "right-[3.4cqw] top-[3.4cqw]", "left-[3.4cqw] bottom-[3.4cqw]", "right-[3.4cqw] bottom-[3.4cqw]"].map((pos) => (
        <span key={pos} aria-hidden className={`absolute h-[2.6cqw] w-[2.6cqw] rotate-45 ${pos}`} style={{ background: FOIL }} />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-[8cqw] text-center">
        <Emblem kind={kind} className="h-auto w-[50cqw]" />
        <p className="foil display mt-[7cqw] text-[12.5cqw] leading-none">{t.codex.books[kind].title}</p>
        {/* El filete a mano: `Rule` tiene ancho mínimo y aquí la tapa puede medir 110 px. */}
        <div aria-hidden className="mt-[5cqw] flex w-[50cqw] items-center gap-[2.4cqw]">
          <span className="h-px flex-1 bg-[rgba(200,170,110,0.45)]" />
          <span className="h-[2cqw] w-[2cqw] rotate-45 border border-[#C8AA6E]" />
          <span className="h-px flex-1 bg-[rgba(200,170,110,0.45)]" />
        </div>
      </div>

      {/* el lomo: bisagra a la izquierda */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[9cqw]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.25) 40%, transparent), linear-gradient(to right, transparent 55%, rgba(200,170,110,0.16) 72%, transparent 76%)",
        }}
      />
    </div>
  );
}

/** El reverso de la tapa: guarda de cuero con un filete, que queda a la izquierda al abrir. */
export function CoverBack() {
  return (
    <div className="leather absolute inset-0 overflow-hidden rounded-[12px_6px_6px_12px]" style={{ containerType: "size" }}>
      <div className="absolute inset-[4cqw] rounded-[4px] border border-[rgba(200,170,110,0.2)]" />
    </div>
  );
}

/* ── Piezas de pergamino ──────────────────────────────────────────────────── */

export function BlankPage({ side }: { side: "left" | "right" }) {
  return <div aria-hidden className={`paper paper-${side} absolute inset-0 overflow-hidden`} />;
}

function Folio({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="numeral absolute bottom-[3.6cqw] left-1/2 -translate-x-1/2 text-[clamp(11px,3cqw,14px)] text-[var(--ink-2)]"
    >
      — {n} —
    </span>
  );
}

function Corners() {
  const base = "absolute h-[3.4cqw] w-[3.4cqw] border-[var(--ink-gold)]";
  return (
    <>
      <span aria-hidden className={`${base} -left-[0.6cqw] -top-[0.6cqw] border-l border-t`} />
      <span aria-hidden className={`${base} -right-[0.6cqw] -top-[0.6cqw] border-r border-t`} />
      <span aria-hidden className={`${base} -bottom-[0.6cqw] -left-[0.6cqw] border-b border-l`} />
      <span aria-hidden className={`${base} -bottom-[0.6cqw] -right-[0.6cqw] border-b border-r`} />
    </>
  );
}

/** La lámina: el arte enmarcado y, si aún no hay, la entrada sellada con su runa. */
function ArtPlate({ entry, language, className = "" }: { entry: CodexEntry; language: Lang; className?: string }) {
  const name = entry.name[language];
  // Hay láminas que ya no existen en el servidor de imágenes: caen a la entrada sellada.
  // Quien la usa le da `key` por entrada: el fallo de una no se hereda en la página siguiente.
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 border border-[rgba(122,90,30,0.7)] p-[1.6cqw]">
        <div className="relative h-full w-full overflow-hidden bg-[#0B0B10]">
          {entry.image && !failed ? (
            // eslint-disable-next-line @next/next/no-img-element -- el libro precarga las vecinas con la misma URL
            <img
              src={entry.image}
              alt={name}
              loading="eager"
              decoding="async"
              draggable={false}
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <SealedPlate initial={name.charAt(0)} tint={entry.tint} rune={entry.rune ?? undefined} />
          )}
          <div aria-hidden className="absolute inset-0" style={{ boxShadow: "inset 0 0 28px rgba(0,0,0,0.55)" }} />
        </div>
      </div>
      <Corners />
    </div>
  );
}

/** Un enlace de pergamino: el rombo del sitio y el subrayado de tinta. */
function InkLink({ href, children, strong = false }: { href: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-[2cqw] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink-gold)] ${
        strong ? "display text-[clamp(13px,3.7cqw,17px)] text-[var(--ink)] hover:text-[var(--ink-gold)]" : "text-[clamp(12.5px,3.4cqw,15px)] text-[var(--ink-gold)] hover:text-[var(--ink)]"
      }`}
    >
      <span
        aria-hidden
        className="h-[6px] w-[6px] shrink-0 -translate-y-[0.12em] rotate-45 border border-current transition-transform duration-300 ease-pop group-hover:translate-x-1"
      />
      <span className="underline decoration-[rgba(122,90,30,0.5)] underline-offset-4">{children}</span>
    </Link>
  );
}

/* ── Índice ───────────────────────────────────────────────────────────────── */

function Contents({ ctx }: { ctx: PageCtx }) {
  const { t, language, book } = ctx;
  return (
    <>
      <h3 className="display text-[clamp(18px,7cqw,34px)] leading-none">{t.codex.contents}</h3>
      <div className="mt-[3.4cqw] w-[56cqw]">
        <Rule color={GOLD_INK} className="!mx-0" />
      </div>
      <ol className="page-scroll scrollbar-hide mt-[3cqw] min-h-0 flex-1 list-none overflow-y-auto p-0 pb-[6cqw]">
        {book.entries.map((e, i) => (
          <li key={e.identifier}>
            <button
              type="button"
              onClick={() => ctx.goTo(i + 1)}
              className="group flex w-full items-center gap-[2.4cqw] py-[1.5cqw] text-left outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink-gold)]"
            >
              {e.rune && <RuneSigil src={e.rune} color={e.tint} size={28} className={`${INK_RUNE} -translate-y-[0.116em]`} />}
              <span className="display truncate text-[clamp(14px,4.2cqw,20px)] transition-colors duration-300 group-hover:text-[var(--ink-gold)]">
                {e.name[language]}
              </span>
              <span aria-hidden className="min-w-[4cqw] flex-1 translate-y-[0.3em] border-b border-dotted border-[rgba(91,74,51,0.5)]" />
              <span className="numeral text-[clamp(12px,3.3cqw,16px)] text-[var(--ink-2)]">{(i + 1) * 2}</span>
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

function Frontispiece({ ctx }: { ctx: PageCtx }) {
  const { t, book } = ctx;
  const copy = t.codex.books[book.kind];
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="grid h-[44cqw] w-[44cqw] shrink-0 place-items-center rounded-full bg-[#0B0B10] shadow-[inset_0_0_0_1.2cqw_#0B0B10,inset_0_0_0_1.7cqw_rgba(200,170,110,0.75)]">
        <Emblem kind={book.kind} className="h-auto w-[30cqw]" />
      </div>
      <h3 className="display mt-[6cqw] text-[clamp(20px,9cqw,44px)] leading-[1.05]">{copy.title}</h3>
      <div className="mt-[3.4cqw] w-[56cqw]">
        <Rule color={GOLD_INK} />
      </div>
      <p className="mt-[3.4cqw] max-w-[60cqw] text-[clamp(13px,3.8cqw,18px)] italic text-[var(--ink-2)] [text-wrap:balance]">
        {copy.subtitle}
      </p>
    </div>
  );
}

/* ── Las entradas ─────────────────────────────────────────────────────────── */

function EntryHead({ spread, ctx }: { spread: Extract<Spread, { t: "entry" }>; ctx: PageCtx }) {
  const { t, language, book } = ctx;
  const e = spread.entry;
  return (
    <>
      <p className="text-[clamp(10.5px,2.8cqw,13px)] uppercase tracking-[0.2em] text-[var(--ink-2)]">
        {t.codex.books[book.kind].title} · <span className="numeral">{spread.n}</span> / <span className="numeral">{book.entries.length}</span>
      </p>
      <h3 className="display mt-[2.6cqw] flex items-center gap-[2.6cqw] break-words text-[clamp(22px,8.4cqw,44px)] leading-[1.02]">
        {e.rune && <RuneSigil src={e.rune} color={e.tint} size={42} className={`${INK_RUNE} -translate-y-[0.116em]`} />}
        {e.name[language]}
      </h3>
    </>
  );
}

/** Página de un mundo: su descripción, sus lugares y los enlaces a sus personajes. */
function WorldText({ spread, ctx }: { spread: Extract<Spread, { t: "entry" }>; ctx: PageCtx }) {
  const { t, language } = ctx;
  const e = spread.entry;
  return (
    <div className="flex h-full min-h-0 flex-col pb-[8cqw]">
      <EntryHead spread={spread} ctx={ctx} />
      <p className="mt-[2.4cqw] text-[clamp(14.5px,4.4cqw,21px)] italic leading-[1.35] text-[var(--ink-gold)]">{e.text[language]}</p>
      <div className="my-[3cqw] w-[56cqw]">
        <Rule color={GOLD_INK} className="!mx-0" />
      </div>

      <p className="text-[clamp(11px,3cqw,14px)] uppercase tracking-[0.16em] text-[var(--ink-2)]">
        {t.codex.places} · <span className="numeral">{e.places.length}</span>
      </p>
      {e.places.length > 0 ? (
        <ul className="page-scroll scrollbar-hide mt-[1.6cqw] grid min-h-0 flex-1 list-none grid-cols-2 content-start gap-x-[4cqw] overflow-y-auto p-0 pb-[4cqw]">
          {e.places.map((p) => (
            <li key={p.identifier} className="min-w-0">
              <Link
                href={p.href}
                title={p.name[language]}
                className="block truncate py-[0.9cqw] text-[clamp(13px,3.6cqw,17px)] text-[var(--ink)] underline decoration-[rgba(122,90,30,0.35)] underline-offset-4 outline-offset-2 transition-colors duration-300 hover:text-[var(--ink-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink-gold)]"
              >
                {p.name[language]}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-[1.6cqw] min-h-0 flex-1 text-[clamp(13px,3.5cqw,16px)] italic text-[var(--ink-2)]">{t.codex.noPlaces}</p>
      )}

      <div className="mt-[2cqw] flex flex-col items-start gap-[1.8cqw]">
        {e.characters && (
          <InkLink href={e.characters.href} strong>
            {t.codex.seeCharacters} (<span className="numeral">{e.characters.count}</span>)
          </InkLink>
        )}
        <InkLink href={e.href}>{t.codex.enterWorld.replace("{world}", e.name[language])}</InkLink>
      </div>
    </div>
  );
}

/** Página de una bestia o una reliquia. */
function EntryText({ spread, ctx }: { spread: Extract<Spread, { t: "entry" }>; ctx: PageCtx }) {
  const { t, language } = ctx;
  const e = spread.entry;
  const meta = e.meta[language];
  const text = e.text[language];
  return (
    <div className="flex h-full min-h-0 flex-col">
      <EntryHead spread={spread} ctx={ctx} />
      <div className="my-[3.4cqw] w-[56cqw]">
        <Rule color={GOLD_INK} className="!mx-0" />
      </div>
      {meta && <p className="text-[clamp(12px,3.3cqw,15px)] uppercase tracking-[0.14em] text-[var(--ink-2)]">{meta}</p>}
      <div className="page-scroll scrollbar-hide mt-[3.4cqw] min-h-0 flex-1 overflow-y-auto pb-[3cqw]">
        {text ? (
          <p className="dropcap text-[clamp(14px,3.95cqw,20px)] leading-[1.62] text-[var(--ink)]">{text}</p>
        ) : (
          <p className="text-[clamp(13.5px,3.45cqw,17px)] italic leading-[1.6] text-[var(--ink-2)]">{t.codex.unwritten}</p>
        )}
      </div>
      <div className="mt-[2cqw] pb-[8cqw]">
        <InkLink href={e.href}>{t.codex.openEntry}</InkLink>
      </div>
    </div>
  );
}

/** La última página: el libro es una selección y aquí se sale al resto de la colección. */
function EndPage({ ctx }: { ctx: PageCtx }) {
  const { t, book } = ctx;
  const all = t.codex.books[book.kind] as { all?: string };
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h3 className="display text-[clamp(20px,7.4cqw,36px)] leading-[1.08] [text-wrap:balance]">{t.codex.endTitle}</h3>
      <div className="mt-[4cqw] w-[56cqw]">
        <Rule color={GOLD_INK} />
      </div>
      <p className="mt-[4cqw] max-w-[62cqw] text-[clamp(14px,4cqw,19px)] italic leading-[1.5] text-[var(--ink-2)] [text-wrap:balance]">
        {t.codex.endBody.replace("{shown}", String(book.entries.length)).replace("{total}", String(book.total))}
      </p>
      <div className="mt-[6cqw]">
        <InkLink href={book.allHref} strong>
          {(all.all ?? "").replace("{total}", String(book.total))}
        </InkLink>
      </div>
    </div>
  );
}

/* ── Las páginas completas ────────────────────────────────────────────────── */

const SHELL = "paper absolute inset-0 overflow-hidden";

/** Una cara no interactiva (la que va en una hoja que gira) no recibe foco ni clics. */
function guard(interactive: boolean) {
  return interactive ? {} : ({ "aria-hidden": true, inert: true } as const);
}

export function LeftPage({ spread, ctx }: { spread: Spread; ctx: PageCtx }) {
  return (
    <div className={`${SHELL} paper-left`} style={{ containerType: "size" }} {...guard(ctx.interactive)}>
      <div className="relative z-[1] flex h-full flex-col px-[10.5cqw] pb-[11cqw] pl-[8cqw] pt-[9cqw]">
        {spread.t === "front" && <Frontispiece ctx={ctx} />}
        {spread.t === "entry" && <ArtPlate key={spread.entry.identifier} entry={spread.entry} language={ctx.language} className="min-h-0 flex-1" />}
        {spread.t === "end" && (
          <div className="grid h-full place-items-center">
            <Emblem kind={ctx.book.kind} className="h-auto w-[34cqw] opacity-[0.35] [filter:brightness(0.45)]" />
          </div>
        )}
      </div>
      <Folio n={spread.no * 2} />
    </div>
  );
}

function RightBody({ spread, ctx }: { spread: Spread; ctx: PageCtx }) {
  if (spread.t === "front") return <Contents ctx={ctx} />;
  if (spread.t === "end") return <EndPage ctx={ctx} />;
  return ctx.book.kind === "worlds" ? <WorldText spread={spread} ctx={ctx} /> : <EntryText spread={spread} ctx={ctx} />;
}

export function RightPage({ spread, ctx }: { spread: Spread; ctx: PageCtx }) {
  return (
    <div className={`${SHELL} paper-right`} style={{ containerType: "size" }} {...guard(ctx.interactive)}>
      <div className="relative z-[1] flex h-full flex-col px-[8cqw] pb-[3cqw] pl-[10.5cqw] pt-[9cqw]">
        <RightBody spread={spread} ctx={ctx} />
      </div>
      <Folio n={spread.no * 2 + 1} />
    </div>
  );
}

/** Móvil: una sola hoja por entrada, con la lámina arriba y el texto debajo. */
export function CompactPage({ spread, ctx }: { spread: Spread; ctx: PageCtx }) {
  return (
    <div className={`${SHELL} rounded-[6px_12px_12px_6px]`} style={{ containerType: "size" }} {...guard(ctx.interactive)}>
      <div className="relative z-[1] flex h-full flex-col px-[8cqw] pb-[3cqw] pt-[7cqw]">
        {spread.t === "front" && (
          <>
            <div className="h-[52%] shrink-0">
              <Frontispiece ctx={ctx} />
            </div>
            <div className="mt-[3cqw] flex min-h-0 flex-1 flex-col">
              <Contents ctx={ctx} />
            </div>
          </>
        )}
        {spread.t === "entry" && (
          <>
            <ArtPlate key={spread.entry.identifier} entry={spread.entry} language={ctx.language} className="h-[29%] shrink-0" />
            <div className="mt-[4cqw] min-h-0 flex-1">
              <RightBody spread={spread} ctx={ctx} />
            </div>
          </>
        )}
        {spread.t === "end" && <EndPage ctx={ctx} />}
      </div>
    </div>
  );
}
