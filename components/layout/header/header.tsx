"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  ThemeToggle,
  LanguageToggle,
} from "@/components/ui/theme-toggle/theme-toggle";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import { ROUTES, SECTION_TITLES } from "@/constants/routes.constants";

/**
 * Header principal de la aplicación
 * Diseño épico y limpio inspirado en League of Legends Universe
 */
export function Header() {
  const pathname = usePathname();
  const translate = useTranslate();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: ROUTES.CHARACTERS, labelKey: "characters" as const },
    { href: ROUTES.CREATURES, labelKey: "creatures" as const },
    { href: ROUTES.ITEMS, labelKey: "items" as const },
    { href: ROUTES.WORLDS, labelKey: "worlds" as const },
    { href: ROUTES.PLACES, labelKey: "places" as const },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <motion.header
      className="sticky top-0 z-[100] glass-morphism"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-6">
        {/* Logo minimalista */}
        <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/images/hoc.png"
              alt="Yggdrasil Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[13px] sm:text-lg font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors duration-300">
              {t.common.appTitle}
            </span>
            <span className="text-[12px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
              {t.common.company}
            </span>
          </div>
        </Link>

        {/* Navegación central - Desktop */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <motion.ul
            className="flex items-center gap-2 list-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navItems.map((item, index) => {
              const title = SECTION_TITLES[item.labelKey];
              const active = isActive(item.href);
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="relative block px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 group"
                  >
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        active
                          ? "text-[var(--gold)]"
                          : "text-[var(--text-secondary)] group-hover:text-[var(--gold)]"
                      }`}
                    >
                      {translate(title)}
                    </span>

                    {/* Active underline */}
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-[var(--gold)] rounded-full"
                        layoutId="activeIndicator"
                        initial={{ width: 0 }}
                        animate={{ width: "50%" }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 bg-[var(--surface-hover)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Controles de tema e idioma */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <LanguageToggle />
          <ThemeToggle />

          {/* Botón hamburguesa móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--text-primary)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--text-primary)]" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Navegación móvil - Dropdown vertical */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const title = SECTION_TITLES[item.labelKey];
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                      active
                        ? "text-[var(--gold)] bg-[var(--gold)]/10 border border-[var(--gold)]/20"
                        : "text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    {translate(title)}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
