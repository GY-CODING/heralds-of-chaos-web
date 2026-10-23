"use client";

/**
 * Ficha de un reino: su arte de portada, su runa, cuánta gente vive ahí y la lista real de sus
 * salones (`world.places`), que antes no se enseñaba en ningún sitio.
 */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { DetailRail, EntryDetail, type DetailStat } from "@/components/ui/entry-detail/entry-detail";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { Place } from "@/types/place.types";
import type { World } from "@/types/world.types";

interface WorldDetailContentProps {
  world: World;
  places: Place[];
  names: number;
}

export function WorldDetailContent({ world, places, names }: WorldDetailContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  const stats: DetailStat[] = [
    { label: t.home.names, value: String(names), color: world.mainColor },
    { label: t.home.halls, value: String(world.places?.length ?? 0), color: world.mainColor },
  ];

  return (
    <EntryDetail
      name={translate(world.name)}
      description={translate(world.description)}
      image={world.image}
      tint={world.mainColor}
      rune={world.detailedIcon}
      stats={stats}
      back={{ href: ROUTES.WORLDS, label: t.pages.worlds.title }}
      shape="wide"
    >
      {places.length > 0 && (
        <DetailRail title={t.pages.places.title}>
          {places.map((place) => (
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
        </DetailRail>
      )}
    </EntryDetail>
  );
}
