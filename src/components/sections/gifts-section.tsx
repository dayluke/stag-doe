"use client";

import { Gift, ExternalLink, PlaneTakeoff } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

function pickGiftIcon(title: string) {
  if (/honeymoon/i.test(title)) return PlaneTakeoff;
  return Gift;
}

export function GiftsSection() {
  return (
    <Section
      id="gifts"
      eyebrow="If you insist"
      title="Gifts"
      description={siteConfig.gifts.intro}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {siteConfig.gifts.options.map((opt) => {
          const Icon = pickGiftIcon(opt.title);
          return (
          <div
            key={opt.title}
            className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/60 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h3 className="font-display text-2xl">{opt.title}</h3>
            <p className="text-foreground/90 leading-relaxed">
              {opt.description}
            </p>
            <Button asChild variant="outline">
              <a href={opt.url} target="_blank" rel="noreferrer">
                {opt.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          );
        })}
      </div>
    </Section>
  );
}
