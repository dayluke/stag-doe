"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";

const items = [
  {
    icon: Calendar,
    label: "The Date",
    value: siteConfig.dateHuman,
  },
  {
    icon: Clock,
    label: "The Time",
    value: `${siteConfig.timeArrival} – Ceremony at ${siteConfig.timeCeremony}`,
  },
  {
    icon: MapPin,
    label: "The Place",
    value: siteConfig.locationShort,
  },
];

export function DetailsSection() {
  return (
    <Section
      id="details"
      eyebrow="The essentials"
      title="Save the date"
      description="We can’t wait to celebrate with you. Here are the need-to-knows."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/60 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {label}
            </span>
            <span className="font-display text-xl leading-snug text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
