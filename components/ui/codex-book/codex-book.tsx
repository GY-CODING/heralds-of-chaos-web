"use client";

/**
 * Un libro abierto: sale de la estantería volando hasta el centro, abre la tapa con bisagra y sus
 * hojas se pasan de verdad. Al cerrarlo, hace el camino inverso.
 *
 * Todo es CSS 3D + framer-motion (sin Three.js): `perspective` en el escenario y `rotateY` sobre
 * el lomo en cada hoja. El libro está de frente y quieto: lo único que gira son las hojas. Solo se
 * anima `transform` y `opacity`; las sombras de las hojas son degradados.
 *
 * Referencias: `game-feel` (retroalimentación en capas, breve), `game-ui-ux` (pantalla navegable
 * con teclado, foco visible, Esc para volver) y `awesome-design-md/apple` (una sola sombra: la del
 * objeto apoyado en la mesa).
 *
 * Móvil: una sola página por entrada. `prefers-reduced-motion`: sin vuelos ni giros.
 */

import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { CodexBookData } from "@/types/codex.types";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BlankPage, CompactPage, CoverBack, CoverFront, LeftPage, RightPage, type PageCtx, type Spread } from "./codex-pages";

const EASE = [0.5, 0.05, 0.2, 1] as const;
const FLY = { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const };

type Phase = "closed" | "opening" | "open" | "closing";
interface Flip {
  from: number;
  to: number;
  dir: 1 | -1;
  /** Hojas que vuelan: 1 al pasar de una en una; en un salto, unas en blanco y la buena al final. */
  n: number;
}

function build(book: CodexBookData): Spread[] {
  const spreads: Spread[] = [{ t: "front", no: 0 }];
  book.entries.forEach((entry, i) => spreads.push({ t: "entry", no: i + 1, entry, n: i + 1 }));
  if (book.total > book.entries.length) spreads.push({ t: "end", no: spreads.length });
  return spreads;
}

/** Móvil: una página en lugar de dos. */
function useCompact() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

/* ── Una hoja que gira sobre el lomo ──────────────────────────────────────── */

function Leaf({
  origin,
  left,
  from,
  to,
  delay,
  duration,
  z0,
  z1,
  front,
  back,
  frontIncoming = false,
  onDone,
}: {
  origin: "left" | "right";
  left: string;
  from: number;
  to: number;
  delay: number;
  duration: number;
  z0: number;
  z1: number;
  front: ReactNode;
  back: ReactNode;
  /** En la vuelta atrás de móvil la cara delantera es la que llega. */
  frontIncoming?: boolean;
  onDone?: () => void;
}) {
  const shadeDir = origin === "left" ? "to right" : "to left";
  const shade = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `linear-gradient(${shadeDir}, rgba(28,16,4,0), rgba(28,16,4,0.62))`,
  } as const;
  const t = { duration, delay, ease: "easeInOut" as const };

  return (
    <motion.div
      className="absolute top-0"
      style={{ left, width: "var(--pw)", height: "100%", transformOrigin: `${origin} center`, transformStyle: "preserve-3d" }}
      initial={{ rotateY: from, z: z0 }}
      animate={{ rotateY: to, z: [z0, 26, z1] }}
      transition={{ rotateY: { duration, delay, ease: EASE }, z: { ...t, times: [0, 0.5, 1] } }}
      onAnimationComplete={onDone}
    >
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        {front}
        <motion.div aria-hidden style={shade} initial={{ opacity: frontIncoming ? 1 : 0 }} animate={{ opacity: frontIncoming ? 0 : 1 }} transition={t} />
      </div>
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        {back}
        <motion.div aria-hidden style={shade} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={t} />
      </div>
    </motion.div>
  );
}

/* ── El libro ─────────────────────────────────────────────────────────────── */

export function CodexBook({
  book,
  from,
  onClosed,
}: {
  book: CodexBookData;
  /** Dónde estaba en la estantería: de ahí sale volando y ahí vuelve. */
  from: DOMRect;
  onClosed: () => void;
}) {
  const t = useTranslations();
  const { language } = useLanguage();
  const reduce = useReducedMotion();
  const compact = useCompact();

  const spreads = useMemo(() => build(book), [book]);
  const last = spreads.length - 1;

  const [phase, setPhase] = useState<Phase>("closed");
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const open = phase === "open";

  /* ── El vuelo desde la estantería ── */

  const coverRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const home = useRef({ x: 0, y: 0, scale: 1 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useLayoutEffect(() => {
    const r = coverRef.current?.getBoundingClientRect();
    if (!r || reduce) return;
    const s = from.width / r.width;
    home.current = {
      x: from.left + from.width / 2 - (r.left + r.width / 2),
      y: from.top + from.height / 2 - (r.top + r.height / 2),
      scale: s,
    };
    x.set(home.current.x);
    y.set(home.current.y);
    scale.set(s);
    animate(x, 0, FLY);
    animate(y, 0, FLY);
    animate(scale, 1, FLY);
  }, [from, reduce, x, y, scale]);

  useEffect(() => {
    const id = window.setTimeout(() => setPhase(reduce ? "open" : "opening"), reduce ? 0 : 320);
    return () => window.clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  const flyHome = useCallback(() => {
    if (reduce) {
      onClosed();
      return;
    }
    animate(x, home.current.x, FLY);
    animate(y, home.current.y, FLY);
    animate(scale, home.current.scale, { ...FLY, onComplete: onClosed });
  }, [reduce, onClosed, x, y, scale]);

  const close = useCallback(() => {
    if (phase !== "open") return;
    setFlip(null);
    if (reduce) onClosed();
    else setPhase("closing");
  }, [phase, reduce, onClosed]);

  /* ── Navegación ── */

  const goTo = useCallback(
    (to: number) => {
      if (phase !== "open" || flip) return;
      const target = Math.max(0, Math.min(last, to));
      if (target === index) return;
      if (reduce) {
        setIndex(target);
        return;
      }
      const dist = Math.abs(target - index);
      const n = compact || dist === 1 ? 1 : Math.min(3, 1 + dist);
      setFlip({ from: index, to: target, dir: target > index ? 1 : -1, n });
    },
    [phase, flip, last, index, reduce, compact],
  );

  const commit = useCallback(() => {
    setFlip((f) => {
      if (f) setIndex(f.to);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(last);
      else if (e.key === "Escape") close();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goTo, close, index, last]);

  /* Precarga de las láminas vecinas: la hoja que llega ya trae su arte. */
  useEffect(() => {
    for (const i of [index - 1, index + 1, index + 2, flip?.to ?? -1]) {
      const s = spreads[i];
      if (s?.t === "entry" && s.entry.image) {
        const img = new window.Image();
        img.src = s.entry.image;
      }
    }
  }, [index, flip, spreads]);

  /* ── Escena ── */

  const base = { language, t, book, goTo };
  const live: PageCtx = { ...base, interactive: open && !flip };
  const face: PageCtx = { ...base, interactive: false };

  const copy = t.codex.books[book.kind];
  const current = spreads[index];
  const counter =
    current.t === "entry" ? `${copy.title} · ${current.n} / ${book.entries.length}` : copy.title;

  const pages = compact ? 1 : 2;
  const shift = phase === "closed" || phase === "closing" ? (compact ? "0%" : "-25%") : "0%";
  const coverOpen = phase === "opening" || phase === "open";

  // Base: lo que se ve debajo de las hojas que vuelan.
  const baseLeft = flip ? spreads[flip.dir === 1 ? flip.from : flip.to] : current;
  const baseRight = flip ? spreads[flip.dir === 1 ? flip.to : flip.from] : current;

  const dur = flip ? (flip.n === 1 ? 0.95 : 0.78) : 0.95;
  const leaves = flip
    ? Array.from({ length: flip.n }, (_, k) => {
        const fwd = flip.dir === 1;
        const first = k === 0;
        const final = k === flip.n - 1;
        const z0 = (flip.n - k) * 0.6 + 0.4;
        const z1 = k * 0.6 + 0.4;
        const delay = k * 0.085;
        const done = final ? commit : undefined;

        if (compact) {
          // Una sola página: la hoja sale sobre el lomo (adelante) o llega desde él (atrás).
          return fwd ? (
            <Leaf key={k} origin="left" left="0px" from={0} to={-180} delay={delay} duration={dur} z0={z0} z1={z1}
              front={first ? <CompactPage spread={spreads[flip.from]} ctx={face} /> : <BlankPage side="right" />}
              back={<BlankPage side="left" />} onDone={done} />
          ) : (
            <Leaf key={k} origin="left" left="0px" from={-180} to={0} delay={delay} duration={dur} z0={z1} z1={z0} frontIncoming
              front={final ? <CompactPage spread={spreads[flip.to]} ctx={face} /> : <BlankPage side="right" />}
              back={<BlankPage side="left" />} onDone={done} />
          );
        }
        return fwd ? (
          <Leaf key={k} origin="left" left="var(--pw)" from={0} to={-180} delay={delay} duration={dur} z0={z0} z1={z1}
            front={first ? <RightPage spread={spreads[flip.from]} ctx={face} /> : <BlankPage side="right" />}
            back={final ? <LeftPage spread={spreads[flip.to]} ctx={face} /> : <BlankPage side="left" />} onDone={done} />
        ) : (
          <Leaf key={k} origin="right" left="0px" from={0} to={180} delay={delay} duration={dur} z0={z0} z1={z1}
            front={first ? <LeftPage spread={spreads[flip.from]} ctx={face} /> : <BlankPage side="left" />}
            back={final ? <RightPage spread={spreads[flip.to]} ctx={face} /> : <BlankPage side="right" />} onDone={done} />
        );
      })
    : null;

  const control =
    "grid h-11 w-11 place-items-center rounded-lg border border-[var(--border-strong)] text-[#F0E6D2] transition-colors duration-300 hover:border-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] disabled:opacity-35 disabled:hover:border-[var(--border-strong)]";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" role="group" aria-label={copy.title}>
      <p aria-live="polite" className="sr-only">
        {open ? (current.t === "entry" ? `${current.entry.name[language]}. ${counter}` : counter) : ""}
      </p>

      <div style={{ perspective: 2400 }} className="grid w-full place-items-center">
        <motion.div style={{ x, y, scale, transformStyle: "preserve-3d" }}>
          <motion.div
            className="relative"
            style={{ width: `calc(var(--pw) * ${pages})`, height: "var(--ph)", transformStyle: "preserve-3d" }}
            initial={false}
            animate={{ x: shift }}
            transition={{ duration: reduce ? 0 : 1.05, ease: EASE }}
          >
            {/* La única sombra del libro: la que cae sobre la mesa. */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 transition-[width] duration-700"
              style={{
                bottom: "-6%",
                width: coverOpen ? "108%" : "54%",
                height: "12%",
                background: "radial-gradient(closest-side, rgba(0,0,0,0.78), transparent)",
              }}
            />

            {/* Tapas y canto: el grosor del libro. */}
            <div
              aria-hidden
              className="leather absolute rounded-[6px_12px_12px_6px] border border-[rgba(200,170,110,0.25)]"
              style={{
                left: compact ? "-6px" : "calc(var(--pw) - 4px)",
                top: "-8px",
                width: compact ? "calc(var(--pw) + 14px)" : "calc(var(--pw) + 12px)",
                height: "calc(100% + 16px)",
              }}
            />
            {!compact && open && (
              <div
                aria-hidden
                className="leather absolute rounded-[12px_6px_6px_12px] border border-[rgba(200,170,110,0.25)]"
                style={{ left: "-8px", top: "-8px", width: "calc(var(--pw) + 12px)", height: "calc(100% + 16px)" }}
              />
            )}
            <div
              aria-hidden
              className="absolute"
              style={{
                left: compact ? "calc(var(--pw) - 2px)" : "calc(var(--pw) * 2 - 2px)",
                top: "1.5%",
                width: "9px",
                height: "97%",
                background: "repeating-linear-gradient(to bottom, #d8caa6 0 1px, #a8976c 1px 2px)",
                borderRadius: "0 3px 3px 0",
              }}
            />

            {/* Las páginas de debajo. */}
            <div className="absolute inset-0" style={{ pointerEvents: open && !flip ? "auto" : "none" }}>
              {compact ? (
                <motion.div
                  className="absolute left-0 top-0 h-full w-[var(--pw)]"
                  style={{ touchAction: "pan-y" }}
                  onPanEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                      goTo(index + (info.offset.x < 0 ? 1 : -1));
                    }
                  }}
                >
                  <CompactPage spread={flip ? spreads[flip.dir === 1 ? flip.to : flip.from] : current} ctx={flip ? face : live} />
                </motion.div>
              ) : (
                <>
                  <div className="absolute left-0 top-0 h-full w-[var(--pw)]" style={{ visibility: open ? "visible" : "hidden" }}>
                    <LeftPage spread={baseLeft} ctx={flip ? face : live} />
                  </div>
                  <div className="absolute left-[var(--pw)] top-0 h-full w-[var(--pw)]">
                    <RightPage spread={baseRight} ctx={flip ? face : live} />
                  </div>
                </>
              )}
            </div>

            {leaves}

            {/* La tapa: bisagra sobre el lomo. */}
            <motion.div
              ref={coverRef}
              className="absolute top-0"
              style={{
                left: compact ? 0 : "var(--pw)",
                width: "var(--pw)",
                height: "100%",
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                visibility: open ? "hidden" : "visible",
              }}
              initial={false}
              animate={{ rotateY: coverOpen ? -180 : 0, z: 3 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
              onAnimationComplete={() => {
                if (phase === "opening") setPhase("open");
                else if (phase === "closing") {
                  setPhase("closed");
                  flyHome();
                }
              }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                <CoverFront kind={book.kind} t={t} />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <CoverBack />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mandos: la misma navegación que el teclado, para ratón y táctil. */}
      <motion.div
        className="mt-5 flex h-12 items-center justify-center gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <button type="button" onClick={() => goTo(0)} disabled={!open || index === 0 || !!flip} aria-label={t.codex.contents} title={t.codex.contents} className={control}>
          <List aria-hidden className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => goTo(index - 1)} disabled={!open || index === 0 || !!flip} aria-label={t.codex.prev} className={control}>
          <ChevronLeft aria-hidden className="h-5 w-5" />
        </button>
        <p aria-hidden className="numeral min-w-[8.5rem] truncate text-center text-[13px] text-[#A09B8C] sm:min-w-[11rem]">
          {counter}
        </p>
        <button type="button" onClick={() => goTo(index + 1)} disabled={!open || index === last || !!flip} aria-label={t.codex.next} className={control}>
          <ChevronRight aria-hidden className="h-5 w-5" />
        </button>
        <button ref={closeRef} type="button" onClick={close} disabled={!open} aria-label={t.codex.close} title={t.codex.close} className={control}>
          <X aria-hidden className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
}
