"use client";

/**
 * La barra del códice: buscar, filtrar y, cuando la colección pertenece a los reinos, el
 * **carril de runas**.
 *
 * Con 344 entradas, buscar es lo que más se hace, así que la barra se queda pegada bajo la
 * cabecera (la original era un panel alto que se perdía en cuanto bajabas una pantalla).
 *
 * El carril sustituye al desplegable de mundos: diez runas reales, cada una con su color. Elegir
 * un reino con su sello es más rápido y se parece más a un menú de juego que un `<select>`; y
 * como las runas ya están en la puerta y en el índice de la home, el sitio entero habla el mismo
 * idioma. Va en una fila con desplazamiento lateral, así cabe igual en móvil.
 */

import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import { rgbOf, RuneSigil } from "@/components/ui/scene/scene";
import type { FilterConfig, FilterValueUpdater, FilterValues } from "@/types/filter.types";
import type { World } from "@/types/world.types";
import { ChevronDown, Search, X } from "lucide-react";

interface CodexFilterBarProps {
  filters: FilterConfig[];
  values: FilterValues;
  onFilterChange: (filterId: string, value: FilterValueUpdater) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount?: number;
  /** Con qué se cuenta: "344 personajes" dice mucho más que "344 entradas". */
  unit?: { one: string; many: string };
  /** Si se pasan, el filtro `realmFilterId` se pinta como carril de runas. */
  worlds?: World[];
  realmFilterId?: string;
}

export function CodexFilterBar({
  filters,
  values,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  resultCount,
  unit,
  worlds,
  realmFilterId,
}: CodexFilterBarProps) {
  const { language } = useLanguage();
  const t = useTranslations();

  const rail = Boolean(worlds?.length && realmFilterId);
  const text = filters.find((f) => f.type === "text");
  const selects = filters.filter((f) => f.type === "select");
  // Multiselección: el carril guarda una lista de reinos; vacía = todos.
  const picked: string[] =
    rail && realmFilterId && Array.isArray(values[realmFilterId])
      ? (values[realmFilterId] as string[])
      : [];

  const toggleRealm = (value: string) => {
    if (!realmFilterId) return;
    onFilterChange(realmFilterId, (previous) => {
      const list = Array.isArray(previous) ? previous : [];
      return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    });
  };

  return (
    // Fondo opaco, no cristal: con el arte oscuro de las láminas pasando por debajo, el
    // recuento se quedaba sin contraste en tema claro.
    // Pegada a la cabecera desde `sm`. En móvil no: con el buscador, la raza, el recuento y el
    // carril de runas ocuparía casi un tercio de la pantalla todo el rato.
    <div className="z-40 -mx-4 border-b border-[var(--border-strong)] bg-[var(--background)] px-4 pb-3 pt-3 sm:sticky sm:top-[var(--header-h)] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2.5 sm:gap-3">
        {text && (
          <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1 sm:max-w-[320px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
              aria-hidden
            />
            <input
              type="text"
              id={`filter-${text.id}`}
              name={text.id}
              value={(values[text.id] as string) || ""}
              onChange={(e) => onFilterChange(text.id, e.target.value)}
              placeholder={text.placeholder?.[language] || text.placeholder?.en || ""}
              aria-label={text.label[language] || text.label.en}
              className="h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] pl-10 pr-3 text-[15px] text-[var(--text-primary)] transition-colors duration-300 placeholder:text-[var(--text-tertiary)] focus:border-[var(--gold)] focus:outline-none"
            />
          </div>
        )}

        {selects.map((filter) => (
          <div key={filter.id} className="relative min-w-0 flex-1 sm:max-w-[200px]">
            <select
              id={`filter-${filter.id}`}
              name={filter.id}
              value={(values[filter.id] as string) || "all"}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              aria-label={filter.label[language] || filter.label.en}
              className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] pl-3.5 pr-9 text-[15px] text-[var(--text-primary)] transition-colors duration-300 focus:border-[var(--gold)] focus:outline-none"
            >
              {filter.type === "select" &&
                filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[language] || option.label.en || option.value}
                  </option>
                ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
              aria-hidden
            />
          </div>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-3.5 text-sm text-[var(--text-secondary)] transition-colors duration-300 hover:border-[var(--gold)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" aria-hidden />
            {t.filters.clear}
          </button>
        )}

        {/* aria-live: al filtrar, el recuento cambia sin que nada más se mueva. */}
        <p
          aria-live="polite"
          className="ml-auto shrink-0 whitespace-nowrap text-[13px] text-[var(--text-tertiary)]"
        >
          <span className="numeral mr-1.5 text-base text-[var(--text-primary)]">{resultCount}</span>
          {unit
            ? resultCount === 1
              ? unit.one
              : unit.many
            : resultCount === 1
              ? t.home.entry
              : t.home.entries}
        </p>
      </div>

      {/* El carril de runas: un reino por sello. */}
      {rail && realmFilterId && (
        <div
          className="scrollbar-hide -mx-4 mt-2.5 flex gap-1 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          role="group"
          aria-label={t.filters.realm}
        >
          <RealmChip
            label={t.filters.allRealms}
            active={picked.length === 0}
            onClick={() => onFilterChange(realmFilterId, [])}
          />
          {worlds?.map((w) => {
            const value = w.name.en.toLowerCase();
            return (
              <RealmChip
                key={w.identifier}
                label={w.name[language] ?? w.name.en}
                color={w.mainColor}
                rune={w.detailedIcon}
                active={picked.includes(value)}
                onClick={() => toggleRealm(value)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function RealmChip({
  label,
  color,
  rune,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  rune?: string;
  active: boolean;
  onClick: () => void;
}) {
  const accent = color ?? "#C8AA6E";
  const rgb = rgbOf(accent);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-3 text-[14px] transition-[border-color,background-color,color] duration-300"
      style={{
        borderColor: active ? accent : "var(--border)",
        background: active ? `rgba(${rgb},0.12)` : "transparent",
        // El color del reino vive en la runa, el filete y el velo; el rótulo va en el color
        // del tema, que es el único que se lee igual de bien en claro y en oscuro.
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
      }}
    >
      {rune ? (
        <RuneSigil src={rune} color={accent} size={24} lit={active} plate />
      ) : (
        <span
          aria-hidden
          className="h-[7px] w-[7px] rotate-45 border"
          style={{ borderColor: accent, background: active ? accent : "transparent" }}
        />
      )}
      {label}
    </button>
  );
}
