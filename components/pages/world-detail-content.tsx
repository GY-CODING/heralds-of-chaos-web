"use client";

/**
 * Ficha de un reino: su arte de portada, su runa, cuánta gente vive ahí y la lista real de sus
 * salones (`world.places`), que antes no se enseñaba en ningún sitio.
 */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { EntryDetail, type DetailStat } from "@/components/ui/entry-detail/entry-detail";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import type { LinkedDescription } from "@/lib/services/link.service";
import { useTranslations } from "@/hooks/use-translations";
import type { Place } from "@/types/place.types";
import type { World } from "@/types/world.types";
import { Search } from "lucide-react";
import { useId, useMemo, useState } from "react";

/** Sin acentos ni mayúsculas: "gotaland" encuentra "Götaland". */
function fold(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface WorldDetailContentProps {
  linked?: LinkedDescription;
  world: World;
  places: Place[];
  names: number;
}

export function WorldDetailContent({ linked, world, places, names }: WorldDetailContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  const stats: DetailStat[] = [
    { label: t.home.names, value: String(names), color: world.mainColor },
    { label: t.home.halls, value: String(world.places?.length ?? 0), color: world.mainColor },
  ];

  return (
    <EntryDetail
      linked={linked}
      name={translate(world.name)}
      description={translate(world.description)}
      image={world.image}
      tint={world.mainColor}
      rune={world.detailedIcon}
      stats={stats}
      back={{ href: ROUTES.WORLDS, label: t.pages.worlds.title }}
      shape="wide"
    >
      {places.length > 0 && <WorldPlaces world={world} places={places} />}
    </EntryDetail>
  );
}

/** Los lugares del reino, con un buscador pequeño: sin filtros ni orden extra. */
function WorldPlaces({ world, places }: { world: World; places: Place[] }) {
  const t = useTranslations();
  const translate = useTranslate();
  const [query, setQuery] = useState("");
  const inputId = useId();

  const shown = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return places;
    return places.filter((p) => [p.name.es, p.name.en, p.name.de ?? ""].some((n) => fold(n).includes(q)));
  }, [places, query]);

  return (
    <section aria-labelledby={`${inputId}-title`}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 id={`${inputId}-title`} className="text-xl text-[var(--text-primary)] md:text-2xl">
          {t.worldPlaces.title}
          <span className="numeral ml-3 text-base text-[var(--text-tertiary)]">{shown.length}</span>
        </h2>
        <div className="relative w-full sm:w-72">
          <label htmlFor={inputId} className="sr-only">
            {t.worldPlaces.search}
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.worldPlaces.search}
            className="h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] pl-9 pr-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors duration-300 focus:border-[var(--gold)] focus:outline-none"
          />
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {shown.map((place) => (
            <EntryPlate
              key={place.identifier}
              href={ROUTES.PLACE_DETAIL(place.identifier)}
              image={place.image}
              name={translate(place.name)}
              tint={world.mainColor}
              rune={world.detailedIcon}
              shape="wide"
            />
          ))}
        </div>
      ) : (
        <p aria-live="polite" className="mt-8 text-[15px] text-[var(--text-secondary)]">
          {t.worldPlaces.empty}
        </p>
      )}
    </section>
  );
}
