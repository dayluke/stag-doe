"use client";

import Image from "next/image";
import { Calendar, HandCoins, MapPin } from "lucide-react";
import {
  InkBadge,
  PosterCard,
  Section,
  type Ink,
} from "@/components/ui/section";
import { Sparkle } from "@/components/ui/doodle";
import { WavyFrame } from "@/components/ui/wavy-frame";
import { siteConfig } from "@/lib/site-config";
import { assetPath } from "@/lib/utils";

const items: {
  icon: typeof Calendar;
  label: string;
  value: string;
  ink: Ink;
}[] = [
  {
    icon: Calendar,
    label: "The dates",
    value: siteConfig.dateHuman,
    ink: "rose",
  },
  {
    icon: MapPin,
    label: "The place",
    value: siteConfig.locationShort,
    ink: "olive",
  },
  {
    icon: HandCoins,
    label: "Your contribution",
    value: siteConfig.costs.perPerson,
    ink: "gold",
  },
];

export function DetailsSection() {
  return (
    <Section
      id="details"
      eyebrow="The essentials"
      title="Save the weekend"
      description={`From ${siteConfig.arriveHuman}, away again by ${siteConfig.leaveHuman}.`}
      containerClassName="max-w-5xl"
    >
      <div className="mx-auto grid max-w-4xl items-center gap-10 sm:gap-12 md:grid-cols-2">
        {/* The photo, hung in the same wavy frame as the invite. */}
        <div className="relative mx-auto w-full max-w-sm">
          <WavyFrame
            color="var(--brand-rose)"
            amplitude={7}
            period={78}
            radius={40}
            strokeWidth={4}
            fill="var(--card)"
          />
          <Sparkle size={26} className="-right-2 -top-2 z-10" />
          <div className="relative m-8 aspect-[4/5] overflow-hidden rounded-[1.75rem]">
            <Image
              src={assetPath(siteConfig.heroImageUrl)}
              alt={siteConfig.heroImageAlt}
              fill
              priority
              sizes="(max-width: 768px) 84vw, 24rem"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-md gap-4">
          {items.map(({ icon: Icon, label, value, ink }) => (
            <PosterCard
              key={label}
              ink={ink}
              className="flex items-center gap-4 text-left"
            >
              <InkBadge ink={ink}>
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </InkBadge>
              <span className="flex flex-col gap-1">
                <span className="eyebrow text-muted-foreground">{label}</span>
                <span className="font-display uppercase text-xl leading-tight text-brand-blue-ink">
                  {value}
                </span>
              </span>
            </PosterCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
