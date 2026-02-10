"use client";

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import type { World } from "@/types/world.types";
import Image from "next/image";
import Link from "next/link";

interface WorldCardProps {
  world: World;
}

/**
 * Componente Card para mostrar un mundo
 */
export function WorldCard({ world }: WorldCardProps) {
  const language = useLanguage((state) => state.language);

  return (
    <Link
      href={ROUTES.WORLD_DETAIL(world.identifier)}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]"
      style={{
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--surface)]">
        <Image
          src={world.image}
          alt={world.name[language] || world.name.en || "World"}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at bottom, ${world.mainColor}40, transparent 70%)`,
          }}
        />

        <div
          className="absolute inset-0 border-2 transition-all duration-500"
          style={{ borderColor: world.mainColor, opacity: 0.3 }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <div
          className="w-16 h-1 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to right, ${world.mainColor}, transparent)`,
          }}
        />

        <h3 className="text-3xl font-bold text-[var(--gold-light)] mb-3 line-clamp-1 tracking-tight">
          {world.name[language]}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          {world.description[language]}
        </p>
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${world.mainColor}, transparent)`,
        }}
      />
    </Link>
  );
}
