"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import type { Place } from "@/types/place.types";
import Image from "next/image";
import Link from "next/link";

interface PlaceCardProps {
  place: Place;
}

/**
 * Componente Card para mostrar un lugar
 */
export function PlaceCard({ place }: PlaceCardProps) {
  const language = useLanguage((state) => state.language);

  return (
    <Link
      href={ROUTES.PLACE_DETAIL(place.identifier)}
      className="group relative flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={place.image}
          alt={place.name[language] || place.name.en || "Place"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">
          {place.name[language]}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {place.description[language]}
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
