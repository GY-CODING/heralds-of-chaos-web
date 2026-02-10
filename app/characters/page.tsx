import { characterService } from "@/lib/services/character.service";
import { worldService } from "@/lib/services/world.service";
import { CharactersPageContent } from "@/components/pages/characters-page-content";
import type { Metadata } from "next";
import type { Character, CharacterWithWorld } from "@/types/character.types";
import type { World } from "@/types/world.types";

export const metadata: Metadata = {
  title: "Characters | Heralds of Chaos",
  description: "Explore the legendary characters of Norse mythology",
};

/**
 * Mapea characters con sus worlds correspondientes
 */
function mapCharactersWithWorlds(
  characters: Character[],
  worlds: World[],
): CharacterWithWorld[] {
  // Crear un mapa de worlds por _id (string) para búsqueda rápida
  const worldsMap = new Map(worlds.map((world) => [world._id, world]));

  return characters.map((character) => {
    // La serialización convierte world DBRef a string directamente
    // world puede ser string o { $id: { $oid: string } }
    let worldId: string | undefined;

    if (typeof character.world === "string") {
      // Caso simple: ya es un string
      worldId = character.world;
    } else if (character.world?.$id?.$oid) {
      // Caso DBRef no serializado
      worldId = character.world.$id.$oid;
    }

    if (!worldId) {
      console.warn(`No world reference for character ${character.identifier}`);
      return {
        ...character,
        world: {
          identifier: "unknown",
          name: { en: "Unknown", es: "Desconocido", de: "Unbekannt" },
          mainColor: "#888888",
          image: "",
        },
      };
    }

    const world = worldsMap.get(worldId);

    if (!world) {
      console.warn(`World not found for character ${character.identifier}`);
      // Retornar con datos de mundo vacíos
      return {
        ...character,
        world: {
          identifier: "unknown",
          name: { en: "Unknown", es: "Desconocido", de: "Unbekannt" },
          mainColor: "#888888",
          image: "",
        },
      };
    }

    return {
      ...character,
      world: {
        identifier: world.identifier,
        name: world.name,
        mainColor: world.mainColor,
        image: world.image,
      },
    };
  });
}

/**
 * Página que muestra todos los personajes de la mitología nórdica
 */
export default async function CharactersPage() {
  const [characters, worlds] = await Promise.all([
    characterService.getAllCharacters(),
    worldService.getAllWorlds(),
  ]);

  // Mapear characters con sus worlds
  const charactersWithWorlds = mapCharactersWithWorlds(characters, worlds);

  return <CharactersPageContent characters={charactersWithWorlds} />;
}
