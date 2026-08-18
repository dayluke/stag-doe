"use client";

import { ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { siteConfig, type Accommodation } from "@/lib/site-config";

function AccommodationCard({ item }: { item: Accommodation }) {
  const hasUrl = Boolean(item.url && item.url !== "#");
  return (
    <article className="mx-auto flex h-full w-full max-w-md flex-col rounded-3xl border border-border bg-card p-7 shadow-sm">
      <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {item.distance}
      </p>
      <p className="mt-5 text-foreground/90 leading-relaxed">
        {item.description}
      </p>
      {(hasUrl || item.priceRange) && (
        <div className="mt-auto pt-6 flex flex-wrap items-center justify-center gap-3">
          {hasUrl ? (
            <Button asChild variant="outline">
              <a href={item.url} target="_blank" rel="noreferrer">
                Book here
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
          {item.priceRange ? (
            <span className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground">
              {item.priceRange}
            </span>
          ) : null}
        </div>
      )}
    </article>
  );
}

export function AccommodationSection() {
  return (
    <Section
      id="accommodation"
      eyebrow="Where to rest your head"
      title="Places to stay"
      description="A handful of options at varying budgets and distances from the venue."
      containerClassName="max-w-5xl"
    >
      <div className="relative px-12 sm:px-16">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {siteConfig.accommodation.map((item) => (
              <CarouselItem
                key={item.name}
                className="sm:basis-1/2 lg:basis-1/2"
              >
                <AccommodationCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 sm:-left-14" />
          <CarouselNext className="-right-12 sm:-right-14" />
          <CarouselDots />
        </Carousel>
      </div>
    </Section>
  );
}
