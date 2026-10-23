"use client";

/**
 * Las criaturas. Mismo armazón que el resto del códice; solo 6 de las 49 tienen ilustración, así
 * que aquí la entrada sellada es casi la norma y conviene que se vea bien hecha.
 */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { CodexShell } from "@/components/ui/codex-shell/codex-shell";
import { CREATURE_FILTERS } from "@/constants/filters.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { Creature } from "@/types/creature.types";

interface CreaturesPageContentProps {
  creatures: Creature[];
}

export function CreaturesPageContent({ creatures }: CreaturesPageContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  return (
    <CodexShell
      title={t.pages.creatures.title}
      subtitle={t.pages.creatures.subtitle}
      empty={t.pages.creatures.empty}
      data={creatures as unknown as Record<string, unknown>[]}
      unit={t.units.creatures}
      filters={CREATURE_FILTERS}
      grid="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
      keyOf={(c) => String(c.identifier)}
      renderItem={(item) => {
        const creature = item as unknown as Creature;
        return (
          <EntryPlate
            href={ROUTES.CREATURE_DETAIL(creature.identifier)}
            image={creature.image}
            name={translate(creature.name)}
            sub={translate(creature.race)}
            shape="portrait"
          />
        );
      }}
    />
  );
}
