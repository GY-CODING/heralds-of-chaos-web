"use client";

/**
 * Ficha de un personaje: el arte a sangre como portada, los datos en chapa y, al final, otros
 * nombres del mismo reino para que la ficha no sea un callejón sin salida.
 */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { DetailRail, EntryDetail, type DetailStat } from "@/components/ui/entry-detail/entry-detail";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { Character } from "@/types/character.types";
import type { World } from "@/types/world.types";

interface CharacterDetailContentProps {
  character: Character;
  world: World | null;
  companions: Character[];
}

export function CharacterDetailContent({
  character,
  world,
  companions,
}: CharacterDetailContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  const race = translate(character.race);
  const stats: DetailStat[] = [];
  if (race) stats.push({ label: t.detail.race, value: race });
  if (world) {
    stats.push({
      label: t.detail.realm,
      value: translate(world.name),
      color: world.mainColor,
      rune: world.detailedIcon,
      href: ROUTES.WORLD_DETAIL(world.identifier),
    });
  }

  return (
    <EntryDetail
      name={translate(character.name)}
      sub={translate(character.title)}
      description={translate(character.description)}
      image={character.image}
      tint={world?.mainColor}
      rune={world?.detailedIcon}
      stats={stats}
      back={{ href: ROUTES.CHARACTERS, label: t.pages.characters.title }}
      shape="portrait"
    >
      {companions.length > 0 && world && (
        <DetailRail title={t.detail.relatedCharacters}>
          {companions.map((companion) => (
            <EntryPlate
              key={companion.identifier}
              href={ROUTES.CHARACTER_DETAIL(companion.identifier)}
              image={companion.image}
              name={translate(companion.name)}
              sub={translate(companion.title)}
              tint={world.mainColor}
              rune={world.detailedIcon}
            />
          ))}
        </DetailRail>
      )}
    </EntryDetail>
  );
}
