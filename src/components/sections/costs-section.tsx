"use client";

import { Banknote, ExternalLink, House, X } from "lucide-react";
import {
  InkBadge,
  PosterCard,
  Section,
  type Ink,
} from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Doodle, Sparkle, type DoodleName } from "@/components/ui/doodle";
import { WavyFrame } from "@/components/ui/wavy-frame";
import { siteConfig } from "@/lib/site-config";

/** One drawing per line item, in the order they're listed in site-config. */
const COST_ART: { doodle?: DoodleName; ink: Ink }[] = [
  { doodle: "house", ink: "blue" },
  { doodle: "croissant", ink: "gold" },
  { doodle: "snooker", ink: "red" },
];

export function CostsSection() {
  const { costs } = siteConfig;
  const hasPaymentLink = Boolean(costs.payment.url);

  return (
    <Section
      id="costs"
      eyebrow="The damage"
      title="What it costs"
      description={costs.intro}
      containerClassName="max-w-4xl"
    >
      {/* The headline number, framed like the invite. */}
      <div className="relative mx-auto w-full max-w-sm px-2 py-2">
        <WavyFrame
          color="var(--brand-rose)"
          amplitude={7}
          period={96}
          radius={40}
          strokeWidth={4}
          fill="var(--card)"
        />
        <Sparkle size={24} className="-right-1 top-0" />
        <div className="relative flex flex-col items-center gap-1 px-6 py-9">
          <span className="eyebrow text-brand-rose-ink">Per person</span>
          <span className="font-display text-6xl leading-none text-brand-blue">
            {costs.perPerson}
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {costs.items.map((item, i) => {
          const { doodle, ink } = COST_ART[i] ?? { ink: "blue" as Ink };
          return (
            <PosterCard
              key={item.title}
              ink={ink}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-14 items-center justify-center">
                {doodle ? (
                  <Doodle name={doodle} size={56} />
                ) : (
                  <InkBadge ink={ink}>
                    <House className="h-5 w-5" strokeWidth={1.75} />
                  </InkBadge>
                )}
              </span>
              <h3 className="mt-1 font-display uppercase text-xl text-brand-blue-ink">
                {item.title}
              </h3>
              <span className="font-display text-3xl leading-none text-brand-rose-ink">
                {item.amount}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </PosterCard>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-xl rounded-3xl border-2 border-dashed border-brand-red/45 bg-card p-8 text-left">
        <h3 className="eyebrow text-center text-brand-red-ink">Not included</h3>
        <ul className="mt-5 space-y-3">
          {costs.notIncluded.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <X
                className="mt-1 h-4 w-4 shrink-0 text-brand-red-ink"
                strokeWidth={2.25}
              />
              <span className="leading-relaxed text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <PosterCard
        ink="olive"
        className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 p-8 text-center"
      >
        <InkBadge ink="olive">
          <Banknote className="h-5 w-5" strokeWidth={1.75} />
        </InkBadge>
        <h3 className="font-display uppercase text-2xl text-brand-blue-ink">
          How to pay
        </h3>
        <p className="leading-relaxed text-foreground/90">
          {costs.payment.method}
        </p>
        <p className="text-sm text-muted-foreground">
          {costs.payment.reference}
        </p>
        <p className="text-sm text-muted-foreground">
          Please pay by {costs.payment.deadlineHuman}.
        </p>
        {hasPaymentLink ? (
          <Button asChild>
            <a href={costs.payment.url} target="_blank" rel="noreferrer">
              {costs.payment.label}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : null}
        <p className="text-xs text-muted-foreground">{costs.payment.note}</p>
      </PosterCard>
    </Section>
  );
}
