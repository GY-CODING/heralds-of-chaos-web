import { HomePageContent, type CodexSample } from "@/components/pages/home-page-content";
import { characterService } from "@/lib/services/character.service";
import { creatureService } from "@/lib/services/creature.service";
import { itemService } from "@/lib/services/item.service";
import { placeService } from "@/lib/services/place.service";
import { worldService } from "@/lib/services/world.service";
import type { BaseEntity } from "@/types/common.types";

/** Cuántas piezas con arte lleva cada tira del códice. */
const STRIP = 4;

/** De la entidad entera solo viaja al cliente lo que pinta la tira. */
function toSamples(entities: BaseEntity[]): CodexSample[] {
  return entities.map((e) => ({ identifier: e.identifier, image: e.image }));
}

/**
 * Home: todo lo que se ve sale de la base de datos — los diez reinos con su runa y su color,
 * cuántos personajes vive cada reino, el número de entradas de cada colección y una muestra
 * con arte de cada una. Nada escrito a mano.
 */
export default async function HomePage() {
  const [
    worlds,
    characters,
    creatures,
    items,
    places,
    census,
    charactersArt,
    creaturesArt,
    itemsArt,
    placesArt,
    worldsArt,
  ] = await Promise.all([
    worldService.getAllWorlds(),
    characterService.countCharacters(),
    creatureService.countCreatures(),
    itemService.countItems(),
    placeService.countPlaces(),
    characterService.getWorldCensus(),
    characterService.getIllustrated(STRIP),
    creatureService.getIllustrated(STRIP),
    itemService.getIllustrated(STRIP),
    placeService.getIllustrated(STRIP),
    worldService.getIllustrated(STRIP),
  ]);

  return (
    <HomePageContent
      worlds={worlds}
      counts={{
        characters,
        creatures,
        items,
        worlds: worlds.length,
        places,
      }}
      census={census}
      strips={{
        characters: toSamples(charactersArt),
        creatures: toSamples(creaturesArt),
        items: toSamples(itemsArt),
        places: toSamples(placesArt),
        worlds: toSamples(worldsArt),
      }}
    />
  );
}
