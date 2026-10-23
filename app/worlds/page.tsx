import { WorldsPageContent } from "@/components/pages/worlds-page-content";
import { characterService } from "@/lib/services/character.service";
import { worldService } from "@/lib/services/world.service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worlds | Heralds of Chaos",
  description: "Journey through the nine realms of Norse cosmology",
};

/** Los diez reinos, con cuánta gente vive en cada uno. */
export default async function WorldsPage() {
  const [worlds, census] = await Promise.all([
    worldService.getAllWorlds(),
    characterService.getWorldCensus(),
  ]);

  return <WorldsPageContent worlds={worlds} census={census} />;
}
