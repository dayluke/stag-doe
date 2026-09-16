"use client";

import { MessageCircle, Phone } from "lucide-react";
import { PosterCard, Section, type Ink } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const inks: Ink[] = ["rose", "gold", "olive"];

export function GoodToKnowSection() {
  const { goodToKnow } = siteConfig;
  const hasGroupChat = Boolean(goodToKnow.groupChatUrl);

  return (
    <Section
      id="good-to-know"
      eyebrow="House rules"
      title="Good to know"
      description="A few practicalities so we don't lose our deposit."
      doodle="dustpan"
      tone="soft"
      containerClassName="max-w-4xl"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {goodToKnow.rules.map((rule, i) => (
          <PosterCard
            key={rule.title}
            ink={inks[i % inks.length]}
            className="text-left"
          >
            <h3 className="font-display uppercase text-xl leading-tight text-brand-blue-ink">
              {rule.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {rule.description}
            </p>
          </PosterCard>
        ))}
      </div>

      <PosterCard
        ink="blue"
        className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-5 p-8 text-center"
      >
        <h3 className="font-display uppercase text-2xl text-brand-blue-ink">
          Any questions?
        </h3>
        <span className="font-display uppercase text-lg text-foreground">
          If it's important
        </span>
        <span className="eyebrow block text-brand-rose-ink">
          Ask either Leanne or Luke directly
        </span>
        <span className="font-display uppercase mt-5 text-lg text-foreground">
          If it's not urgent
        </span>
        <span className="eyebrow block mb-5 text-brand-rose-ink">
          Leave a note in your RSVP
        </span>
        {hasGroupChat ? (
          <Button asChild variant="outline">
            <a href={goodToKnow.groupChatUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Drop us a message
            </a>
          </Button>
        ) : null}
      </PosterCard>
    </Section>
  );
}
