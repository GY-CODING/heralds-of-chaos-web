import { notFound } from "next/navigation";
import { creatureService } from "@/lib/services/creature.service";
import { CreatureDetailContent } from "@/components/pages/creature-detail-content";
import type { Metadata } from "next";

interface CreatureDetailPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export async function generateMetadata({
  params,
}: CreatureDetailPageProps): Promise<Metadata> {
  const { identifier } = await params;
  const creature = await creatureService.getCreatureByIdentifier(identifier);

  if (!creature) {
    return {
      title: "Creature Not Found | Heralds of Chaos",
    };
  }

  return {
    title: `${creature.name.en} | Heralds of Chaos`,
    description: creature.description.en,
  };
}

export default async function CreatureDetailPage({
  params,
}: CreatureDetailPageProps) {
  const { identifier } = await params;
  const creature = await creatureService.getCreatureByIdentifier(identifier);

  if (!creature) {
    notFound();
  }

  return <CreatureDetailContent creature={creature} />;
}
