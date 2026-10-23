"use client";

/**
 * El salón de los nombres: los 344 personajes.
 *
 * Mismo idioma que la home — portada negra arriba, el oro como encuadernación y la luz del reino
 * como acento — y debajo el códice entero, con la barra de filtros pegada y el carril de runas
 * para saltar de reino.
 */

import { CharacterCard } from "@/components/cards/character-card/character-card";
import { CodexFilterBar } from "@/components/ui/codex-filter-bar/codex-filter-bar";
import { Cover, Rule } from "@/components/ui/scene/scene";
import { CHARACTER_FILTERS } from "@/constants/filters.constants";
import { useFilters } from "@/hooks/use-filters";
import { useTranslations } from "@/hooks/use-translations";
import type { CharacterWithWorld } from "@/types/character.types";
import type { World } from "@/types/world.types";
import { motion, useReducedMotion } from "framer-motion";

interface CharactersPageContentProps {
  characters: CharacterWithWorld[];
  worlds: World[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CharactersPageContent({ characters, worlds }: CharactersPageContentProps) {
  const t = useTranslations();
  const reduce = useReducedMotion();

  const {
    filteredData,
    filterValues,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
    enrichedConfigs,
  } = useFilters(characters, CHARACTER_FILTERS);

  return (
    <div className="min-h-screen">
      <Cover>
        <motion.div
          className="text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h1 className="foil text-5xl leading-none md:text-8xl">{t.pages.characters.title}</h1>
          <Rule className="mt-7 max-w-[220px]" />
          <p className="mx-auto mt-7 max-w-[52ch] text-base leading-relaxed text-[#A09B8C] md:text-lg">
            {t.pages.characters.subtitle}
          </p>
        </motion.div>
      </Cover>

      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <CodexFilterBar
            filters={enrichedConfigs}
            values={filterValues}
            onFilterChange={setFilterValue}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            resultCount={filteredData.length}
            unit={t.units.characters}
            worlds={worlds}
            realmFilterId="world.name"
          />

          {filteredData.length > 0 ? (
            <ul className="mt-7 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {filteredData.map((character) => (
                <li key={character.identifier}>
                  <CharacterCard character={character} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-24 text-center sm:py-32">
              <Rule className="max-w-[160px]" />
              <p className="mt-8 text-2xl text-[var(--text-primary)]">
                {t.pages.characters.empty.title}
              </p>
              <p className="mt-3 text-base text-[var(--text-secondary)]">
                {t.pages.characters.empty.description}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-engraved display mt-8 !text-[var(--text-primary)]"
                >
                  {t.filters.clear}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
