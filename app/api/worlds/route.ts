import { NextRequest, NextResponse } from "next/server";
import { worldService } from "@/lib/services/world.service";

/**
 * GET /api/worlds
 * Obtiene todos los mundos
 */
export async function GET(request: NextRequest) {
  try {
    const worlds = await worldService.getAllWorlds();
    return NextResponse.json(worlds);
  } catch (error) {
    console.error("[GET /api/worlds] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch worlds" },
      { status: 500 },
    );
  }
}
