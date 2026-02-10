"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import type { Item } from "@/types/item.types";
import Image from "next/image";
import Link from "next/link";

interface ItemCardProps {
  item: Item;
}

/**
 * Componente Card para mostrar un ítem
 */
export function ItemCard({ item }: ItemCardProps) {
  const language = useLanguage((state) => state.language);

  return (
    <Link
      href={ROUTES.ITEM_DETAIL(item.identifier)}
      className="group relative flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item.name[language] || item.name.en || "Item"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">
          {item.name[language]}
        </h3>
        <p className="text-sm font-semibold text-gold line-clamp-1">
          {item.type[language]}
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
