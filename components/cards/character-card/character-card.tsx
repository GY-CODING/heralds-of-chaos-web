"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import type { Character, CharacterWithWorld } from "@/types/character.types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CharacterCardProps {
  character: Character | CharacterWithWorld;
}

/**
 * Card épica minimalista inspirada en League of Legends Universe
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const language = useLanguage((state) => state.language);
  const isPlaceholderImage = character.image.includes("none.webp");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={ROUTES.CHARACTER_DETAIL(character.identifier)}
        className="group block relative overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)] transition-all duration-500 hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
      >
        {/* Imagen con overlay gradiente */}
        <div className="relative w-full aspect-square sm:aspect-[3/4] overflow-hidden bg-[var(--background-alt)]">
          <Image
            src={character.image}
            alt={character.name[language] || character.name.en || "Character"}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${
              isPlaceholderImage ? "invert dark:invert-0" : ""
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradiente overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-90" />

          {/* Brillo dorado en hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/0 via-[var(--gold)]/5 to-[var(--gold)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Contenido */}
        <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
          {/* Nombre */}
          <h3 className="text-sm sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-1">
            {character.name[language]}
          </h3>

          {/* Título */}
          <p className="text-[10px] sm:text-sm font-medium text-[var(--gold)] uppercase tracking-wide line-clamp-1">
            {character.title[language]}
          </p>

          {/* Raza */}
          <p className="text-[10px] sm:text-sm text-[var(--text-secondary)] line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            {character.race[language]}
          </p>

          {/* Línea decorativa */}
          <div className="pt-3">
            <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-[var(--gold)] to-transparent transition-all duration-500" />
          </div>
        </div>

        {/* Indicador de hover */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
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
