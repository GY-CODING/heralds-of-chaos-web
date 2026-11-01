"use client";

/** Ficha de una criatura. Solo 6 de 49 tienen arte, así que casi siempre manda el sello. */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { DetailRail, EntryDetail, type DetailStat } from "@/components/ui/entry-detail/entry-detail";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import type { LinkedDescription } from "@/lib/services/link.service";
import { useTranslations } from "@/hooks/use-translations";
import type { Creature } from "@/types/creature.types";

interface CreatureDetailContentProps {
  linked?: LinkedDescription;
  creature: Creature;
  others: Creature[];
}

export function CreatureDetailContent({ linked, creature, others }: CreatureDetailContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  const race = translate(creature.race);
  const stats: DetailStat[] = race ? [{ label: t.detail.race, value: race }] : [];

  return (
    <EntryDetail
      linked={linked}
      name={translate(creature.name)}
      sub={race}
      description={translate(creature.description)}
      image={creature.image}
      stats={stats}
      back={{ href: ROUTES.CREATURES, label: t.pages.creatures.title }}
      shape="portrait"
    >
      {others.length > 0 && (
        <DetailRail title={t.detail.relatedCreatures}>
          {others.map((other) => (
            <EntryPlate
              key={other.identifier}
              href={ROUTES.CREATURE_DETAIL(other.identifier)}
              image={other.image}
              name={translate(other.name)}
            />
          ))}
        </DetailRail>
      )}
    </EntryDetail>
  );
}
