"use client";

import { Check, Info } from "lucide-react";
import { PosterCard, Section, type Ink } from "@/components/ui/section";
import { Doodle, type DoodleName } from "@/components/ui/doodle";
import { siteConfig } from "@/lib/site-config";

function List({
  doodle,
  title,
  items,
  ink,
}: {
  doodle: DoodleName;
  title: string;
  items: readonly string[];
  ink: Ink;
}) {
  return (
    <PosterCard ink={ink} className="flex h-full flex-col p-7 text-left sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-24 items-end justify-center">
          <Doodle name={doodle} size={86} />
        </span>
        <h3 className="mt-3 font-display uppercase text-2xl text-brand-blue-ink">
          {title}
        </h3>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check
              className="mt-1 h-4 w-4 shrink-0 text-brand-olive-ink"
              strokeWidth={2.25}
            />
            <span className="leading-relaxed text-foreground/90">{item}</span>
          </li>
        ))}
      </ul>
    </PosterCard>
  );
}

export function FoodDrinkSection() {
  const { foodAndDrink } = siteConfig;

  return (
    <Section
      id="food"
      eyebrow="What we'll be eating"
      title="Food & drink"
      description={foodAndDrink.intro}
      doodle="iceCream"
      containerClassName="max-w-4xl"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <List
          doodle="croissant"
          title="Sorted for you"
          items={foodAndDrink.covered}
          ink="gold"
        />
        <List
          doodle="wineBottle"
          title="You'll need to cover"
          items={foodAndDrink.byo}
          ink="rose"
        />
      </div>

      <p className="mx-auto mt-8 flex max-w-lg items-start gap-3 rounded-3xl border-2 border-dashed border-brand-blue/50 bg-card p-5 text-left text-sm text-foreground/90">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue"
          strokeWidth={1.75}
        />
        <span>{foodAndDrink.note}</span>
      </p>
    </Section>
  );
}
