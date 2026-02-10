import { NextRequest, NextResponse } from "next/server";
import { worldService } from "@/lib/services/world.service";

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

/**
 * GET /api/worlds/[identifier]
 * Obtiene un mundo por su identifier
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

    const world = await worldService.getWorldByIdentifier(identifier);

    if (!world) {
      return NextResponse.json({ error: "World not found" }, { status: 404 });
    }

    return NextResponse.json(world);
  } catch (error) {
    console.error("[GET /api/worlds/[identifier]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch world" },
      { status: 500 },
    );
  }
}
