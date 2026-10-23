"use client";

/**
 * El selector de idioma, grabado como el resto de la barra.
 *
 * Hereda el color de la cabecera (`--bar-fg`) en vez de fijar uno: arriba del todo la barra es
 * transparente sobre la portada y el texto va en hueso; al bajar es cristal y el texto va en el
 * color de la interfaz.
 *
 * Aquí vivía también el botón de tema. Ya no hay tema: la web es oscura y punto.
 */

import { useLanguage } from "@/hooks/use-language";

/* La cabecera fija `--bar-fg` / `--bar-line` / `--bar-wash` según esté arriba del todo (sobre la
   portada negra) o ya bajada (cristal del tema). Fuera de la barra valen los de reserva. */
const BUTTON =
  "inline-flex h-10 items-center justify-center rounded-lg border px-3 border-[var(--bar-line,rgba(200,170,110,0.3))] text-[var(--bar-fg,currentColor)] transition-[transform,background-color,border-color] duration-200 ease-pop hover:border-[var(--gold)] hover:bg-[var(--bar-wash,rgba(200,170,110,0.1))] active:scale-95";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    // El rótulo visible va oculto a la asistencia y el nombre completo en un `sr-only`: si no,
    // el nombre accesible ("Cambiar a español") no contiene al texto que se ve ("EN").
    <button
      type="button"
      onClick={toggleLanguage}
      className={`${BUTTON} display text-[13px] tracking-[0.1em]`}
    >
      <span aria-hidden>{language === "en" ? "EN" : "ES"}</span>
      <span className="sr-only">
        {language === "en" ? "Cambiar a español" : "Switch to English"}
      </span>
    </button>
  );
}
