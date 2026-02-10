import { notFound } from "next/navigation";
import { characterService } from "@/lib/services/character.service";
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

  return <CharacterDetailContent character={character} />;
}
