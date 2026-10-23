"use client";

/**
 * La ficha abierta del códice: el armazón que comparten personaje, criatura, ítem, lugar y reino.
 *
 * Antes era media pantalla de imagen vertical y, al lado, un párrafo suelto con tres cuartos de
 * la página en blanco. Ahora:
 *
 *   · la portada usa **el arte de la propia entrada** a sangre, oscurecido, con el nombre encima;
 *   · debajo, la lámina enmarcada y el texto con **capitular** — el tomo, otra vez;
 *   · las chapas de dato (raza, reino, tipo) van en una fila grabada, no en píldoras sueltas;
 *   · y al final hay por dónde seguir: otras entradas de verdad, no un callejón sin salida.
 */

import { Rule, SealedPlate, realmInk, rgbOf, VOID } from "@/components/ui/scene/scene";
import { useTranslations } from "@/hooks/use-translations";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface DetailStat {
  label: string;
  value: string;
  /** Si el dato es un reino, lleva su color y su runa. */
  color?: string;
  rune?: string;
  href?: string;
}

interface EntryDetailProps {
  name: string;
  /** El título, el tipo o la raza: la línea que va bajo el nombre. */
  sub?: string;
  description: string;
  image?: string;
  tint?: string;
  rune?: string;
  stats?: DetailStat[];
  back: { href: string; label: string };
  /** Proporción de la lámina: los ítems son cuadrados y los lugares apaisados. */
  shape?: "portrait" | "square" | "wide";
  children?: ReactNode;
}

const ASPECT = {
  portrait: "aspect-[2/3]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
};

export function EntryDetail({
  name,
  sub,
  description,
  image,
  tint = "#C8AA6E",
  rune,
  stats = [],
  back,
  shape = "portrait",
  children,
}: EntryDetailProps) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [artFailed, setArtFailed] = useState(false);
  const sealed = !image || image.includes("none.webp") || artFailed;
  const rgb = rgbOf(tint);

  return (
    <article className="min-h-screen">
      {/* ── La portada ───────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pb-12 pt-[calc(var(--header-h)+32px)] md:px-8 md:pb-16 md:pt-[calc(var(--header-h)+64px)]"
        style={{ background: VOID, color: "#F0E6D2" }}
      >
        {!sealed && image && (
          <>
            {/* El propio arte, enorme y apagado, como fondo de la portada. */}
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              aria-hidden
              className="object-cover object-top opacity-40"
              priority
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(6,6,10,0.98) 2%, rgba(6,6,10,0.74) 45%, rgba(6,6,10,0.55) 100%)",
              }}
            />
          </>
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: `radial-gradient(70% 70% at 50% 0%, rgba(${rgb},0.16) 0%, transparent 70%)` }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-[1240px]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Link
            href={back.href}
            className="group inline-flex items-center gap-2.5 text-[13px] text-[#A09B8C] transition-colors duration-300 hover:text-[var(--gold)]"
          >
            <span
              aria-hidden
              className="h-[6px] w-[6px] rotate-45 border border-current transition-transform duration-300 ease-pop group-hover:-translate-x-1"
            />
            {back.label}
          </Link>

          <div className="mt-7 flex items-center gap-4 md:mt-9 md:gap-5">
            {rune && (
              <Image
                src={rune}
                alt=""
                width={56}
                height={56}
                aria-hidden
                className="h-10 w-10 shrink-0 object-contain md:h-14 md:w-14"
              />
            )}
            <h1 className="engraved text-4xl leading-[0.95] sm:text-6xl md:text-8xl">{name}</h1>
          </div>

          {sub && (
            <p className="mt-4 text-lg md:mt-5 md:text-2xl" style={{ color: realmInk(tint) }}>
              {sub}
            </p>
          )}

          {stats.length > 0 && (
            <dl className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-[rgba(200,170,110,0.18)] pt-6 md:mt-10">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {stat.rune && (
                    <Image
                      src={stat.rune}
                      alt=""
                      width={28}
                      height={28}
                      aria-hidden
                      className="h-7 w-7 object-contain"
                    />
                  )}
                  <div>
                    <dt className="text-[12px] tracking-[0.08em] text-[#6A6A6A]">{stat.label}</dt>
                    <dd className="display mt-1 text-[15px]" style={{ color: stat.color ? realmInk(stat.color) : "#F0E6D2" }}>
                      {stat.href ? (
                        <Link href={stat.href} className="transition-opacity duration-300 hover:opacity-70">
                          {stat.value}
                        </Link>
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      </header>

      {/* ── El cuerpo ────────────────────────────────────────────────────── */}
      <div className="bg-[var(--background)] px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-16">
          {/* La lámina enmarcada. */}
          <div className="mx-auto w-full max-w-[420px] md:mx-0">
            <div
              className={`relative overflow-hidden rounded-xl border bg-[#0B0B10] ${ASPECT[shape]}`}
              style={{ borderColor: `rgba(${rgb},0.3)` }}
            >
              {sealed ? (
                <SealedPlate initial={name.charAt(0)} tint={tint} rune={rune} />
              ) : (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 92vw, 420px"
                  className="object-cover"
                  onError={() => setArtFailed(true)}
                />
              )}
            </div>
            {sealed && (
              <p className="mt-3 text-center text-[13px] text-[var(--text-tertiary)] md:text-left">
                {t.detail.sealed}
              </p>
            )}
          </div>

          {/* El texto, con capitular. */}
          <div>
            <h2 className="text-2xl text-[var(--text-primary)] md:text-3xl">
              {t.detail.description}
            </h2>
            <Rule className="mx-0 mt-5 max-w-[180px]" />
            <p className="dropcap mt-7 max-w-[66ch] text-[17px] leading-[1.75] text-[var(--text-secondary)] md:text-[19px]">
              {description}
            </p>
          </div>
        </div>

        {children && <div className="mx-auto mt-20 max-w-[1240px]">{children}</div>}
      </div>
    </article>
  );
}

/** La fila de "por dónde seguir" al pie de una ficha. */
export function DetailRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl text-[var(--text-primary)] md:text-2xl">{title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {children}
      </div>
    </section>
  );
}
