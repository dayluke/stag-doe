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
        <ul className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4">
          {goodToKnow.contacts.map((contact, i) => (
            <li key={`${contact.name}-${i}`} className="text-sm">
              <span className="font-display uppercase text-lg text-foreground">
                {contact.name}
              </span>
              <span className="eyebrow mt-1 block text-brand-rose-ink">
                {contact.role}
              </span>
              {contact.phone ? (
                <span className="mt-1.5 flex items-center justify-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3 w-3" strokeWidth={2} />
                  {contact.phone}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        {hasGroupChat ? (
          <Button asChild variant="outline">
            <a href={goodToKnow.groupChatUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Join the group chat
            </a>
          </Button>
        ) : null}
      </PosterCard>
    </Section>
  );
}
