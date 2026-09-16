"use client";

import {
  Backpack,
  Footprints,
  Layers,
  ShowerHead,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  InkBadge,
  PosterCard,
  Section,
  type Ink,
} from "@/components/ui/section";
import { Doodle, type DoodleName } from "@/components/ui/doodle";
import { siteConfig, type PackingIcon } from "@/lib/site-config";

const DOODLES: Partial<Record<PackingIcon, DoodleName>> = {
  swim: "pool",
  bike: "bicycle",
  costume: "cards",
  drink: "wineBottle",
};

const GLYPHS: Partial<Record<PackingIcon, LucideIcon>> = {
  shoes: Footprints,
  towel: ShowerHead,
  wallet: Wallet,
  misc: Layers,
};

const inks: Ink[] = ["rose", "blue", "olive", "gold"];

export function WhatToBringSection() {
  const { packing } = siteConfig;

  return (
    <Section
      id="what-to-bring"
      eyebrow="Pack accordingly"
      title="What to bring"
      description={packing.intro}
      doodle="suitcase"
      tone="soft"
      containerClassName="max-w-4xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {packing.items.map((item, i) => {
          const doodle = DOODLES[item.icon];
          const Glyph = GLYPHS[item.icon] ?? Backpack;
          const ink = inks[i % inks.length];
          return (
            <PosterCard
              key={item.title}
              ink={ink}
              className="flex items-start gap-4 text-left"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                {doodle ? (
                  <Doodle name={doodle} size={48} />
                ) : (
                  <InkBadge ink={ink}>
                    <Glyph className="h-5 w-5" strokeWidth={1.75} />
                  </InkBadge>
                )}
              </span>
              <div>
                <h3 className="font-display uppercase text-xl leading-tight text-brand-blue-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </PosterCard>
          );
        })}
      </div>
    </Section>
  );
}
