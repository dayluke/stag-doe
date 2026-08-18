"use client";

import { Shirt } from "lucide-react";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";

export function DressCodeSection() {
  return (
    <Section id="dress-code" eyebrow="What to wear" title="Dress code">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/60 text-primary">
          <Shirt className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h3 className="font-display text-3xl">
          {siteConfig.dressCode.title}
        </h3>
        <p className="text-foreground/90 leading-relaxed max-w-md">
          {siteConfig.dressCode.description}
        </p>
      </div>
    </Section>
  );
}
