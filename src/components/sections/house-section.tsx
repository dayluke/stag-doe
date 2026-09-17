"use client";

import Image from "next/image";
import { BedDouble, Check, ExternalLink, KeyRound } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { InkBadge, PosterCard, Section } from "@/components/ui/section";
import { Doodle } from "@/components/ui/doodle";
import { siteConfig, type HousePhoto, type Room } from "@/lib/site-config";
import { assetPath } from "@/lib/utils";

function RoomCard({ room }: { room: Room }) {
  return (
    // The card fills its slide: below `sm:` that's the full column, and a max
    // width there left arrow-sized gutters behind once the arrows had gone.
    // At `sm:` the 2-up slide is narrower than any such cap anyway.
    <PosterCard
      ink="rose"
      className="flex h-full w-full flex-col items-center text-center"
    >
      {/* A photo of the room where there is one, otherwise the bed stamp. */}
      <InkBadge
        ink="rose"
        className={room.image ? "relative h-38 w-38 overflow-hidden" : undefined}
      >
        {room.image ? (
          <Image
            src={assetPath(room.image)}
            alt={room.name}
            fill
            sizes="7rem"
            className="object-cover"
          />
        ) : (
          <BedDouble className="h-5 w-5" strokeWidth={1.75} />
        )}
      </InkBadge>
      <h3 className="mt-4 font-display uppercase text-2xl leading-tight text-brand-blue-ink">
        {room.name}
      </h3>
      <p className="eyebrow mt-2 text-brand-rose-ink">{room.sleeps}</p>
      {room.note ? (
        <p className="mt-4 leading-relaxed text-muted-foreground">{room.note}</p>
      ) : null}
    </PosterCard>
  );
}

/** A photo in its own frame — no caption, the picture is the point. */
function PhotoCard({ photo }: { photo: HousePhoto }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-2 border-brand-blue bg-card shadow-paper-blue">
      <Image
        src={assetPath(photo.src)}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 92vw, 28rem"
        className="object-cover"
      />
    </div>
  );
}

export function HouseSection() {
  const { house } = siteConfig;
  const hasListing = Boolean(house.listingUrl);

  return (
    <Section
      id="house"
      eyebrow="Where we're staying"
      title={house.name}
      description={house.tagline}
      doodle="house"
      containerClassName="max-w-5xl"
    >
      <div className="relative mb-8 sm:px-16">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {house.gallery.map((photo) => (
              <CarouselItem key={photo.src} className="sm:basis-1/2">
                <PhotoCard photo={photo} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex sm:-left-14" />
          <CarouselNext className="hidden sm:inline-flex sm:-right-14" />
          <CarouselDots />
        </Carousel>
      </div>

      <PosterCard
        ink="blue"
        className="mx-auto flex max-w-2xl flex-col items-center gap-6 p-8 text-center sm:p-10"
      >
        <p className="leading-relaxed text-foreground/90">{house.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-olive-ink" strokeWidth={1.75} />
            In from {siteConfig.arriveHuman}
          </span>
          <span className="flex items-center gap-2">
            <KeyRound
              className="h-4 w-4 rotate-180 text-brand-rose-ink"
              strokeWidth={1.75}
            />
            Out by {siteConfig.leaveHuman}
          </span>
        </div>
        {hasListing ? (
          <Button asChild variant="outline">
            <a href={house.listingUrl} target="_blank" rel="noreferrer">
              See the listing
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </PosterCard>

      <div className="relative mt-12 sm:px-16">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {house.rooms.map((room) => (
              <CarouselItem key={room.name} className="sm:basis-1/2">
                <RoomCard room={room} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex sm:-left-14" />
          <CarouselNext className="hidden sm:inline-flex sm:-right-14" />
          <CarouselDots />
        </Carousel>
      </div>

      <PosterCard
        ink="olive"
        className="mx-auto mt-12 max-w-xl p-8 text-left tilt-r"
      >
        <div className="flex flex-col items-center">
          <Doodle name="snooker" size={62} />
          <h3 className="mt-3 font-display uppercase text-2xl text-brand-blue-ink">
            What&apos;s there
          </h3>
        </div>
        <ul className="mt-6 space-y-3">
          {house.provided.map((item) => (
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
    </Section>
  );
}
