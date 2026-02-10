"use client";

import { useLanguage } from "@/hooks/use-language";
import { useTranslations } from "@/hooks/use-translations";
import type { World } from "@/types/world.types";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorldsPageContentProps {
  worlds: World[];
}

export function WorldsPageContent({ worlds }: WorldsPageContentProps) {
  const t = useTranslations();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 md:px-6 lg:px-8 relative">
      {/* Background decorativo estático - mucho más performante */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[var(--gold)]/10 via-purple-500/5 to-transparent rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-[var(--gold)]/10 to-transparent rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header simple y elegante */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[var(--gold)]" />
            <span className="text-sm uppercase tracking-[0.3em] text-[var(--gold)] font-semibold">
              {language === "en" ? "Nine Realms" : "Nueve Reinos"}
            </span>
            <Sparkles className="w-5 h-5 text-[var(--gold)]" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#A07F4C] via-[#C8AA6E] to-[#785A28] bg-clip-text text-transparent">
              {t.pages.worlds.title}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-[600px] mx-auto font-light">
            {t.pages.worlds.subtitle}
          </p>
        </motion.div>

        {/* Grid de mundos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
          {worlds.map((world, index) => (
            <WorldCard
              key={world.identifier}
              world={world}
              index={index}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Card optimizada para mejor rendimiento
 */
function WorldCard({
  world,
  index,
  language,
}: {
  world: World;
  index: number;
  language: "en" | "es";
}) {
  return (
    <Link href={`/worlds/${world.identifier}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: "easeOut",
        }}
        whileHover={{ y: -8 }}
        className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer transition-shadow duration-300"
        style={{
          boxShadow: `0 4px 20px ${world.mainColor}10`,
        }}
      >
        {/* Imagen de fondo optimizada - solo transform */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <Image
            src={world.image}
            alt={world.name[language] || world.name.en || "World"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
            priority={index < 5}
          />

          {/* Overlay con gradiente - transición CSS simple */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />

          {/* Efecto de brillo en hover - sin backdrop-blur */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${world.mainColor}30, transparent 70%)`,
            }}
          />
        </div>

        {/* Borde en hover - transición CSS */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 0 2px ${world.mainColor}50, 0 0 30px ${world.mainColor}20`,
          }}
        />

        {/* Contenido */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Icono superior - transición CSS simple */}
          <div className="relative self-end group/icon">
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12"
              style={{
                borderColor: world.mainColor,
                backgroundColor: `${world.mainColor}15`,
              }}
            >
              <Image
                src={world.detailedIcon}
                alt={`${world.name[language]} icon`}
                width={64}
                height={64}
                className="object-cover p-2"
              />
            </div>
          </div>

          {/* Info inferior */}
          <div className="space-y-3">
            {/* Nombre del mundo */}
            <h3
              className="text-3xl md:text-4xl font-black tracking-tight transition-transform duration-200 group-hover:scale-105"
              style={{
                color: world.mainColor,
                textShadow: `0 2px 10px ${world.mainColor}40`,
              }}
            >
              {world.name[language]}
            </h3>

            {/* Descripción */}
            <p className="text-sm text-white/90 line-clamp-2 font-light leading-relaxed transition-opacity duration-200 group-hover:text-white">
              {world.description[language]}
            </p>

            {/* Badge de lugares */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 group-hover:scale-105"
              style={{
                backgroundColor: `${world.mainColor}20`,
                border: `1px solid ${world.mainColor}40`,
              }}
            >
              <MapPin
                className="w-3.5 h-3.5"
                style={{ color: world.mainColor }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: world.mainColor }}
              >
                {Array.isArray(world.places) ? world.places.length : 0}{" "}
                {language === "en"
                  ? "Places"
                  : language === "es"
                    ? "Lugares"
                    : "Orte"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
