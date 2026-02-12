"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { World } from "@/types/world.types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface WorldDetailContentProps {
  world: World;
}

/**
 * Componente cliente para mostrar los detalles de un mundo
 * con soporte multiidioma
 */
export function WorldDetailContent({ world }: WorldDetailContentProps) {
  const { language } = useLanguage();
  const t = useTranslations();

  const currentName = language === "es" ? world.name.es : world.name.en;
  const currentDescription =
    language === "es" ? world.description.es : world.description.en;

  return (
    <div className="min-h-screen py-8 sm:py-12 px-6 sm:px-8 lg:px-6 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 sm:mb-8 text-xs sm:text-sm flex items-center gap-2"
      >
        <Link
          href={ROUTES.HOME}
          className="text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
        >
          {t.navigation.home}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <Link
          href={ROUTES.WORLDS}
          className="text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
        >
          {t.navigation.worlds}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--gold)] uppercase font-bold">
          {currentName.toUpperCase()}
        </span>
      </motion.nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[2/3] rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-lg)] w-full max-w-[280px] sm:max-w-[360px] lg:max-w-none mx-auto lg:mx-0"
        >
          {/* Decorative corner */}
          <div className="absolute top-0 left-0 w-10 h-10 sm:w-16 sm:h-16 border-t-4 border-l-4 border-[var(--gold)] z-10 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-16 sm:h-16 border-b-4 border-r-4 border-[var(--gold)] z-10 rounded-br-2xl" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[1]" />

          <Image
            src={world.image}
            alt={currentName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6 sm:gap-8"
        >
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--gold)]/10 flex items-center justify-center overflow-hidden">
                <Image
                  src={world.detailedIcon}
                  alt={`${currentName} rune`}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)]">
                {currentName}
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-[var(--gold)] rounded-full" />
              {t.detail.description}
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {currentDescription}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
