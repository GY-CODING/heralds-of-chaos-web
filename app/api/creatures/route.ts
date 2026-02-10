import { NextRequest, NextResponse } from "next/server";
import { creatureService } from "@/lib/services/creature.service";

/**
 * GET /api/creatures
 * Obtiene todas las criaturas o filtra por parámetros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const race = searchParams.get("race");
    const search = searchParams.get("search");

    // Si hay filtros, buscar con filtros
    if (race || search) {
      const creatures = await creatureService.searchCreatures({
        race: race || undefined,
        search: search || undefined,
      });
      return NextResponse.json(creatures);
    }

    // Si no hay filtros, obtener todas
    const creatures = await creatureService.getAllCreatures();
    return NextResponse.json(creatures);
  } catch (error) {
    console.error("[GET /api/creatures] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch creatures" },
      { status: 500 },
    );
  }
}
