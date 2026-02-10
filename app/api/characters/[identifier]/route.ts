import { NextRequest, NextResponse } from "next/server";
import { characterService } from "@/lib/services/character.service";

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

/**
 * GET /api/characters/[identifier]
 * Obtiene un personaje por su identifier
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { identifier } = await context.params;

    if (!identifier) {
      return NextResponse.json(
        { error: "Identifier is required" },
        { status: 400 },
      );
    }

    const character =
      await characterService.getCharacterByIdentifier(identifier);

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("[GET /api/characters/[identifier]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch character" },
      { status: 500 },
    );
  }
}
