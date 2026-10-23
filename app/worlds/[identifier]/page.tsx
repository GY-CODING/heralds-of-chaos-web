import { notFound } from "next/navigation";
import { worldService } from "@/lib/services/world.service";
import { characterService } from "@/lib/services/character.service";
import { placeService } from "@/lib/services/place.service";
import { WorldDetailContent } from "@/components/pages/world-detail-content";
import type { Metadata } from "next";

interface WorldDetailPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export async function generateMetadata({
  params,
}: WorldDetailPageProps): Promise<Metadata> {
  const { identifier } = await params;
  const world = await worldService.getWorldByIdentifier(identifier);

  if (!world) {
    return {
      title: "World Not Found | Heralds of Chaos",
    };
  }

  return {
    title: `${world.name.en} | Heralds of Chaos`,
    description: world.description.en,
  };
}

export default async function WorldDetailPage({
  params,
}: WorldDetailPageProps) {
  const { identifier } = await params;
  const world = await worldService.getWorldByIdentifier(identifier);

  if (!world) {
    notFound();
  }

  // Sus salones y cuánta gente vive en él.
  const placeIds = (world.places ?? []).filter(
    (id): id is string => typeof id === "string",
  );
  const [places, census] = await Promise.all([
    placeService.getByIds(placeIds.slice(0, 6)),
    characterService.getWorldCensus(),
  ]);

  return (
    <WorldDetailContent
      world={world}
      places={places}
      names={census[world._id] ?? 0}
    />
  );
}
