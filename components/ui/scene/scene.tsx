"use client";

/**
 * El vocabulario visual que comparten todas las páginas: el cielo, el sello del árbol, el
 * ornamento, el monumento del nombre, las runas de los reinos y la chapa de "entrada sellada".
 *
 * Dos sistemas de color (ver globals.css): el códice es negro, hueso y oro; la luz del reino es
 * el `mainColor` de la base de datos y solo se usa como luz (runa, resplandor, filete), nunca
 * como relleno.
 *
 * Todo se mueve con transform y opacity; `prefers-reduced-motion` apaga los bucles.
 */

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/** Relleno de pan de oro para lo que no es texto. Para texto, `.foil` o `.foil-adaptive`. */
export const FOIL =
  "linear-gradient(104deg, #785A28 0%, #C8AA6E 22%, #F0E6D2 38%, #C8AA6E 54%, #EADFC4 68%, #9D7F44 88%, #785A28 100%)";

/** El negro de los tramos de portada. */
export const VOID = "#06060A";

/** Determinista: el servidor y el cliente pintan el mismo cielo (si no, falla la hidratación). */
function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

/** Convierte `#rrggbb` en `r, g, b` para poder darle alfa. */
export function rgbOf(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "200, 170, 110";
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/**
 * El color del reino, levantado hacia el hueso.
 *
 * Los `mainColor` de la base de datos son colores de luz (#972FE2, #2FE29A…): como runa o como
 * filete sobre negro van sobradísimos, pero puestos en un titular de 72px se quedan en 2,5:1.
 * Mezclarlos con el hueso sube la luminosidad sin perder el tono, y así el nombre del reino se
 * lee siempre. Se hace en JS y no con `color-mix` para que el servidor y el cliente pinten
 * exactamente el mismo valor.
 */
export function realmInk(hex: string, toward = 0.45): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#F0E6D2";
  const n = parseInt(m[1], 16);
  const mix = (c: number, t: number) => Math.round(c * (1 - toward) + t * toward);
  const r = mix((n >> 16) & 255, 245);
  const g = mix((n >> 8) & 255, 239);
  const b = mix(n & 255, 224);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ── El cielo ─────────────────────────────────────────────────────────────── */

export function NightSky({
  embers = 14,
  tint,
  stars = 80,
}: {
  embers?: number;
  /** Color del reino: tiñe la aurora. Por defecto, oro. */
  tint?: string;
  stars?: number;
}) {
  const r = seeded(7);
  const sky = Array.from({ length: stars }, () => ({
    x: r() * 100,
    y: r() * 100,
    s: 0.35 + r() * 0.85,
    o: 0.12 + r() * 0.5,
  }));
  const r2 = seeded(31);
  const ash = Array.from({ length: embers }, (_, i) => ({
    x: r2() * 100,
    duration: 17 + r2() * 18,
    delay: -r2() * 30,
    size: 1 + r2() * 1.6,
    i,
  }));
  const glow = tint ? rgbOf(tint) : "200, 170, 110";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora: dos velos de degradado, movidos solo con transform. */}
      <div
        className="animate-aurora absolute -inset-x-[10%] -top-[20%] h-[85%] transition-opacity duration-700"
        style={{
          background: `radial-gradient(58% 48% at 46% 12%, rgba(196,214,232,0.10) 0%, transparent 72%), radial-gradient(44% 38% at 64% 4%, rgba(${glow},0.16) 0%, transparent 70%)`,
        }}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {sky.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s * 0.055} fill="#F0E6D2" opacity={s.o} />
        ))}
      </svg>

      {/* Ceniza subiendo del suelo. En puntero grueso solo quedan las seis primeras. */}
      {ash.map((a) => (
        <span
          key={a.i}
          className={`animate-ember absolute bottom-0 rounded-full ${a.i >= 6 ? "hidden sm:block" : ""}`}
          style={
            {
              left: `${a.x}%`,
              width: a.size,
              height: a.size,
              background: tint ?? "#C8AA6E",
              "--ember-duration": `${a.duration}s`,
              "--ember-delay": `${a.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#06060A] to-transparent" />
    </div>
  );
}

/* ── El sello del árbol ───────────────────────────────────────────────────── */

/**
 * El árbol dentro de un anillo de marcas que gira. `size` admite número o medida CSS
 * (`clamp(...)`, `var(--seal)`…): el árbol de dentro se escala en porcentaje, no en píxeles.
 */
export function Seal({
  size = 170,
  priority = false,
}: {
  size?: number | string;
  priority?: boolean;
}) {
  const ticks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div aria-hidden className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="absolute -inset-[40%]"
        style={{ background: "radial-gradient(circle, rgba(200,170,110,0.22) 0%, transparent 65%)" }}
      />
      <svg viewBox="0 0 200 200" className="animate-seal absolute inset-0 h-full w-full">
        <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(200,170,110,0.34)" strokeWidth="1" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(200,170,110,0.16)" strokeWidth="1" />
        {/* Marcas tipo runa dibujadas a trazo. Redondeadas porque si no el último decimal
            difiere entre servidor y cliente y React avisa de desajuste de hidratación. */}
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          const x = (100 + Math.cos(a) * 86).toFixed(3);
          const y = (100 + Math.sin(a) * 86).toFixed(3);
          const deg = (i / ticks.length) * 360;
          const long = i % 3 === 0;
          return (
            <g
              key={i}
              transform={`translate(${x} ${y}) rotate(${deg + 90})`}
              stroke={long ? "#C8AA6E" : "rgba(200,170,110,0.34)"}
              strokeWidth={long ? 1.4 : 1}
              strokeLinecap="square"
            >
              <line x1="0" y1="-5" x2="0" y2="5" />
              {long && <line x1="-3.5" y1="-4.5" x2="3.5" y2="1" />}
            </g>
          );
        })}
      </svg>
      <Image
        src="/images/hoc.png"
        alt=""
        width={220}
        height={220}
        className="h-[46%] w-[46%] object-contain"
        priority={priority}
      />
    </div>
  );
}

/* ── Ornamentos ───────────────────────────────────────────────────────────── */

/** El rombo entre dos filetes que sustituye a una línea sin más. */
export function Rule({ className = "", color }: { className?: string; color?: string }) {
  const c = color ?? "#C8AA6E";
  const rgb = rgbOf(c);
  return (
    // `min-w` a propósito: con `w-full` dentro de un padre que se encoge a su contenido (una
    // columna con `items-center`, por ejemplo) el ancho se resolvía al del rombo y los filetes
    // desaparecían. Así el ornamento siempre se ve entero.
    <div
      aria-hidden
      className={`mx-auto flex w-full min-w-[200px] max-w-[300px] items-center gap-3 ${className}`}
    >
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, rgba(${rgb},0.4))` }} />
      <div className="h-[7px] w-[7px] rotate-45 border" style={{ borderColor: c }} />
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, rgba(${rgb},0.4))` }} />
    </div>
  );
}

/* ── El monumento ─────────────────────────────────────────────────────────── */

/**
 * El nombre compuesto como un logotipo, no como un titular: la primera palabra arriba, el nexo
 * pequeño entre dos filetes y la última palabra abajo, más grande. El tamaño sale de `--mon`,
 * que fija quien lo coloca, así el bloque siempre cabe dentro del anillo de runas.
 */
export function Monument({
  one,
  joiner,
  two,
  className = "",
  style,
}: {
  one: string;
  joiner: string;
  two: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`display mx-auto block w-fit leading-[0.84] ${className}`} style={style}>
      <span className="engraved block" style={{ fontSize: "var(--mon)" }}>
        {one}
      </span>
      <span
        className="my-[0.22em] flex items-center justify-center gap-[0.9em]"
        style={{ fontSize: "calc(var(--mon) * 0.3)" }}
      >
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(200,170,110,0.55)]" />
        <span className="foil">{joiner}</span>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(200,170,110,0.55)]" />
      </span>
      <span className="foil block" style={{ fontSize: "calc(var(--mon) * 1.3)" }}>
        {two}
      </span>
    </span>
  );
}

/* ── La runa de un reino ──────────────────────────────────────────────────── */

/**
 * La runa real de cada reino (`detailedIcon`), con su color detrás como luz. `lit` la enciende;
 * es lo que usa el anillo de la puerta, el índice de los reinos y el carril de filtros.
 */
export function RuneSigil({
  src,
  color,
  size = 52,
  lit = false,
  plate = false,
  className = "",
}: {
  src: string;
  color: string;
  size?: number;
  lit?: boolean;
  /** Chapa oscura detrás: las runas están dibujadas en colores de luz y sobre papel se pierden. */
  plate?: boolean;
  className?: string;
}) {
  const rgb = rgbOf(color);
  return (
    <span
      aria-hidden
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{
        width: size,
        height: size,
        ...(plate
          ? {
              background: "#0B0B10",
              borderRadius: Math.round(size * 0.22),
              padding: Math.round(size * 0.08),
            }
          : null),
      }}
    >
      <span
        className="absolute inset-[-30%] rounded-full transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.55) 0%, transparent 68%)`,
          opacity: lit ? 0.95 : 0.12,
        }}
      />
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="relative h-full w-full object-contain transition-[transform,opacity] duration-300 ease-pop"
        style={{ opacity: lit ? 1 : 0.72, transform: lit ? "scale(1.08)" : "scale(1)" }}
        loading="lazy"
      />
    </span>
  );
}

/* ── Entrada sellada ──────────────────────────────────────────────────────── */

/**
 * La mayoría del códice todavía no tiene ilustración (288 de 344 personajes, 43 de 49 criaturas).
 * En vez de repetir un marcador gris, la falta de arte es una forma propia: el anillo, la inicial
 * en pan de oro y, detrás, la luz del reino o del oro.
 */
export function SealedPlate({
  initial,
  tint = "#C8AA6E",
  rune,
}: {
  initial: string;
  tint?: string;
  /** La runa del reino al que pertenece, de fondo. */
  rune?: string;
}) {
  const rgb = rgbOf(tint);
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        background: `radial-gradient(120% 90% at 50% 12%, rgba(${rgb},0.2) 0%, transparent 62%), linear-gradient(to bottom, #14120E 0%, #09090C 100%)`,
      }}
    >
      {rune && (
        <Image
          src={rune}
          alt=""
          width={220}
          height={220}
          aria-hidden
          className="absolute inset-0 m-auto h-[78%] w-[78%] object-contain opacity-[0.07]"
          loading="lazy"
        />
      )}
      <div className="relative grid h-[52%] w-[52%] place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(200,170,110,0.28)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(200,170,110,0.14)" strokeWidth="0.8" />
        </svg>
        <span className="foil display select-none text-[2.4rem] leading-none sm:text-[3rem]" aria-hidden>
          {initial}
        </span>
      </div>
    </div>
  );
}

/* ── Chapas de dato ───────────────────────────────────────────────────────── */

/** Una cifra real del códice con su rótulo. La cifra en Penumbra, el rótulo en Plantin. */
export function StatPair({
  value,
  label,
  color,
}: {
  value: number | string;
  label: string;
  color?: string;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <span
        className="numeral text-2xl leading-none md:text-3xl"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      <span className="text-[13px] text-[var(--ash)]">{label}</span>
    </span>
  );
}

/* ── La portada de una colección ──────────────────────────────────────────── */

/**
 * La banda oscura que abre cada página de colección. Siempre negra, aunque el tema esté en claro:
 * es la portada del juego. El contenido de debajo sí sigue el tema.
 */
export function Cover({
  children,
  embers = 10,
  tint,
  className = "",
}: {
  children: ReactNode;
  embers?: number;
  tint?: string;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden px-5 pb-14 pt-[calc(var(--header-h)+40px)] md:pb-20 md:pt-[calc(var(--header-h)+72px)] ${className}`}
      style={{ background: VOID, color: "#F0E6D2" }}
    >
      <NightSky embers={embers} tint={tint} />
      <div className="relative z-10 mx-auto w-full max-w-[1240px]">{children}</div>
      {/* El borde inferior de la portada: un filete de oro que la separa del códice. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(200,170,110,0.35), transparent)" }}
      />
    </section>
  );
}
