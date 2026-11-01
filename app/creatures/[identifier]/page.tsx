import { linkDescription } from "@/lib/services/link.service";
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

  // Otras criaturas con arte, para seguir tirando del hilo.
  const others = (await creatureService.getIllustrated(7))
    .filter((c) => c.identifier !== creature.identifier)
    .slice(0, 6);

  const linked = await linkDescription(creature.description, { kind: "creature", identifier: creature.identifier });

  return <CreatureDetailContent linked={linked} creature={creature} others={others} />;
}
