import { NextRequest, NextResponse } from "next/server";
import { itemService } from "@/lib/services/item.service";

/**
 * GET /api/items
 * Obtiene todos los ítems o filtra por parámetros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    // Si hay filtros, buscar con filtros
    if (type || search) {
      const items = await itemService.searchItems({
        type: type || undefined,
        search: search || undefined,
      });
      return NextResponse.json(items);
    }

    // Si no hay filtros, obtener todos
    const items = await itemService.getAllItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("[GET /api/items] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}
