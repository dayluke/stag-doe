"use client";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Doodle, type DoodleName } from "@/components/ui/doodle";
import { PosterCard, Section } from "@/components/ui/section";
import { WavyRule } from "@/components/ui/wavy-frame";
import {
  siteConfig,
  type ItineraryDay,
  type ItineraryIcon,
} from "@/lib/site-config";

/** One hand-drawn icon per event — the whole weekend is covered. */
const DOODLES: Record<ItineraryIcon, DoodleName> = {
  arrival: "suitcase",
  movie: "movieTicket",
  bike: "bicycle",
  pub: "wineTable",
  cocktails: "cocktail",
  pizza: "pizza",
  waterpark: "pool",
  bbq: "barbeque",
  "murder-mystery": "cards",
  "tidy-up": "dustpan",
  departure: "suitcase",
};

function DayCard({ day }: { day: ItineraryDay }) {
  return (
    <PosterCard
      ink="blue"
      className="mx-auto flex h-full w-full max-w-xl flex-col justify-center p-7 sm:p-9"
    >
      <div className="flex flex-col items-center">
        <h3 className="font-display uppercase text-3xl text-brand-blue">
          {day.day}
        </h3>
        {day.subtitle ? (
          <p className="eyebrow mt-2 text-brand-rose-ink">{day.subtitle}</p>
        ) : null}
        <WavyRule
          color="var(--brand-gold)"
          amplitude={4}
          period={40}
          strokeWidth={3}
          className="mt-3 max-w-[7rem]"
        />
      </div>

      <ol className="mt-7 space-y-5">
        {day.events.map((event) => (
          <li
            key={`${event.time}-${event.title}`}
            // 4.5rem clears "10:00 AM" on one line — it measures ~65px.
            className="grid grid-cols-[4.5rem_3.5rem_1fr] items-center gap-3 text-left sm:gap-4"
          >
            <span className="whitespace-nowrap font-display text-right text-base uppercase text-brand-rose-ink">
              {event.time}
            </span>
            <span className="flex h-14 w-14 items-center justify-center">
              <Doodle name={DOODLES[event.icon]} size={56} />
            </span>
            <h4 className="font-display uppercase text-lg leading-tight text-foreground">
              {event.title}
            </h4>
          </li>
        ))}
      </ol>
    </PosterCard>
  );
}

export function ItinerarySection() {
  return (
    <Section
      id="itinerary"
      eyebrow="What will we be doing"
      title="The itinerary"
      description="Swipe between the days to see how the weekend unfolds."
      doodle="movieTicket"
      tone="soft"
      containerClassName="max-w-4xl"
    >
      <div className="relative sm:px-16">
        <Carousel opts={{ loop: true, align: "center" }}>
          <CarouselContent>
            {siteConfig.itinerary.map((day) => (
              <CarouselItem key={day.id}>
                <DayCard day={day} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex sm:-left-14" />
          <CarouselNext className="hidden sm:inline-flex sm:-right-14" />
          <CarouselDots />
        </Carousel>
      </div>
    </Section>
  );
}
