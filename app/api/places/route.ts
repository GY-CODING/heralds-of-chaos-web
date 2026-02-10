import { NextRequest, NextResponse } from "next/server";
import { placeService } from "@/lib/services/place.service";

/**
 * GET /api/places
 * Obtiene todos los lugares o filtra por parámetros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const worldId = searchParams.get("worldId");
    const search = searchParams.get("search");

    // Si hay filtros, buscar con filtros
    if (worldId || search) {
      const places = await placeService.searchPlaces({
        worldId: worldId || undefined,
        search: search || undefined,
      });
      return NextResponse.json(places);
    }

    // Si no hay filtros, obtener todos
    const places = await placeService.getAllPlaces();
    return NextResponse.json(places);
  } catch (error) {
    console.error("[GET /api/places] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 },
    );
  }
}
