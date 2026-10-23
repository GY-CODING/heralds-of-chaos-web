"use client";

/**
 * Ficha del códice: una lámina, no una tarjeta.
 *
 * El nombre y el título van **dentro** del arte, sobre un velo, como la portada de un libro de
 * personaje; debajo queda una tira grabada con la raza y la runa del reino al que pertenece.
 *
 * Solo 56 de los 344 personajes tienen ilustración. Los otros 288 no se quedan con un marcador
 * gris: son **entradas selladas**, con la runa de su reino detrás y la inicial en pan de oro.
 *
 * Sin framer-motion a propósito: son hasta 344 láminas y montar una animación por ficha se nota.
 * El movimiento al pasar por encima va en CSS (transform y opacity).
 */

import { ROUTES } from "@/constants/routes.constants";
import { useLanguage } from "@/hooks/use-language";
import { realmInk, rgbOf, SealedPlate } from "@/components/ui/scene/scene";
import type { Character, CharacterWithWorld } from "@/types/character.types";
import type { MultiLanguageText } from "@/types/common.types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CharacterCardProps {
  character: Character | CharacterWithWorld;
}

/** Algún registro trae `race` como string suelto en vez de texto multiidioma. */
function text(value: MultiLanguageText | string | undefined, language: "en" | "es"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] || value.en || "";
}

export function CharacterCard({ character }: CharacterCardProps) {
  const { language } = useLanguage();
  // Hay URLs de arte que ya no existen (404). Si falla, la ficha cae al sello en vez de
  // quedarse con el icono de imagen rota.
  const [artFailed, setArtFailed] = useState(false);

  const name = text(character.name, language);
  const title = text(character.title, language);
  const race = text(character.race, language);

  const sealed = !character.image || character.image.includes("none.webp") || artFailed;
  const world =
    typeof character.world === "object" && character.world !== null && "mainColor" in character.world
      ? (character.world as CharacterWithWorld["world"])
      : null;
  const tint =
    world?.mainColor && /^#[0-9a-f]{6}$/i.test(world.mainColor) ? world.mainColor : "#C8AA6E";

  return (
    <Link
      href={ROUTES.CHARACTER_DETAIL(character.identifier)}
      className="group relative block overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] transition-[transform,border-color,box-shadow] duration-300 ease-pop hover:-translate-y-1.5 hover:border-[var(--gold)] focus-visible:border-[var(--gold)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ ["--tint" as string]: tint }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0B0B10]">
        {sealed ? (
          <SealedPlate initial={name.charAt(0)} tint={tint} rune={world?.detailedIcon} />
        ) : (
          <Image
            src={character.image}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={() => setArtFailed(true)}
          />
        )}

        {/* El velo: el nombre se lee siempre, tenga el arte el fondo que tenga. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[62%]"
          style={{
            background:
              "linear-gradient(to top, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.72) 38%, rgba(6,6,10,0) 100%)",
          }}
        />

        {/* El sello del reino, arriba a la izquierda. */}
        {world?.detailedIcon && (
          <Image
            src={world.detailedIcon}
            alt=""
            width={26}
            height={26}
            aria-hidden
            className="absolute left-2.5 top-2.5 h-6 w-6 object-contain opacity-45 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
          <h3 className="line-clamp-2 text-[15px] leading-[1.1] text-[#F0E6D2] sm:text-lg">
            {name}
          </h3>
          {title && (
            <p
              className="mt-1.5 line-clamp-1 text-[12px] leading-tight sm:text-[13px]"
              style={{ color: realmInk(tint) }}
            >
              {title}
            </p>
          )}
        </div>

        {/* Filo del reino abajo: se enciende al pasar por encima. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(to right, transparent, rgba(${rgbOf(tint)},0.9), transparent)` }}
        />
      </div>

      {/* La tira grabada: a qué raza pertenece. */}
      <p className="truncate px-3 py-2.5 text-[12px] text-[var(--text-tertiary)] sm:text-[13px]">
        {race || "—"}
      </p>
    </Link>
  );
}
