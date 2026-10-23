import { notFound } from "next/navigation";
import { placeService } from "@/lib/services/place.service";
import { worldService } from "@/lib/services/world.service";
import { PlaceDetailContent } from "@/components/pages/place-detail-content";
import type { Metadata } from "next";

interface PlaceDetailPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export async function generateMetadata({
  params,
}: PlaceDetailPageProps): Promise<Metadata> {
  const { identifier } = await params;
  const place = await placeService.getPlaceByIdentifier(identifier);

  if (!place) {
    return {
      title: "Place Not Found | Heralds of Chaos",
    };
  }

  return {
    title: `${place.name.en} | Heralds of Chaos`,
    description: place.description.en,
  };
}

export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps) {
  const { identifier } = await params;
  const place = await placeService.getPlaceByIdentifier(identifier);

  if (!place) {
    notFound();
  }

  // Los demás salones del mismo reino.
  const worlds = await worldService.getAllWorlds();
  const world = worlds.find((w) => w.identifier === place.world?.identifier);
  const neighbourIds = (world?.places ?? [])
    .filter((id): id is string => typeof id === "string" && id !== place._id)
    .slice(0, 6);
  const neighbours = await placeService.getByIds(neighbourIds);

  return <PlaceDetailContent place={place} neighbours={neighbours} />;
}
