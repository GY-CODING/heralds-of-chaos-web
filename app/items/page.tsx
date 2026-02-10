import { itemService } from "@/lib/services/item.service";
import { ItemsPageContent } from "@/components/pages/items-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Items | Heralds of Chaos",
  description: "Examine the legendary weapons and artifacts of Norse mythology",
};

/**
 * Página que muestra todos los ítems de la mitología nórdica
 */
export default async function ItemsPage() {
  const items = await itemService.getAllItems();

  return <ItemsPageContent items={items} />;
}
