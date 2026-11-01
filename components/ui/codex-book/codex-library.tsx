"use client";

/**
 * La estantería de la home: tres libros cerrados, de frente. Al pasar por encima la tapa se
 * entreabre y deja ver el pergamino; al pulsar, el libro sale de la fila, se coloca en el centro y
 * se abre ahí mismo, sin cambiar de página.
 */

import { useTranslations } from "@/hooks/use-translations";
import type { CodexBookData, CodexKind } from "@/types/codex.types";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CodexBook } from "./codex-book";
import { CoverFront } from "./codex-pages";

export function CodexLibrary({ books }: { books: CodexBookData[] }) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const buttons = useRef<Partial<Record<CodexKind, HTMLButtonElement | null>>>({});
  const [opened, setOpened] = useState<{ book: CodexBookData; from: DOMRect } | null>(null);

  const openBook = (book: CodexBookData, button: HTMLButtonElement) => {
    const cover = button.querySelector("[data-cover]");
    if (!cover) return;
    setOpened({ book, from: cover.getBoundingClientRect() });
  };

  // Tras pintar: el escenario crece al abrir y hay que centrar ya con su altura final.
  const isOpen = Boolean(opened);
  useEffect(() => {
    if (isOpen) stage.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [isOpen, reduce]);

  const closed = () => {
    const kind = opened?.book.kind;
    setOpened(null);
    if (kind) buttons.current[kind]?.focus({ preventScroll: true });
  };

  return (
    <div
      ref={stage}
      className="codex-stage relative mx-auto grid w-full items-start justify-items-center"
      // Crece solo al abrir y hacia abajo: la fila no se mueve y el libro sabe volver a su sitio.
      style={opened ? { minHeight: "calc(var(--ph) + 96px)" } : undefined}
    >
      <ul
        className="grid w-full max-w-[1040px] list-none grid-cols-3 gap-3 p-0 transition-opacity duration-500 sm:gap-6 md:gap-12"
        style={{ opacity: opened ? 0 : 1, pointerEvents: opened ? "none" : "auto" }}
        inert={opened ? true : undefined}
      >
        {books.map((book) => {
          const copy = t.codex.books[book.kind];
          return (
            <li key={book.kind}>
              <button
                ref={(el) => {
                  buttons.current[book.kind] = el;
                }}
                type="button"
                onClick={(e) => openBook(book, e.currentTarget)}
                aria-label={t.codex.open.replace("{book}", copy.title)}
                className="group block w-full rounded-lg text-center outline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
                // Esconde solo el libro que vuela: los demás se funden con la fila.
                style={{ visibility: opened?.book.kind === book.kind ? "hidden" : undefined }}
              >
                <span
                  className="relative block aspect-[0.74] w-full transition-transform duration-500 ease-pop group-hover:-translate-y-2 motion-reduce:transition-none"
                  style={{ perspective: 1400 }}
                >
                  {/* la sombra sobre la mesa */}
                  <span
                    aria-hidden
                    className="absolute -bottom-[7%] left-[4%] h-[12%] w-[92%]"
                    style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.8), transparent)" }}
                  />
                  {/* tapa trasera y canto de las páginas */}
                  <span aria-hidden className="leather absolute -bottom-[1.2%] -right-[1.6%] -top-[1.2%] left-0 rounded-[6px_12px_12px_6px] border border-[rgba(200,170,110,0.25)]" />
                  <span
                    aria-hidden
                    className="absolute inset-y-[1%] left-[1%] right-0 rounded-r-[10px]"
                    style={{ background: "repeating-linear-gradient(to bottom, #d8caa6 0 1px, #a8976c 1px 2px)" }}
                  />
                  <span aria-hidden className="paper absolute inset-y-[1%] left-[1%] right-[0.8%] rounded-r-[10px]" />
                  {/* la tapa: se entreabre sobre el lomo */}
                  <span
                    data-cover
                    className="absolute inset-0 block origin-left transition-transform duration-500 ease-pop group-hover:[transform:rotateY(-20deg)] group-focus-visible:[transform:rotateY(-20deg)] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                  >
                    <CoverFront kind={book.kind} t={t} />
                  </span>
                </span>
                <span className="mt-5 hidden text-[15px] leading-snug text-[#A09B8C] sm:block md:mt-8 md:text-base [text-wrap:balance]">
                  {copy.subtitle}
                </span>
                <span className="numeral mt-3 block text-[12px] text-[#8A8578] sm:mt-1.5 sm:text-[13px]">
                  {book.total} {copy.unit}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {opened && <CodexBook key={opened.book.kind} book={opened.book} from={opened.from} onClosed={closed} />}
    </div>
  );
}
