import { notFound } from "next/navigation";
import { itemService } from "@/lib/services/item.service";
import { ItemDetailContent } from "@/components/pages/item-detail-content";
import type { Metadata } from "next";

interface ItemDetailPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export async function generateMetadata({
  params,
}: ItemDetailPageProps): Promise<Metadata> {
  const { identifier } = await params;
  const item = await itemService.getItemByIdentifier(identifier);

  if (!item) {
    return {
      title: "Item Not Found | Heralds of Chaos",
    };
  }

  return {
    title: `${item.name.en} | Heralds of Chaos`,
    description: item.description.en,
  };
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { identifier } = await params;
  const item = await itemService.getItemByIdentifier(identifier);

  if (!item) {
    notFound();
  }

  return <ItemDetailContent item={item} />;
}
