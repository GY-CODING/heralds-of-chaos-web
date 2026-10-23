"use client";

/**
 * El armazón de una página de colección: portada negra, barra de filtros pegada y la rejilla.
 *
 * Las cinco colecciones compartían antes un armazón distinto cada una (título con resplandor,
 * panel de filtros alto, rejillas que no coincidían). Ahora es una sola pieza, así que cualquier
 * arreglo vale para las cinco y la web se lee como un único tomo.
 */

import { CodexFilterBar } from "@/components/ui/codex-filter-bar/codex-filter-bar";
import { Cover, Rule } from "@/components/ui/scene/scene";
import { useFilters } from "@/hooks/use-filters";
import { useTranslations } from "@/hooks/use-translations";
import type { FilterConfig } from "@/types/filter.types";
import type { World } from "@/types/world.types";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface CodexShellProps<T> {
  title: string;
  subtitle: string;
  empty: { title: string; description: string };
  data: T[];
  filters: FilterConfig[];
  /** Clases de la rejilla: cada colección tiene su proporción de lámina. */
  grid: string;
  /** Con qué se cuenta en la barra: "85 ítems", no "85 entradas". */
  unit: { one: string; many: string };
  keyOf: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Si se pasan, la barra enseña el carril de runas en vez del desplegable de mundos. */
  worlds?: World[];
  realmFilterId?: string;
}

export function CodexShell<T extends Record<string, unknown>>({
  title,
  subtitle,
  empty,
  data,
  filters,
  grid,
  unit,
  keyOf,
  renderItem,
  worlds,
  realmFilterId,
}: CodexShellProps<T>) {
  const t = useTranslations();
  const reduce = useReducedMotion();

  const {
    filteredData,
    filterValues,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
    enrichedConfigs,
  } = useFilters(data, filters);

  return (
    <div className="min-h-screen">
      <Cover>
        <motion.div
          className="text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h1 className="foil text-5xl leading-none md:text-8xl">{title}</h1>
          <Rule className="mt-7 max-w-[220px]" />
          <p className="mx-auto mt-7 max-w-[52ch] text-base leading-relaxed text-[#A09B8C] md:text-lg">
            {subtitle}
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
            unit={unit}
            worlds={worlds}
            realmFilterId={realmFilterId}
          />

          {filteredData.length > 0 ? (
            <ul className={`mt-7 list-none p-0 ${grid}`}>
              {filteredData.map((item) => (
                <li key={keyOf(item)}>{renderItem(item)}</li>
              ))}
            </ul>
          ) : (
            <div className="py-24 text-center sm:py-32">
              <Rule className="max-w-[160px]" />
              <p className="mt-8 text-2xl text-[var(--text-primary)]">{empty.title}</p>
              <p className="mt-3 text-base text-[var(--text-secondary)]">{empty.description}</p>
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
