import { notFound } from "next/navigation";
import { placeService } from "@/lib/services/place.service";
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

  return <PlaceDetailContent place={place} />;
}
