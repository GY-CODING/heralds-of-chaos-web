import { placeService } from "@/lib/services/place.service";
import { PlacesPageContent } from "@/components/pages/places-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places | Heralds of Chaos",
  description:
    "Visit the halls, fortresses, and sacred sites of Norse mythology",
};

/**
 * Página que muestra todos los lugares de la mitología nórdica
 */
export default async function PlacesPage() {
  const places = await placeService.getAllPlaces();

  return <PlacesPageContent places={places} />;
}
