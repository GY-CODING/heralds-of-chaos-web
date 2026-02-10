import { NextRequest, NextResponse } from "next/server";
import { placeService } from "@/lib/services/place.service";

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

/**
 * GET /api/places/[identifier]
 * Obtiene un lugar por su identifier
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

    const place = await placeService.getPlaceByIdentifier(identifier);

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error("[GET /api/places/[identifier]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place" },
      { status: 500 },
    );
  }
}
