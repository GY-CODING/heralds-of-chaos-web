"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Globe } from "lucide-react";

/**
 * Componente para cambiar entre tema claro y oscuro
 * Diseño épico inspirado en League of Legends Universe
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-12 w-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group overflow-hidden"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Shimmer effect on border */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-full border border-[var(--gold)] animate-pulse-slow" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-[var(--gold)] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />

      {/* Icons with smooth transition */}
      <div className="relative">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Sun className="w-5 h-5 text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(200,170,110,0.5)] transition-all duration-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Moon className="w-5 h-5 text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(200,170,110,0.5)] transition-all duration-300" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

/**
 * Componente para cambiar entre idiomas
 * Diseño épico inspirado en League of Legends Universe
 */
export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative h-12 px-4 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center gap-2 group overflow-hidden"
      aria-label={`Switch to ${language === "en" ? "Spanish" : "English"}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Shimmer effect on border */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-full border border-[var(--gold)] animate-pulse-slow" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-[var(--gold)] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />

      <motion.div
        key={`lang-${language}`}
        className="flex items-center gap-2 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Globe className="w-5 h-5 text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(200,170,110,0.5)] transition-all duration-300" />
        <span className="text-sm font-semibold text-[var(--gold)]">
          {language.toUpperCase()}
        </span>
      </motion.div>
    </motion.button>
  );
}
