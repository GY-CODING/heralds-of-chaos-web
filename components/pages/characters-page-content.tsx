"use client";

import { CharacterCard } from "@/components/cards/character-card/character-card";
import { FilterBar } from "@/components/ui/filter-bar/filter-bar";
import { useTranslations } from "@/hooks/use-translations";
import { useFilters } from "@/hooks/use-filters";
import { CHARACTER_FILTERS } from "@/constants/filters.constants";
import type { CharacterWithWorld } from "@/types/character.types";
import { Crown } from "lucide-react";

interface CharactersPageContentProps {
  characters: CharacterWithWorld[];
}

export function CharactersPageContent({
  characters,
}: CharactersPageContentProps) {
  const t = useTranslations();

  // Hook de filtros
  const {
    filteredData,
    filterValues,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
    enrichedConfigs,
  } = useFilters(characters, CHARACTER_FILTERS);

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header épico */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#A07F4C] via-[#C8AA6E] to-[#785A28] bg-clip-text text-transparent">
              {t.pages.characters.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-[800px] mx-auto leading-relaxed font-light">
            {t.pages.characters.subtitle}
          </p>
          <div className="flex justify-center mt-8">
            <div className="relative w-48 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] px-4">
                <Crown className="w-6 h-6 text-[var(--gold)]" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={enrichedConfigs}
          values={filterValues}
          onFilterChange={setFilterValue}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          resultCount={filteredData.length}
        />

        {/* Grid de personajes */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filteredData.map((character) => (
              <CharacterCard key={character.identifier} character={character} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="mb-6 flex justify-center">
              <Crown
                className="w-16 h-16 text-[var(--gold)]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-2xl font-bold text-[var(--gold)] mb-4">
              {t.pages.characters.empty.title}
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              {t.pages.characters.empty.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
