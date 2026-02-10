"use client";

import { useThemeEffect } from "@/hooks/use-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que inicializa el tema de la aplicación
 * Debe usarse en el layout raíz
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  useThemeEffect();

  return <>{children}</>;
}
