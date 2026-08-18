"use client";

import { MapPin, Clock, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function VenueSection() {
  return (
    <Section
      id="venue"
      eyebrow="Getting there"
      title={siteConfig.venueShortName}
      description={`Please aim to arrive by ${siteConfig.timeArrival} so we can start the ceremony on time.`}
      tone="soft"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/60 text-primary">
          <MapPin className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <p className="font-display text-xl leading-snug text-foreground">
          {siteConfig.venueAddress}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" strokeWidth={1.5} />
          <span>
            Arrive from {siteConfig.timeArrival} · Ceremony {siteConfig.timeCeremony}
          </span>
        </div>
        <Button asChild variant="outline">
          <a href={siteConfig.venueMapUrl} target="_blank" rel="noreferrer">
            Open in maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Section>
  );
}
