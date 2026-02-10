"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Crown, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import { ROUTES } from "@/constants/routes.constants";
import type { Character } from "@/types/character.types";

interface CharacterDetailContentProps {
  character: Character;
}

/**
 * Componente cliente para mostrar los detalles de un personaje
 * con soporte multiidioma
 */
export function CharacterDetailContent({
  character,
}: CharacterDetailContentProps) {
  const { language } = useLanguage();
  const t = useTranslations();

  const currentName = language === "es" ? character.name.es : character.name.en;
  const currentTitle =
    language === "es" ? character.title.es : character.title.en;
  const currentDescription =
    language === "es" ? character.description.es : character.description.en;
  const currentRace = language === "es" ? character.race.es : character.race.en;

  const otherLanguageName =
    language === "es" ? character.name.en : character.name.es;
  const showAlternativeName = currentName !== otherLanguageName;

  return (
    <div className="min-h-screen py-12 px-6 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-sm flex items-center gap-2"
      >
        <Link
          href={ROUTES.HOME}
          className="text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
        >
          {t.navigation.home}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <Link
          href={ROUTES.CHARACTERS}
          className="text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
        >
          {t.navigation.characters}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--gold)] uppercase font-bold">
          {currentName}
        </span>
      </motion.nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-lg)]"
        >
          {/* Decorative corner */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[var(--gold)] z-10 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[var(--gold)] z-10 rounded-br-2xl" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[1]" />

          <Image
            src={character.image}
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
          className="flex flex-col gap-8"
        >
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl">
                <Crown className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)]">
                {currentName}
              </h1>
            </div>

            <p className="text-2xl font-bold text-[var(--gold)] mb-4">
              {currentTitle}
            </p>

            {/* Race Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                {t.detail.race}:
              </span>
              <span className="text-sm font-bold text-[var(--gold)]">
                {currentRace}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-1 h-6 bg-[var(--gold)] rounded-full" />
              {t.detail.description}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {currentDescription}
            </p>
          </div>

          {/* Alternative Names */}
          {showAlternativeName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]"
            >
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                {t.detail.alternativeNames}
              </p>
              <div className="space-y-1">
                <p className="text-base text-[var(--text-tertiary)]">
                  {language === "es"
                    ? t.detail.englishName
                    : t.detail.spanishName}
                  :{" "}
                  <span className="font-bold text-[var(--gold)]">
                    {otherLanguageName}
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Link
              href={ROUTES.CHARACTERS}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
            >
              <ChevronLeft className="w-5 h-5" />
              {t.detail.backTo} {t.navigation.characters}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
