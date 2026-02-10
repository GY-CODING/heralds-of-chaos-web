"use client";

import { ItemCard } from "@/components/cards/item-card/item-card";
import { FilterBar } from "@/components/ui/filter-bar/filter-bar";
import { useTranslations } from "@/hooks/use-translations";
import { useFilters } from "@/hooks/use-filters";
import { ITEM_FILTERS } from "@/constants/filters.constants";
import type { Item } from "@/types/item.types";
import { Hammer } from "lucide-react";

interface ItemsPageContentProps {
  items: Item[];
}

export function ItemsPageContent({ items }: ItemsPageContentProps) {
  const t = useTranslations();

  // Hook de filtros
  const {
    filteredData,
    filterValues,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
    enrichedConfigs,
  } = useFilters(items, ITEM_FILTERS);

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header épico */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#A07F4C] via-[#C8AA6E] to-[#785A28] bg-clip-text text-transparent">
              {t.pages.items.title}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-[800px] mx-auto leading-relaxed font-light">
            {t.pages.items.subtitle}
          </p>
          <div className="flex justify-center mt-8">
            <div className="relative w-48 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] px-4">
                <Hammer
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gold)]"
                  strokeWidth={2}
                />
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

        {/* Grid de ítems */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
            {filteredData.map((item) => (
              <ItemCard key={item.identifier} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-32">
            <div className="mb-6 flex justify-center">
              <Hammer
                className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--gold)]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-2xl font-bold text-[var(--gold)] mb-4">
              {t.pages.items.empty.title}
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              {t.pages.items.empty.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
