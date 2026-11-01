"use client";

import { useLanguage } from "@/hooks/use-language";
import type { LinkedDescription } from "@/lib/services/link.service";
import Link from "next/link";

/** Un párrafo cuyas menciones `[Nombre]` son enlaces a su ficha. */
export function LinkedText({ linked }: { linked: LinkedDescription }) {
  const { language } = useLanguage();
  const segments = linked.segments[language] ?? linked.segments.en;

  return (
    <>
      {segments.map((s, i) =>
        s.t === "link" ? (
          <Link
            key={i}
            href={s.href}
            className="underline decoration-[rgba(200,170,110,0.5)] underline-offset-4 transition-colors duration-300 hover:text-[var(--gold)] hover:decoration-[var(--gold)] focus-visible:text-[var(--gold)]"
          >
            {s.v}
          </Link>
        ) : (
          <span key={i}>{s.v}</span>
        ),
      )}
    </>
  );
}
