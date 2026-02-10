"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import type { Creature } from "@/types/creature.types";
import Image from "next/image";
import Link from "next/link";

interface CreatureCardProps {
  creature: Creature;
}

/**
 * Componente Card para mostrar una criatura
 */
export function CreatureCard({ creature }: CreatureCardProps) {
  const language = useLanguage((state) => state.language);

  return (
    <Link
      href={ROUTES.CREATURE_DETAIL(creature.identifier)}
      className="group relative flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={creature.image}
          alt={creature.name[language] || creature.name.en || "Creature"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">
          {creature.name[language]}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
          {creature.race[language]}
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
