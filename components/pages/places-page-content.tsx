"use client";

/**
 * Los lugares. El arte es apaisado (16:9), así que la lámina también.
 *
 * Los lugares no guardan a qué reino pertenecen: es el reino el que guarda su lista de lugares
 * (`world.places`). La página le da la vuelta a esa lista para que cada lugar luzca la runa y el
 * color de su reino y para que el carril de runas también funcione aquí.
 */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { CodexShell } from "@/components/ui/codex-shell/codex-shell";
import { PLACE_FILTERS } from "@/constants/filters.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { PlaceWithWorld } from "@/types/place.types";
import type { World } from "@/types/world.types";

interface PlacesPageContentProps {
  places: PlaceWithWorld[];
  worlds: World[];
}

export function PlacesPageContent({ places, worlds }: PlacesPageContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  return (
    <CodexShell
      title={t.pages.places.title}
      subtitle={t.pages.places.subtitle}
      empty={t.pages.places.empty}
      data={places as unknown as Record<string, unknown>[]}
      unit={t.units.places}
      filters={PLACE_FILTERS}
      grid="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      keyOf={(p) => String(p.identifier)}
      worlds={worlds}
      realmFilterId="world.name"
      renderItem={(entry) => {
        const place = entry as unknown as PlaceWithWorld;
        return (
          <EntryPlate
            href={ROUTES.PLACE_DETAIL(place.identifier)}
            image={place.image}
            name={translate(place.name)}
            sub={place.world ? translate(place.world.name) : undefined}
            tint={place.world?.mainColor}
            rune={place.world?.detailedIcon}
            shape="wide"
          />
        );
      }}
    />
  );
}
