"use client";

/**
 * Los diez reinos: la pantalla de selección de mundo.
 *
 * Es la escena que antes abría la home y que más gustó: el arte real de cada reino a pantalla
 * completa, fijado, cambiando al bajar, con el índice de runas al lado. Aquí tiene más sentido
 * que en la home — la home enseña el árbol y esta página es el mapa.
 *
 * En móvil, los diez como tarjetas, una detrás de otra.
 */

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import { Cover, realmInk, rgbOf, Rule, RuneSigil, VOID } from "@/components/ui/scene/scene";
import type { World } from "@/types/world.types";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/* ── El pase de un reino al siguiente ───────────────────────────────────────
   Suave y limpio: un fundido con un desplazamiento mínimo, sin máscaras ni escalonados. La
   escena ya es grande (el arte ocupa la pantalla entera), así que el texto solo tiene que
   relevarse sin llamar la atención. `AnimatePresence mode="popLayout"` saca del flujo al reino
   que se va para que los dos se solapen y no haya parón al bajar rápido. */
const PASS: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  out: { opacity: 0, y: -8, transition: { duration: 0.35, ease: "easeOut" } },
};

interface WorldsPageContentProps {
  worlds: World[];
  census: Record<string, number>;
}

export function WorldsPageContent({ worlds, census }: WorldsPageContentProps) {
  const t = useTranslations();
  const { language } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const marks = useRef<(HTMLElement | null)[]>([]);

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

  if (worlds.length === 0) return null;

  const current = worlds[Math.min(active, worlds.length - 1)];
  const name = (w: World) => w.name[language] ?? w.name.en;
  const description = (w: World) => w.description[language] ?? w.description.en;
  const characters = (w: World) => census[w._id] ?? 0;
  const places = (w: World) => w.places?.length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: VOID }}>
      <Cover tint={current.mainColor}>
        <motion.div
          className="text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h1 className="foil text-5xl leading-none md:text-8xl">{t.pages.worlds.title}</h1>
          <Rule className="mt-7 max-w-[220px]" />
          <p className="mx-auto mt-7 max-w-[52ch] text-base leading-relaxed text-[#A09B8C] md:text-lg">
            {t.pages.worlds.subtitle}
          </p>
        </motion.div>
      </Cover>

      {/* Móvil: los reinos, uno detrás de otro. */}
      <ol className="list-none px-5 py-14 md:hidden">
        {worlds.map((w, i) => (
          <motion.li
            key={w.identifier}
            className="mb-6"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href={ROUTES.WORLD_DETAIL(w.identifier)}
              className="group block overflow-hidden rounded-2xl border"
              style={{ borderColor: `rgba(${rgbOf(w.mainColor)},0.28)` }}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={w.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 1px, 100vw"
                  className="object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06060A] via-[#06060A]/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
                  <RuneSigil src={w.detailedIcon} color={w.mainColor} size={40} lit />
                  <div className="min-w-0">
                    <p className="numeral text-[11px] tracking-[0.2em] text-[#8A8578]">{ROMAN[i]}</p>
                    <p
                      className="display truncate text-2xl leading-none"
                      style={{ color: realmInk(w.mainColor) }}
                    >
                      {name(w)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3.5">
                <p className="text-[15px] leading-relaxed text-[#A09B8C]">{description(w)}</p>
                <p className="mt-3.5 flex items-center gap-5 text-[13px] text-[#6A6A6A]">
                  <span>
                    <span className="numeral mr-1.5 text-base text-[#F0E6D2]">{characters(w)}</span>
                    {t.home.characters}
                  </span>
                  <span>
                    <span className="numeral mr-1.5 text-base text-[#F0E6D2]">{places(w)}</span>
                    {t.home.places}
                  </span>
                </p>
              </div>
            </Link>
          </motion.li>
        ))}
      </ol>

      {/* Escritorio: la escena se queda fija y el reino cambia al bajar. */}
      <div className="relative hidden md:block" style={{ height: `${worlds.length * 58}svh` }}>
        <div aria-hidden className="absolute inset-0">
          {worlds.map((w, i) => (
            <div
              key={w.identifier}
              data-i={i}
              ref={(el) => {
                marks.current[i] = el;
              }}
              style={{ height: "58svh" }}
            />
          ))}
        </div>

        <div className="sticky top-0 z-10 h-svh overflow-hidden">
          {worlds.map((w, i) => (
            <div
              key={w.identifier}
              className="absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-out motion-reduce:transition-none"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? "scale(1)" : "scale(1.05)",
              }}
              aria-hidden={i !== active}
            >
              <Image
                src={w.image}
                alt=""
                fill
                sizes="(min-width: 768px) 100vw, 1px"
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#06060A] via-[#06060A]/78 to-[#06060A]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060A] via-transparent to-[#06060A]/75" />
          <div
            className="absolute inset-0 transition-[background] duration-700"
            style={{
              background: `radial-gradient(70% 60% at 76% 48%, rgba(${rgbOf(current.mainColor)},0.2) 0%, transparent 70%)`,
            }}
          />

          <div className="relative flex h-full items-center px-10 lg:px-16">
            <div className="mx-auto flex w-full max-w-[1400px] items-center gap-14">
              {/* El índice de los diez reinos, con su runa. */}
              <ol className="w-[232px] shrink-0 space-y-1" aria-hidden>
                {worlds.map((w, i) => (
                  <li
                    key={w.identifier}
                    className="flex items-center gap-3 py-1 transition-opacity duration-500"
                    style={{ opacity: i === active ? 1 : 0.52 }}
                  >
                    <RuneSigil
                      src={w.detailedIcon}
                      color={w.mainColor}
                      size={i === active ? 30 : 22}
                      lit={i === active}
                    />
                    <span
                      className="display text-sm tracking-[0.04em] transition-colors duration-500"
                      style={{ color: i === active ? realmInk(w.mainColor) : "#A09B8C" }}
                    >
                      {name(w)}
                    </span>
                  </li>
                ))}
              </ol>

              {/* aria-live: bajo el mismo encabezado, el reino cambia al bajar. */}
              <div className="relative max-w-[620px]" aria-live="polite">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={current.identifier}
                    variants={reduce ? undefined : PASS}
                    initial="hidden"
                    animate="show"
                    exit="out"
                  >
                    <p className="numeral text-xs tracking-[0.3em] text-[#6A6A6A]">
                      {ROMAN[active]}
                    </p>
                    <p
                      className="display mt-5 text-5xl leading-[1.08] lg:text-7xl"
                      style={{ color: realmInk(current.mainColor) }}
                    >
                      {name(current)}
                    </p>
                    <div
                      aria-hidden
                      className="mt-6 h-px w-24"
                      style={{
                        background: `linear-gradient(to right, ${current.mainColor}, transparent)`,
                      }}
                    />
                    <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-[#C5BFB2]">
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
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Por dónde vas: una barra fina pegada al borde derecho. */}
          <div
            aria-hidden
            className="absolute bottom-0 right-0 top-0 hidden w-px bg-[rgba(200,170,110,0.12)] lg:block"
          >
            <div
              className="w-px transition-[height] duration-500"
              style={{
                height: `${((active + 1) / worlds.length) * 100}%`,
                background: current.mainColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
