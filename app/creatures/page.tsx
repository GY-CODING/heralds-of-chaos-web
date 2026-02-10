import { creatureService } from "@/lib/services/creature.service";
import { CreaturesPageContent } from "@/components/pages/creatures-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creatures | Heralds of Chaos",
  description:
    "Discover the mythical beasts and fantastic creatures of Norse mythology",
};

/**
 * Página que muestra todas las criaturas de la mitología nórdica
 */
export default async function CreaturesPage() {
  const creatures = await creatureService.getAllCreatures();

  return <CreaturesPageContent creatures={creatures} />;
}
