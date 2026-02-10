"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes.constants";
import { useTranslations } from "@/hooks/use-translations";
import { Crown, Dog, Hammer, TreePine, Landmark } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  const sections = [
    {
      title: t.sections.characters.title,
      description: t.sections.characters.description,
      href: ROUTES.CHARACTERS,
      icon: Crown,
    },
    {
      title: t.sections.creatures.title,
      description: t.sections.creatures.description,
      href: ROUTES.CREATURES,
      icon: Dog,
    },
    {
      title: t.sections.items.title,
      description: t.sections.items.description,
      href: ROUTES.ITEMS,
      icon: Hammer,
    },
    {
      title: t.sections.worlds.title,
      description: t.sections.worlds.description,
      href: ROUTES.WORLDS,
      icon: TreePine,
    },
    {
      title: t.sections.places.title,
      description: t.sections.places.description,
      href: ROUTES.PLACES,
      icon: Landmark,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean & Epic */}
      <section className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-alt)] to-[var(--background)] opacity-50" />

        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-[var(--text-primary)]">
              {t.hero.title}{" "}
              <span className="text-[var(--gold)] relative inline-block">
                {t.hero.chaos}
                {/* Subtle glow effect */}
                <motion.span
                  className="absolute inset-0 blur-xl opacity-30"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden="true"
                >
                  {t.hero.chaos}
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-[700px] mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.hero.description}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href={ROUTES.CHARACTERS}
              className="btn-primary inline-flex items-center gap-2 group px-6 sm:px-8 py-3 sm:py-4"
            >
              <span>{t.hero.cta}</span>
              <motion.span
                className="inline-block w-4 h-4 sm:w-5 sm:h-5"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* Decorative separator */}
          <motion.div
            className="flex justify-center mt-20"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Sections Grid - Clean Cards */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
              {t.sections.exploreThe}{" "}
              <span className="text-[var(--gold)]">{t.sections.universe}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl max-w-[600px] mx-auto">
              {t.sections.subtitle}
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={section.href}
                    className="card-base card-hover block p-6 sm:p-8 text-center group h-full"
                  >
                    {/* Icon */}
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 group-hover:bg-[var(--gold)]/15 group-hover:border-[var(--gold)]/30 transition-all duration-300 flex items-center justify-center">
                        <Icon
                          className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--gold)]"
                          strokeWidth={1.5}
                        />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--gold)] group-hover:drop-shadow-[0_0_15px_rgba(200,170,110,0.4)] transition-all duration-300">
                      {section.title}
                    </h3>

                    {/* Divider */}
                    <motion.div className="h-px w-0 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent mx-auto mb-4 group-hover:w-20 transition-all duration-500" />

                    {/* Description */}
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {section.description}
                    </p>

                    {/* Arrow indicator */}
                    <motion.div
                      className="mt-6 text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="inline-block text-sm font-medium">
                        {t.sections.explore} →
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer separator */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
        </div>
      </section>
    </div>
  );
}
