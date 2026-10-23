"use client";

/** Ficha de un lugar, con el reino al que pertenece y otros salones del mismo reino. */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { DetailRail, EntryDetail, type DetailStat } from "@/components/ui/entry-detail/entry-detail";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { Place, PlaceWithWorld } from "@/types/place.types";

interface PlaceDetailContentProps {
  place: PlaceWithWorld;
  neighbours: Place[];
}

export function PlaceDetailContent({ place, neighbours }: PlaceDetailContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  const world = place.world;
  const stats: DetailStat[] = world
    ? [
        {
          label: t.detail.realm,
          value: translate(world.name),
          color: world.mainColor,
          rune: world.detailedIcon,
          href: ROUTES.WORLD_DETAIL(world.identifier),
        },
      ]
    : [];

  return (
    <EntryDetail
      name={translate(place.name)}
      sub={world ? translate(world.name) : undefined}
      description={translate(place.description)}
      image={place.image}
      tint={world?.mainColor}
      rune={world?.detailedIcon}
      stats={stats}
      back={{ href: ROUTES.PLACES, label: t.pages.places.title }}
      shape="wide"
    >
      {neighbours.length > 0 && (
        <DetailRail title={t.detail.relatedPlaces}>
          {neighbours.map((neighbour) => (
            <EntryPlate
              key={neighbour.identifier}
              href={ROUTES.PLACE_DETAIL(neighbour.identifier)}
              image={neighbour.image}
              name={translate(neighbour.name)}
              tint={world?.mainColor}
              rune={world?.detailedIcon}
              shape="wide"
            />
          ))}
        </DetailRail>
      )}
    </EntryDetail>
  );
}
