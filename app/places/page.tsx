import { PlacesPageContent } from "@/components/pages/places-page-content";
import { placeService } from "@/lib/services/place.service";
import { worldService } from "@/lib/services/world.service";
import type { Metadata } from "next";
import type { PlaceWithWorld } from "@/types/place.types";

export const metadata: Metadata = {
  title: "Places | Heralds of Chaos",
  description: "Visit the halls, fortresses, and sacred sites of Norse mythology",
};

/**
 * Los lugares, cada uno con su reino.
 *
 * El lugar no guarda a qué reino pertenece; es el reino el que lleva su lista de lugares, así que
 * aquí se le da la vuelta a esa lista una sola vez y cada lugar sale ya con su runa y su color.
 */
export default async function PlacesPage() {
  const [places, worlds] = await Promise.all([
    placeService.getAllPlaces(),
    worldService.getAllWorlds(),
  ]);

  const worldOfPlace = new Map<string, (typeof worlds)[number]>();
  for (const world of worlds) {
    for (const placeId of world.places) {
      if (typeof placeId === "string") worldOfPlace.set(placeId, world);
    }
  }

  const placesWithWorld: PlaceWithWorld[] = places.map((place) => {
    const world = worldOfPlace.get(place._id);
    return world
      ? {
          ...place,
          world: {
            identifier: world.identifier,
            name: world.name,
            mainColor: world.mainColor,
            detailedIcon: world.detailedIcon,
          },
        }
      : place;
  });

  return <PlacesPageContent places={placesWithWorld} worlds={worlds} />;
}
