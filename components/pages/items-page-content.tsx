"use client";

/**
 * Los ítems. El arte viene cuadrado (1024×1024), así que la lámina es cuadrada.
 */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { CodexShell } from "@/components/ui/codex-shell/codex-shell";
import { ITEM_FILTERS } from "@/constants/filters.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { Item } from "@/types/item.types";

interface ItemsPageContentProps {
  items: Item[];
}

export function ItemsPageContent({ items }: ItemsPageContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  return (
    <CodexShell
      title={t.pages.items.title}
      subtitle={t.pages.items.subtitle}
      empty={t.pages.items.empty}
      data={items as unknown as Record<string, unknown>[]}
      unit={t.units.items}
      filters={ITEM_FILTERS}
      grid="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
      keyOf={(i) => String(i.identifier)}
      renderItem={(entry) => {
        const item = entry as unknown as Item;
        return (
          <EntryPlate
            href={ROUTES.ITEM_DETAIL(item.identifier)}
            image={item.image}
            name={translate(item.name)}
            sub={translate(item.type)}
            shape="square"
          />
        );
      }}
    />
  );
}
