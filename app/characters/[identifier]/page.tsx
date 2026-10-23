import { notFound } from "next/navigation";
import { characterService } from "@/lib/services/character.service";
import { worldService } from "@/lib/services/world.service";
import { CharacterDetailContent } from "@/components/pages/character-detail-content";
import type { Metadata } from "next";

interface CharacterDetailPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export async function generateMetadata({
  params,
}: CharacterDetailPageProps): Promise<Metadata> {
  const { identifier } = await params;
  const character = await characterService.getCharacterByIdentifier(identifier);

  if (!character) {
    return {
      title: "Character Not Found | Heralds of Chaos",
    };
  }

  return {
    title: `${character.name.en} | Heralds of Chaos`,
    description: character.description.en,
  };
}

/**
 * Página de detalle de un personaje
 */
export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { identifier } = await params;
  const character = await characterService.getCharacterByIdentifier(identifier);

  if (!character) {
    notFound();
  }

  // El reino del personaje y otros nombres que viven en él: la ficha tiene que llevar a algún
  // sitio. La referencia al mundo llega serializada como string.
  const worldId = typeof character.world === "string" ? character.world : "";
  const [worlds, companions] = await Promise.all([
    worldService.getAllWorlds(),
    characterService.getCompanions(worldId, character.identifier, 6),
  ]);
  const world = worlds.find((w) => w._id === worldId) ?? null;

  return (
    <CharacterDetailContent
      character={character}
      world={world}
      companions={companions}
    />
  );
}
