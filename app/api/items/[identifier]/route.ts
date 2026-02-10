import { NextRequest, NextResponse } from "next/server";
import { itemService } from "@/lib/services/item.service";

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

/**
 * GET /api/items/[identifier]
 * Obtiene un ítem por su identifier
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

    const item = await itemService.getItemByIdentifier(identifier);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("[GET /api/items/[identifier]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 },
    );
  }
}
