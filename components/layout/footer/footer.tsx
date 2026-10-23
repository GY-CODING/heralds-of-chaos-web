"use client";

/**
 * El pie: el cierre del tomo.
 *
 * Antes no había ninguno — la web terminaba de golpe. Lleva las cinco colecciones, los diez
 * reinos **de la base de datos** (cada uno con su runa y su color) y la línea de GYCODING.
 * Siempre oscuro, como las portadas: es la contraportada del libro.
 */

import { ROUTES, SECTION_TITLES } from "@/constants/routes.constants";
import { useLanguage, useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import { RuneSigil, VOID } from "@/components/ui/scene/scene";
import Image from "next/image";
import Link from "next/link";
import type { World } from "@/types/world.types";

const COLLECTIONS = [
  { href: ROUTES.CHARACTERS, key: "characters" as const },
  { href: ROUTES.CREATURES, key: "creatures" as const },
  { href: ROUTES.ITEMS, key: "items" as const },
  { href: ROUTES.WORLDS, key: "worlds" as const },
  { href: ROUTES.PLACES, key: "places" as const },
];

export function Footer({ worlds }: { worlds: World[] }) {
  const t = useTranslations();
  const translate = useTranslate();
  const { language } = useLanguage();

  return (
    <footer
      className="relative overflow-hidden px-5 pb-10 pt-16 md:px-8 md:pt-20"
      style={{ background: VOID, color: "#F0E6D2" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(200,170,110,0.35), transparent)" }}
      />

      <div className="mx-auto grid max-w-[1240px] gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-16">
        {/* La marca */}
        <div>
          <Link href={ROUTES.HOME} className="group inline-flex items-center gap-3">
            <Image
              src="/images/hoc.png"
              alt=""
              width={44}
              height={44}
              className="h-10 w-10 object-contain transition-transform duration-300 ease-pop group-hover:scale-110"
              loading="lazy"
            />
            <span className="display text-xl leading-none">{t.common.appTitle}</span>
          </Link>
          <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-[#A09B8C]">
            {t.footer.tagline}
          </p>
        </div>

        {/* El códice */}
        <nav aria-label={t.footer.codex}>
          <p className="display text-[13px] tracking-[0.16em] text-[var(--gold)]">
            {t.footer.codex}
          </p>
          <ul className="mt-5 space-y-2.5">
            {COLLECTIONS.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="text-[15px] text-[#A09B8C] transition-colors duration-300 hover:text-[#F0E6D2]"
                >
                  {translate(SECTION_TITLES[c.key])}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Los reinos, con su runa */}
        <nav aria-label={t.footer.realms}>
          <p className="display text-[13px] tracking-[0.16em] text-[var(--gold)]">
            {t.footer.realms}
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-x-7 gap-y-1.5">
            {worlds.map((w) => (
              <li key={w.identifier}>
                <Link
                  href={ROUTES.WORLD_DETAIL(w.identifier)}
                  className="group flex items-center gap-2 py-1 text-[15px] text-[#A09B8C] transition-colors duration-300 hover:text-[#F0E6D2]"
                >
                  <RuneSigil src={w.detailedIcon} color={w.mainColor} size={18} />
                  {w.name[language] ?? w.name.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div // #6A6A6A sobre negro se queda en 3,7:1 y esto es texto de 13px: sube a 5,3:1.
        className="mx-auto mt-14 flex max-w-[1240px] flex-col items-center gap-4 border-t border-[rgba(200,170,110,0.14)] pt-7 text-[13px] text-[#8A8578] sm:flex-row sm:justify-between">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
          <a
            href="https://www.gycoding.com"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[rgba(200,170,110,0.45)] underline-offset-4 transition-colors duration-300 hover:text-[var(--gold)]"
          >
            {t.common.company}
          </a>
          . {t.footer.rights}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="transition-colors duration-300 hover:text-[var(--gold)]"
        >
          {t.footer.top}
        </button>
      </div>
    </footer>
  );
}
