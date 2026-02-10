import { worldService } from "@/lib/services/world.service";
import { WorldsPageContent } from "@/components/pages/worlds-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worlds | Heralds of Chaos",
  description: "Journey through the nine realms of Norse cosmology",
};

/**
 * Página que muestra todos los mundos de la mitología nórdica
 */
export default async function WorldsPage() {
  const worlds = await worldService.getAllWorlds();

  return <WorldsPageContent worlds={worlds} />;
}
