"use client";

/**
 * La barra del códice.
 *
 * Es fija y se comporta como el HUD de un juego: arriba del todo no existe (transparente sobre
 * la portada negra, con el texto en hueso) y en cuanto bajas se vuelve cristal del tema con un
 * filete de oro debajo. El color lo reparte con tres variables (`--bar-fg`, `--bar-line`,
 * `--bar-wash`) para que los botones de tema e idioma sigan el mismo estado sin repetir lógica.
 *
 * La sección en la que estás se marca con un rombo, no con un subrayado: el rombo es el
 * ornamento de la casa y aparece también en los filetes y en los enlaces de los reinos.
 */

import { ROUTES, SECTION_TITLES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import { LanguageToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: ROUTES.CHARACTERS, key: "characters" as const },
  { href: ROUTES.CREATURES, key: "creatures" as const },
  { href: ROUTES.ITEMS, key: "items" as const },
  { href: ROUTES.WORLDS, key: "worlds" as const },
  { href: ROUTES.PLACES, key: "places" as const },
];

export function Header() {
  const pathname = usePathname();
  const translate = useTranslate();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [sunk, setSunk] = useState(false);

  // Arriba del todo la barra desaparece sobre la portada; a partir de ahí, cristal.
  useEffect(() => {
    const onScroll = () => setSunk(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El menú de móvil ocupa la pantalla: se cierra con Escape y bloquea el scroll de detrás.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const isActive = (path: string) => pathname.startsWith(path);

  const bar = sunk
    ? {
        "--bar-fg": "var(--text-primary)",
        "--bar-line": "var(--border-strong)",
        "--bar-wash": "var(--surface-hover)",
      }
    : {
        "--bar-fg": "#F0E6D2",
        "--bar-line": "rgba(240,230,210,0.22)",
        "--bar-wash": "rgba(240,230,210,0.1)",
      };

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] transition-colors duration-500"
      style={{
        ...(bar as React.CSSProperties),
        color: "var(--bar-fg)",
        background: sunk ? "var(--surface-elevated)" : "transparent",
        backdropFilter: sunk ? "blur(14px)" : "none",
        WebkitBackdropFilter: sunk ? "blur(14px)" : "none",
        borderBottom: `1px solid ${sunk ? "var(--border-strong)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* La marca */}
        <Link href={ROUTES.HOME} className="group flex items-center gap-2.5">
          <Image
            src="/images/hoc.png"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 object-contain transition-transform duration-300 ease-pop group-hover:scale-110 sm:h-9 sm:w-9"
          />
          <span className="flex flex-col leading-none">
            <span className="display text-[15px] tracking-[0.02em] sm:text-[17px]">
              {t.common.appTitle}
            </span>
            <span className="mt-1 text-[10px] tracking-[0.22em] opacity-55 sm:text-[11px]">
              {t.common.company}
            </span>
          </span>
        </Link>

        {/* Las cinco colecciones */}
        <nav className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="display relative flex items-center gap-2 px-3.5 py-2 text-[13px] tracking-[0.06em] transition-opacity duration-300 hover:opacity-100"
                    style={{ opacity: active ? 1 : 0.62 }}
                  >
                    <span
                      aria-hidden
                      className="h-[5px] w-[5px] rotate-45 border transition-[opacity,transform] duration-300 ease-pop"
                      style={{
                        borderColor: "var(--gold)",
                        background: active ? "var(--gold)" : "transparent",
                        opacity: active ? 1 : 0,
                        transform: active ? "rotate(45deg) scale(1)" : "rotate(45deg) scale(0.4)",
                      }}
                    />
                    {translate(SECTION_TITLES[item.key])}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--bar-line)] transition-colors duration-200 hover:border-[var(--gold)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Menú de móvil: a pantalla completa, sobre negro, con las cinco colecciones grandes. */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 top-[var(--header-h)] z-[99] lg:hidden"
            style={{ background: "#06060A", color: "#F0E6D2" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex h-full flex-col justify-center gap-1 px-7 pb-24">
              {NAV.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.04 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="display flex items-center gap-3 border-b border-[rgba(200,170,110,0.14)] py-5 text-3xl leading-none"
                      style={{ color: active ? "var(--gold)" : "#F0E6D2" }}
                    >
                      <span
                        aria-hidden
                        className="h-[7px] w-[7px] rotate-45 border border-[var(--gold)]"
                        style={{ background: active ? "var(--gold)" : "transparent" }}
                      />
                      {translate(SECTION_TITLES[item.key])}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
