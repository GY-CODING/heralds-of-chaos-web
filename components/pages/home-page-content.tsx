"use client";

/**
 * Home de Heralds of Chaos: la portada de un juego de rol, no la landing de un producto.
 *
 * Lo que manda en el diseño es un hallazgo de la base de datos: **cada mundo tiene su runa**
 * (`detailedIcon`) **y su color** (`mainColor`). Eso da un sistema propio:
 *
 *   · el códice es negro, hueso y oro — la encuadernación;
 *   · la luz del reino es su color — solo como luz (runa, resplandor, filete), nunca relleno.
 *
 * Cuatro tramos:
 *   1. La puerta  — el sello del árbol con su anillo de runas girando y el nombre debajo,
 *                   compuesto como un logotipo (la palabra larga arriba, el nexo entre filetes
 *                   y la última palabra abajo, más grande).
 *   2. Yggdrasil  — los diez mundos colgando del árbol: la escena se queda fija y el reino
 *                   cambia al bajar, con la runa encendida en su rama. La pantalla con el arte
 *                   de cada reino vive ahora en `/worlds`.
 *   3. El universo — las cuatro colecciones (los mundos ya están arriba), con su número real de
 *                   entradas y una tira de arte de verdad.
 *   4. El cierre  — el Bifröst: un filete con los diez colores de los reinos.
 *
 * Rendimiento: solo se animan transform y opacity; nada de blur animado; la ceniza baja a 6
 * motas en punteros gruesos y `prefers-reduced-motion` apaga sello, aurora, ceniza y entradas.
 */

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { World } from "@/types/world.types";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  Monument,
  NightSky,
  realmInk,
  Rule,
  RuneSigil,
  Seal,
  VOID,
} from "@/components/ui/scene/scene";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export interface CodexSample {
  identifier: string;
  image: string;
}

export interface Counts {
  characters: number;
  creatures: number;
  items: number;
  worlds: number;
  places: number;
}

export interface HomePageContentProps {
  worlds: World[];
  counts: Counts;
  /** Personajes por id de mundo. Sale de la colección, no está escrito a mano. */
  census: Record<string, number>;
  /** Hasta cuatro piezas con arte de cada colección, para las tiras del universo. */
  strips: Record<keyof Counts, CodexSample[]>;
}

/* ── 1. La puerta ─────────────────────────────────────────────────────────── */

function Gate() {
  const t = useTranslations();
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pb-[calc(var(--header-h)+8px)] pt-[calc(var(--header-h)+8px)] text-center"
      style={{ background: VOID, color: "#F0E6D2" }}
    >
      <NightSky />

      <div className="relative z-10 flex w-full flex-col items-center">
        {/* El sello: el árbol dentro de su anillo de runas, girando despacio. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
          className="[--seal:clamp(116px,17svh,186px)]"
        >
          <Seal size="var(--seal)" priority />
        </motion.div>

        <motion.p
          className="mt-7 text-[11px] tracking-[0.26em] text-[var(--gold)] sm:text-xs"
          {...rise(0.1)}
        >
          {t.common.company}
        </motion.p>

        {/* El nombre, compuesto como un logotipo. El tamaño se mide contra el ancho de la
            pantalla y contra su alto, así nunca se sale ni se corta. */}
        <motion.h1
          // El tamaño se mide contra el ancho y contra el alto a la vez. El límite por ancho
            // es el que manda en móvil: con 13,4vw el nombre llegaba casi al borde.
            className="mt-5 w-full [--mon:min(11vw,9.6svh,112px)]"
          {...rise(0.18)}
        >
          <Monument one={t.hero.heralds} joiner={t.hero.joiner} two={t.hero.chaos} />
        </motion.h1>

        <motion.div className="w-full" {...rise(0.3)}>
          <Rule className="mt-9 max-w-[280px]" />
        </motion.div>

        <motion.p
          className="mx-auto mt-8 max-w-[46ch] text-base leading-relaxed text-[#C5BFB2] md:text-xl"
          {...rise(0.38)}
        >
          {t.hero.lead}
        </motion.p>

        {/* Un solo botón, y en oro apagado: el brillo de la portada ya lo pone el nombre. */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-4"
          {...rise(0.46)}
        >
          <Link href={ROUTES.CHARACTERS} className="btn-foil-soft display">
            {t.hero.cta}
          </Link>
          <Link
            href={ROUTES.WORLDS}
            className="group inline-flex items-center gap-2.5 text-[15px] text-[#A09B8C] transition-colors duration-300 hover:text-[var(--gold)]"
          >
            {t.hero.secondary}
            <span
              aria-hidden
              className="h-[6px] w-[6px] rotate-45 border border-current transition-transform duration-300 ease-pop group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      <motion.p
        className="absolute bottom-5 left-0 right-0 z-10 text-[11px] tracking-[0.2em] text-[#6A6A6A]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        {t.home.scroll}
      </motion.p>
    </section>
  );
}

/* ── 2. Yggdrasil: los diez mundos colgando del árbol ─────────────────────── */

/**
 * Ginnungagap está en la base de datos y tiene su runa, su color y sus personajes, pero no es
 * uno de los mundos que cuelgan del árbol: es el vacío anterior a todo. Fuera del árbol y fuera
 * de la cuenta del titular; en `/worlds` y en los filtros sigue estando.
 */
const NOT_A_REALM = ["ginnungagap"];

function Yggdrasil({
  worlds,
  census,
}: {
  worlds: World[];
  census: Record<string, number>;
}) {
  const t = useTranslations();
  const { language } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const marks = useRef<(HTMLElement | null)[]>([]);

  const realms = worlds.filter((w) => !NOT_A_REALM.includes(w.identifier));

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    marks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  if (realms.length === 0) return null;

  const current = realms[Math.min(active, realms.length - 1)];
  const name = (w: World) => w.name[language] ?? w.name.en;
  const description = (w: World) => w.description[language] ?? w.description.en;
  const characters = (w: World) => census[w._id] ?? 0;
  const places = (w: World) => w.places?.length ?? 0;
  const title = t.home.treeTitle.replace("{count}", String(realms.length));

  return (
    // Sin overflow:hidden en la sección: se convertiría en el contenedor de scroll y mataría
    // la escena fijada.
    <section
      aria-labelledby="realms-title"
      className="relative px-5 py-16 md:py-0"
      style={{ background: VOID, color: "#F0E6D2" }}
    >
      {/* Móvil: los reinos, uno detrás de otro, colgando de un tronco encendido. */}
      <div className="relative overflow-hidden md:hidden">
        <NightSky embers={6} />
        <div className="relative z-10">
          <h2 id="realms-title" className="text-center text-3xl leading-tight">
            {title}
          </h2>
          <Rule className="mt-7 max-w-[200px]" />

          <ol className="relative mt-10 list-none p-0 pl-10">
            <div
              aria-hidden
              className="absolute bottom-2 left-[13px] top-2 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(200,170,110,0.35) 12%, rgba(200,170,110,0.35) 88%, transparent)",
              }}
            />
            {realms.map((w, i) => (
              <motion.li
                key={w.identifier}
                className="relative pb-9"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span
                  aria-hidden
                  className="absolute -left-[34px] top-1 grid h-7 w-7 place-items-center rounded-md"
                  style={{ background: VOID }}
                >
                  <RuneSigil src={w.detailedIcon} color={w.mainColor} size={26} lit />
                </span>
                <Link href={ROUTES.WORLD_DETAIL(w.identifier)} className="block">
                  <p className="numeral text-[11px] tracking-[0.28em] text-[#6A6A6A]">{ROMAN[i]}</p>
                  <p
                    className="display mt-1.5 text-2xl leading-none"
                    style={{ color: realmInk(w.mainColor) }}
                  >
                    {name(w)}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#A09B8C]">
                    {description(w)}
                  </p>
                  <p className="mt-3 flex items-center gap-5 text-[13px] text-[#6A6A6A]">
                    <span>
                      <span className="numeral mr-1.5 text-base text-[#F0E6D2]">
                        {characters(w)}
                      </span>
                      {t.home.characters}
                    </span>
                    <span>
                      <span className="numeral mr-1.5 text-base text-[#F0E6D2]">{places(w)}</span>
                      {t.home.places}
                    </span>
                  </p>
                </Link>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Escritorio: el árbol se queda en pantalla y el reino de al lado pasa como una
          diapositiva al bajar. La pista da el recorrido; las marcas de dentro dicen qué
          reino toca. */}
      <div className="relative hidden md:block" style={{ height: `${realms.length * 62}svh` }}>
        <div aria-hidden className="absolute inset-0">
          {realms.map((w, i) => (
            <div
              key={w.identifier}
              data-i={i}
              ref={(el) => {
                marks.current[i] = el;
              }}
              style={{ height: "62svh" }}
            />
          ))}
        </div>

        <div className="sticky top-0 z-10 h-svh overflow-hidden">
          <NightSky embers={8} tint={current.mainColor} />

          <div className="relative z-10 mx-auto grid h-full max-w-[1280px] grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] items-center gap-10 px-8 pt-[var(--header-h)] lg:gap-16 lg:px-12">
            <Tree realms={realms} active={active} />

            <div>
              <p className="display text-[12px] tracking-[0.26em] text-[var(--gold)]">
                {t.home.realmsEyebrow}
              </p>
              <h2 className="mt-4 text-[clamp(26px,2.6vw,42px)] leading-[1.06]">{title}</h2>
              <Rule className="mx-0 mt-7 max-w-[180px]" />

              {/* aria-live: bajo el mismo encabezado, el reino cambia al bajar. */}
              <div aria-live="polite" className="mt-9 min-h-[310px]">
                <motion.div
                  key={current.identifier}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <p className="numeral text-xs tracking-[0.3em] text-[#6A6A6A]">
                    {ROMAN[active]} {String(active + 1).padStart(2, "0")} /{" "}
                    {String(realms.length).padStart(2, "0")}
                  </p>
                  <p
                    className="display mt-3 text-[clamp(30px,2.8vw,46px)] leading-[1.05]"
                    style={{ color: realmInk(current.mainColor) }}
                  >
                    {name(current)}
                  </p>
                  <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[#C5BFB2]">
                    {description(current)}
                  </p>

                  <div className="mt-8 flex items-center gap-10">
                    <p>
                      <span className="numeral block text-3xl leading-none text-[#F0E6D2]">
                        {characters(current)}
                      </span>
                      <span className="mt-1.5 block text-[13px] text-[#8A8578]">
                        {t.home.characters}
                      </span>
                    </p>
                    <div aria-hidden className="h-9 w-px bg-[rgba(200,170,110,0.2)]" />
                    <p>
                      <span className="numeral block text-3xl leading-none text-[#F0E6D2]">
                        {places(current)}
                      </span>
                      <span className="mt-1.5 block text-[13px] text-[#8A8578]">
                        {t.home.places}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={ROUTES.WORLD_DETAIL(current.identifier)}
                    className="display mt-9 inline-flex items-center gap-2.5 text-sm tracking-[0.08em] transition-opacity duration-300 hover:opacity-70"
                    style={{ color: realmInk(current.mainColor) }}
                  >
                    <span
                      aria-hidden
                      className="h-[6px] w-[6px] rotate-45 border"
                      style={{ borderColor: current.mainColor }}
                    />
                    {t.home.enterRealm} {name(current)}
                  </Link>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** El árbol: copa, tronco, raíces y una rama por reino, con su runa en la punta. */
function Tree({ realms, active }: { realms: World[]; active: number }) {
  const gold = "#C8AA6E";
  const dim = "rgba(200,170,110,0.4)";
  const faint = "rgba(200,170,110,0.22)";
  const top = 150;
  const step = 56;
  const bottom = top + (realms.length - 1) * step + 70;
  const current = realms[Math.min(active, realms.length - 1)];

  return (
    <div aria-hidden className="relative grid h-[80svh] place-items-center">
      <svg viewBox={`0 0 300 ${bottom + 120}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        {/* copa */}
        <path d={`M150 ${top - 30} C 76 ${top - 60}, 42 ${top - 104}, 48 ${top - 148}`} fill="none" stroke={faint} strokeWidth="1.2" />
        <path d={`M150 ${top - 30} C 224 ${top - 60}, 258 ${top - 104}, 252 ${top - 148}`} fill="none" stroke={faint} strokeWidth="1.2" />
        <path d={`M150 ${top - 30} C 131 ${top - 78}, 138 ${top - 114}, 150 ${top - 152}`} fill="none" stroke={faint} strokeWidth="1.2" />
        {/* tronco */}
        <line x1="150" y1={top - 30} x2="150" y2={bottom} stroke={dim} strokeWidth="1.4" />
        {/* raíces */}
        <path d={`M150 ${bottom} C 114 ${bottom + 34}, 78 ${bottom + 54}, 38 ${bottom + 64}`} fill="none" stroke={faint} strokeWidth="1.2" />
        <path d={`M150 ${bottom} C 186 ${bottom + 34}, 222 ${bottom + 54}, 262 ${bottom + 64}`} fill="none" stroke={faint} strokeWidth="1.2" />
        <path d={`M150 ${bottom} C 148 ${bottom + 46}, 150 ${bottom + 78}, 150 ${bottom + 116}`} fill="none" stroke={faint} strokeWidth="1.2" />

        {/* una rama por reino, alternando lado */}
        {realms.map((w, i) => {
          const y = top + i * step;
          const left = i % 2 === 0;
          const x = left ? 74 : 226;
          const on = i === active;
          return (
            <g key={w.identifier}>
              <path
                d={`M150 ${y} C ${left ? 126 : 174} ${y}, ${left ? 104 : 196} ${y}, ${x} ${y}`}
                fill="none"
                stroke={on ? w.mainColor : faint}
                strokeWidth={on ? 1.5 : 1.1}
                className="transition-[stroke] duration-700"
              />
              <circle
                cx={x}
                cy={y}
                r={on ? 17 : 0}
                fill="none"
                stroke={w.mainColor}
                strokeWidth="1"
                opacity={on ? 0.45 : 0}
                className="transition-[r,opacity] duration-700"
              />
              <image
                href={w.detailedIcon}
                x={x - (on ? 17 : 11)}
                y={y - (on ? 17 : 11)}
                width={on ? 34 : 22}
                height={on ? 34 : 22}
                opacity={on ? 1 : 0.55}
                className="transition-[opacity] duration-700"
              />
            </g>
          );
        })}

        {/* la luz que baja por el tronco */}
        <g
          style={{
            transform: `translateY(${active * step}px)`,
            transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <circle cx="150" cy={top} r="4.5" fill={current?.mainColor ?? gold} />
          <circle
            cx="150"
            cy={top}
            r="13"
            fill="none"
            stroke={current?.mainColor ?? gold}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
}

/* ── 3. El universo: las cuatro colecciones ───────────────────────────────── */

function Collections({
  counts,
  strips,
}: {
  counts: Counts;
  strips: HomePageContentProps["strips"];
}) {
  const t = useTranslations();
  const reduce = useReducedMotion();

  // Los mundos no están: se recorren enteros justo arriba, en el árbol.
  const rows = [
    { key: "characters" as const, href: ROUTES.CHARACTERS, count: counts.characters, copy: t.sections.characters, unit: t.units.characters },
    { key: "creatures" as const, href: ROUTES.CREATURES, count: counts.creatures, copy: t.sections.creatures, unit: t.units.creatures },
    { key: "items" as const, href: ROUTES.ITEMS, count: counts.items, copy: t.sections.items, unit: t.units.items },
    { key: "places" as const, href: ROUTES.PLACES, count: counts.places, copy: t.sections.places, unit: t.units.places },
  ];

  return (
    <section
      aria-labelledby="collections-title"
      className="relative z-10 bg-[var(--background)] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center">
          <h2 id="collections-title" className="text-4xl leading-none md:text-6xl">
            <span className="foil-adaptive">{t.home.collectionsTitle}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            {t.sections.subtitle}
          </p>
          <Rule className="mt-8 max-w-[200px]" />
        </div>

        <ol className="mt-14 md:mt-20">
          {rows.map((row, i) => (
            <motion.li
              key={row.key}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
              className="border-t border-[var(--border-strong)] last:border-b"
            >
              <Link
                href={row.href}
                className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 py-7 transition-colors duration-500 hover:bg-[var(--surface-hover)] md:grid-cols-[132px_minmax(0,1fr)_auto] md:gap-x-8 md:py-9"
              >
                <span className="block">
                  <span className="numeral foil-adaptive block text-4xl leading-none md:text-[56px]">
                    {row.count}
                  </span>
                  <span className="mt-2 block text-[12px] text-[var(--text-tertiary)]">
                    {row.count === 1 ? row.unit.one : row.unit.many}
                  </span>
                </span>

                <div className="min-w-0">
                  <h3 className="text-2xl leading-none text-[var(--text-primary)] transition-transform duration-500 ease-pop group-hover:translate-x-1.5 md:text-[32px]">
                    {row.copy.title}
                  </h3>
                  <p className="mt-2.5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-base">
                    {row.copy.description}
                  </p>
                </div>

                {/* La tira: arte de verdad de esa colección. Al pasar por encima,
                    cada pieza se desplaza un poco, una detrás de otra. */}
                <div
                  aria-hidden
                  className="col-span-2 flex items-center gap-2 overflow-hidden md:col-span-1 md:w-[316px] md:justify-end"
                >
                  {(strips[row.key] ?? []).map((s, j) => (
                    <span
                      key={s.identifier}
                      className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-[6px] border border-[var(--border)] transition-transform duration-500 ease-pop group-hover:-translate-y-1.5 md:h-[88px] md:w-16"
                      style={{ transitionDelay: `${j * 45}ms` }}
                    >
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                        loading="lazy"
                      />
                    </span>
                  ))}
                </div>
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 4. El cierre ─────────────────────────────────────────────────────────── */

function Closing({ worlds }: { worlds: World[] }) {
  const t = useTranslations();
  const gradientId = useId();
  const stops = worlds.length > 0 ? worlds : [];

  return (
    <section
      className="relative overflow-hidden px-6 pb-24 pt-20 text-center md:pb-32 md:pt-24"
      style={{ background: VOID, color: "#F0E6D2" }}
    >
      <NightSky embers={8} />

      {/* El Bifröst: el puente, hecho con los diez colores reales de los reinos. */}
      <svg
        aria-hidden
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[120px] w-full"
      >
        <defs>
          <linearGradient id={`${gradientId}-bifrost`} x1="0" y1="0" x2="1" y2="0">
            {stops.map((w, i) => (
              <stop
                key={w.identifier}
                offset={`${(i / Math.max(stops.length - 1, 1)) * 100}%`}
                stopColor={w.mainColor}
              />
            ))}
          </linearGradient>
        </defs>
        <path
          d="M -40 118 Q 500 -18 1040 118"
          fill="none"
          stroke={`url(#${gradientId}-bifrost)`}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          opacity="0.75"
        />
        <path
          d="M -40 118 Q 500 -18 1040 118"
          fill="none"
          stroke={`url(#${gradientId}-bifrost)`}
          strokeWidth="14"
          vectorEffect="non-scaling-stroke"
          opacity="0.1"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-[860px] pt-12">
        <h2 className="engraved text-3xl leading-tight sm:text-4xl md:text-6xl">
          {t.home.closingTitle}
        </h2>
        <p className="mx-auto mt-6 max-w-[44ch] text-base leading-relaxed text-[#A09B8C] md:text-lg">
          {t.home.closingLead}
        </p>
        <Link href={ROUTES.CHARACTERS} className="btn-foil display mt-10">
          {t.hero.cta}
        </Link>
      </div>
    </section>
  );
}

/* ── La página ────────────────────────────────────────────────────────────── */

export function HomePageContent({ worlds, counts, census, strips }: HomePageContentProps) {
  return (
    <div className="min-h-screen">
      <Gate />
      <Yggdrasil worlds={worlds} census={census} />
      <Collections counts={counts} strips={strips} />
      <Closing worlds={worlds} />
    </div>
  );
}
