"use client";

import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { World } from "@/types/world.types";
import { motion } from "framer-motion";
import { MapPin, TreePine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorldsPageContentProps {
  worlds: World[];
}

export function WorldsPageContent({ worlds }: WorldsPageContentProps) {
  const t = useTranslations();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decorativo estático - mucho más performante */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[var(--gold)]/10 via-purple-500/5 to-transparent rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-[var(--gold)]/10 to-transparent rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header épico */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#A07F4C] via-[#C8AA6E] to-[#785A28] bg-clip-text text-transparent">
              {t.pages.worlds.title}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-[800px] mx-auto leading-relaxed font-light">
            {t.pages.worlds.subtitle}
          </p>
          <div className="flex justify-center mt-8">
            <div className="relative w-48 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] px-4">
                <TreePine
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gold)]"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de mundos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
          {worlds.map((world, index) => (
            <WorldCard
              key={world.identifier}
              world={world}
              index={index}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Card minimalista y elegante, consistente con el resto de la aplicación
 */
function WorldCard({
  world,
  index,
  language,
}: {
  world: World;
  index: number;
  language: "en" | "es";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/worlds/${world.identifier}`}
        className="group block relative overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)] transition-all duration-500 hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
      >
        {/* Imagen con overlay gradiente */}
        <div className="relative w-full aspect-square sm:aspect-[3/4] overflow-hidden bg-[var(--background-alt)]">
          <Image
            src={world.image}
            alt={world.name[language] || world.name.en || "World"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 5}
          />

          {/* Gradiente overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-90" />

          {/* Brillo dorado en hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/0 via-[var(--gold)]/5 to-[var(--gold)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Contenido */}
        <div className="p-2 sm:p-4 md:p-5 space-y-1 sm:space-y-2">
          {/* Nombre del mundo */}
          <h3 className="text-sm sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-1">
            {world.name[language]}
          </h3>

          {/* Descripción */}
          <p className="text-[10px] sm:text-sm text-[var(--text-secondary)] line-clamp-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            {world.description[language]}
          </p>

          {/* Badge de lugares */}
          <div className="flex items-center gap-2 pt-1 sm:pt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[var(--background)] border border-[var(--border)] rounded-full">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--gold)]" />
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-secondary)]">
                {Array.isArray(world.places) ? world.places.length : 0}{" "}
                {language === "en" ? "Places" : "Lugares"}
              </span>
            </div>
          </div>

          {/* Línea decorativa */}
          <div className="pt-2 sm:pt-3">
            <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-[var(--gold)] to-transparent transition-all duration-500" />
          </div>
        </div>

        {/* Indicador de hover */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--gold)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
