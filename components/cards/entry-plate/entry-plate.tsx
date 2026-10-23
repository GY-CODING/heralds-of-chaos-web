"use client";

/**
 * La lámina del códice: la forma que comparten criaturas, ítems y lugares.
 *
 * Es la misma pieza que la ficha de personaje — arte, velo, nombre dentro y una tira grabada
 * debajo — para que todas las colecciones se lean como partes del mismo tomo. Lo único que
 * cambia es la proporción del arte: los ítems son cuadrados, los lugares apaisados y las
 * criaturas verticales, que es como están hechas las ilustraciones.
 *
 * Cuando no hay ilustración (43 de 49 criaturas, 43 de 108 lugares) entra la entrada sellada.
 */

import { realmInk, rgbOf, SealedPlate } from "@/components/ui/scene/scene";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type PlateShape = "portrait" | "square" | "wide";

const ASPECT: Record<PlateShape, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
};

const SIZES: Record<PlateShape, string> = {
  portrait: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  square: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  wide: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
};

export function EntryPlate({
  href,
  image,
  name,
  sub,
  strip,
  tint = "#C8AA6E",
  rune,
  shape = "portrait",
}: {
  href: string;
  image?: string;
  name: string;
  /** La línea de dentro del velo: el título, el tipo o el reino. */
  sub?: string;
  /** La tira grabada de debajo: la raza, la categoría… */
  strip?: string;
  tint?: string;
  rune?: string;
  shape?: PlateShape;
}) {
  const [artFailed, setArtFailed] = useState(false);
  const sealed = !image || image.includes("none.webp") || artFailed;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] transition-[transform,border-color] duration-300 ease-pop hover:-translate-y-1.5 hover:border-[var(--gold)] focus-visible:border-[var(--gold)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className={`relative overflow-hidden bg-[#0B0B10] ${ASPECT[shape]}`}>
        {sealed ? (
          <SealedPlate initial={name.charAt(0)} tint={tint} rune={rune} />
        ) : (
          <Image
            src={image}
            alt=""
            fill
            sizes={SIZES[shape]}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={() => setArtFailed(true)}
          />
        )}

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[62%]"
          style={{
            background:
              "linear-gradient(to top, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.72) 38%, rgba(6,6,10,0) 100%)",
          }}
        />

        {rune && (
          <Image
            src={rune}
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
          {sub && (
            <p
              className="mt-1.5 line-clamp-1 text-[12px] leading-tight sm:text-[13px]"
              style={{ color: realmInk(tint) }}
            >
              {sub}
            </p>
          )}
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(to right, transparent, rgba(${rgbOf(tint)},0.9), transparent)` }}
        />
      </div>

      {strip !== undefined && (
        <p className="truncate px-3 py-2.5 text-[12px] text-[var(--text-tertiary)] sm:text-[13px]">
          {strip || "—"}
        </p>
      )}
    </Link>
  );
}
