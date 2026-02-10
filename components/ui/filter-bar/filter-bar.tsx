"use client";

import { useLanguage } from "@/hooks/use-language";
import type { FilterConfig, FilterValues } from "@/types/filter.types";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  filters: FilterConfig[];
  values: FilterValues;
  onFilterChange: (filterId: string, value: string | string[]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount?: number;
}

/**
 * Barra de filtros genérica y reutilizable
 * Diseño épico minimalista con animaciones suaves
 */
export function FilterBar({
  filters,
  values,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  resultCount,
}: FilterBarProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-morphism rounded-2xl border border-[var(--border)] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {language === "en" ? "Filters" : "Filtros"}
            </h3>
            {resultCount !== undefined && (
              <p className="text-xs text-[var(--text-secondary)]">
                {resultCount} {language === "en" ? "results" : "resultados"}
              </p>
            )}
          </div>
        </div>

        {/* Filtros en línea horizontal */}
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter, index) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex-1 min-w-[200px]"
            >
              {filter.type === "text" && (
                <TextFilter
                  filter={filter}
                  value={(values[filter.id] as string) || ""}
                  onChange={(value) => onFilterChange(filter.id, value)}
                  language={language}
                />
              )}
              {filter.type === "select" && (
                <SelectFilter
                  filter={filter}
                  value={(values[filter.id] as string) || "all"}
                  onChange={(value) => onFilterChange(filter.id, value)}
                  language={language}
                />
              )}
            </motion.div>
          ))}

          {/* Botón de limpiar filtros */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onClearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 text-[var(--gold)] text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                {language === "en" ? "Clear" : "Limpiar"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Filtro de texto (búsqueda)
 */
function TextFilter({
  filter,
  value,
  onChange,
  language,
}: {
  filter: FilterConfig;
  value: string;
  onChange: (value: string) => void;
  language: "en" | "es";
}) {
  // Obtener el placeholder con fallback
  const placeholder =
    filter.placeholder?.[language] ||
    filter.placeholder?.en ||
    filter.label[language] ||
    filter.label.en;

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300"
      />
    </div>
  );
}

/**
 * Filtro select
 */
function SelectFilter({
  filter,
  value,
  onChange,
  language,
}: {
  filter: FilterConfig;
  value: string;
  onChange: (value: string) => void;
  language: "en" | "es";
}) {
  if (filter.type !== "select") return null;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300 appearance-none cursor-pointer"
      >
        {filter.options?.map((option) => {
          // Obtener la etiqueta con fallback a inglés
          const label =
            option.label[language] || option.label.en || option.value;
          return (
            <option key={option.value} value={option.value}>
              {label}
            </option>
          );
        })}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-[var(--text-tertiary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
