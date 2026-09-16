"use client";

import { CarFront, ExternalLink, MapPin, TrainFront, Users } from "lucide-react";
import {
  InkBadge,
  PosterCard,
  Section,
  type Ink,
} from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { siteConfig, type TravelIcon } from "@/lib/site-config";

const icons: Record<TravelIcon, typeof CarFront> = {
  car: CarFront,
  train: TrainFront,
  lift: Users,
};

const inks: Ink[] = ["blue", "rose", "olive"];

export function TravelSection() {
  const { travel } = siteConfig;

  return (
    <Section
      id="travel"
      eyebrow="Getting there"
      title="How to find us"
      description={travel.intro}
      doodle="bicycle"
      tone="soft"
      containerClassName="max-w-4xl"
    >
      <PosterCard
        ink="rose"
        className="mx-auto flex max-w-xl flex-col items-center gap-5 p-8 text-center"
      >
        <InkBadge ink="rose">
          <MapPin className="h-5 w-5" strokeWidth={1.75} />
        </InkBadge>
        <p className="font-display uppercase text-xl leading-snug text-brand-blue-ink">
          {travel.address}
        </p>
        <Button asChild variant="outline">
          <a href={travel.mapUrl} target="_blank" rel="noreferrer">
            Open in maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </PosterCard>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {travel.options.map((option, i) => {
          const Icon = icons[option.icon];
          const ink = inks[i % inks.length];
          return (
            <PosterCard
              key={option.title}
              ink={ink}
              className="flex flex-col items-center gap-3 text-center"
            >
              <InkBadge ink={ink}>
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </InkBadge>
              <h3 className="font-display uppercase text-xl text-brand-blue-ink">
                {option.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {option.description}
              </p>
            </PosterCard>
          );
        })}
      </div>
    </Section>
  );
}
