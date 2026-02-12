"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { PlaceWithWorld } from "@/types/place.types";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlaceDetailContentProps {
  place: PlaceWithWorld;
}

/**
 * Componente cliente para mostrar los detalles de un lugar
 * con soporte multiidioma
 */
export function PlaceDetailContent({ place }: PlaceDetailContentProps) {
  const { language } = useLanguage();
  const t = useTranslations();

  const currentName = language === "es" ? place.name.es : place.name.en;
  const currentDescription =
    language === "es" ? place.description.es : place.description.en;

  const worldName = place.world
    ? language === "es"
      ? place.world.name.es
      : place.world.name.en
    : null;

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
          href={ROUTES.PLACES}
          className="text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
        >
          {t.navigation.places}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--gold)] uppercase font-bold">
          {currentName}
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
            src={place.image}
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
              <div className="p-1.5 sm:p-2 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg sm:rounded-xl">
                <Landmark className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--gold)]" />
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

          {/* World Information */}
          {worldName && place.world && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="p-4 sm:p-6 bg-[var(--surface)] rounded-lg sm:rounded-xl border border-[var(--border)] hover:border-[var(--gold)]/30 transition-colors"
            >
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-2 sm:mb-3">
                {t.detail.realm}
              </p>
              <Link
                href={`/worlds/${place.world.identifier}`}
                className="group flex items-center gap-3 transition-all"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: place.world.mainColor }}
                />
                <span className="text-base sm:text-lg font-bold text-[var(--gold)] group-hover:text-[var(--gold-light)] transition-colors">
                  {worldName}
                </span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
