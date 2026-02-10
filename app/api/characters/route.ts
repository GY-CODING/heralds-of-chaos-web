import { NextRequest, NextResponse } from "next/server";
import { characterService } from "@/lib/services/character.service";

/**
 * GET /api/characters
 * Obtiene todos los personajes o filtra por parámetros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const worldId = searchParams.get("worldId");
    const race = searchParams.get("race");
    const search = searchParams.get("search");

    // Si hay filtros, buscar con filtros
    if (worldId || race || search) {
      const characters = await characterService.searchCharacters({
        worldId: worldId || undefined,
        race: race || undefined,
        search: search || undefined,
      });
      return NextResponse.json(characters);
    }

    // Si no hay filtros, obtener todos
    const characters = await characterService.getAllCharacters();
    return NextResponse.json(characters);
  } catch (error) {
    console.error("[GET /api/characters] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 },
    );
  }
}
