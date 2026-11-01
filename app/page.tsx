import { HomePageContent } from "@/components/pages/home-page-content";
import { NOT_A_REALM } from "@/constants/filters.constants";
import { characterService } from "@/lib/services/character.service";
import { getCodexBooks } from "@/lib/services/codex.service";
import { worldService } from "@/lib/services/world.service";

/**
 * Home: todo lo que se ve sale de la base de datos — los reinos con su runa y su color, cuántos
 * personajes vive cada reino y los tres libros del códice. Nada escrito a mano.
 */
export default async function HomePage() {
  const [worlds, census] = await Promise.all([
    worldService.getAllWorlds(),
    characterService.getWorldCensus(),
  ]);
  const books = await getCodexBooks(
    worlds.filter((w) => !NOT_A_REALM.includes(w.identifier)),
    census,
  );

  return <HomePageContent worlds={worlds} census={census} books={books} />;
}
