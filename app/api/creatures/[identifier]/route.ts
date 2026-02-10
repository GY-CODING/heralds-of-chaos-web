import { NextRequest, NextResponse } from "next/server";
import { creatureService } from "@/lib/services/creature.service";

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

/**
 * GET /api/creatures/[identifier]
 * Obtiene una criatura por su identifier
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

    const creature = await creatureService.getCreatureByIdentifier(identifier);

    if (!creature) {
      return NextResponse.json(
        { error: "Creature not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(creature);
  } catch (error) {
    console.error("[GET /api/creatures/[identifier]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch creature" },
      { status: 500 },
    );
  }
}
