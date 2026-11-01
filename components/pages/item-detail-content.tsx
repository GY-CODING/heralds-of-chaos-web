"use client";

/** Ficha de un objeto. El arte viene cuadrado, así que la lámina también. */

import { EntryPlate } from "@/components/cards/entry-plate/entry-plate";
import { DetailRail, EntryDetail, type DetailStat } from "@/components/ui/entry-detail/entry-detail";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslate } from "@/hooks/use-language";
import type { LinkedDescription } from "@/lib/services/link.service";
import { useTranslations } from "@/hooks/use-translations";
import type { Item } from "@/types/item.types";

interface ItemDetailContentProps {
  linked?: LinkedDescription;
  item: Item;
  others: Item[];
}

export function ItemDetailContent({ linked, item, others }: ItemDetailContentProps) {
  const t = useTranslations();
  const translate = useTranslate();

  const type = translate(item.type);
  const stats: DetailStat[] = type ? [{ label: t.detail.type, value: type }] : [];

  return (
    <EntryDetail
      linked={linked}
      name={translate(item.name)}
      sub={type}
      description={translate(item.description)}
      image={item.image}
      stats={stats}
      back={{ href: ROUTES.ITEMS, label: t.pages.items.title }}
      shape="square"
    >
      {others.length > 0 && (
        <DetailRail title={t.detail.relatedItems}>
          {others.map((other) => (
            <EntryPlate
              key={other.identifier}
              href={ROUTES.ITEM_DETAIL(other.identifier)}
              image={other.image}
              name={translate(other.name)}
              shape="square"
            />
          ))}
        </DetailRail>
      )}
    </EntryDetail>
  );
}
