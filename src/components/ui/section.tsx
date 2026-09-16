"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Doodle, type DoodleName } from "@/components/ui/doodle";
import { WavyRule } from "@/components/ui/wavy-frame";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** The hand-drawn icon that sits above the heading. */
  doodle?: DoodleName;
  containerClassName?: string;
  tone?: "default" | "soft";
};

/** Ink colour for the wavy rule under each heading, rotated per section. */
const RULE_COLORS = ["var(--brand-rose)", "var(--brand-gold)"];

export function Section({
  id,
  eyebrow,
  title,
  description,
  doodle,
  children,
  className,
  containerClassName,
  tone = "default",
  ...rest
}: SectionProps) {
  // Stable per-section, so the rule colour doesn't flip between renders.
  const ruleColor = React.useMemo(() => {
    const key = id ?? title ?? "";
    const sum = [...key].reduce((n, c) => n + c.charCodeAt(0), 0);
    return RULE_COLORS[sum % RULE_COLORS.length];
  }, [id, title]);

  return (
    <section
      id={id}
      className={cn(
        "paper relative w-full scroll-mt-20 px-5 py-16 sm:py-24",
        tone === "soft" && "bg-secondary",
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center",
          containerClassName
        )}
      >
        {(eyebrow || title || description || doodle) && (
          <motion.header
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-col items-center sm:mb-14"
          >
            {doodle ? (
              <Doodle name={doodle} size={82} className="mb-4" />
            ) : null}
            {eyebrow ? (
              <span className="eyebrow mb-3 text-brand-rose-ink">{eyebrow}</span>
            ) : null}
            {title ? (
              <h2 className="font-display uppercase text-brand-blue text-[clamp(2rem,7.5vw,3.5rem)]">
                {title}
              </h2>
            ) : null}
            <WavyRule
              color={ruleColor}
              amplitude={4}
              period={44}
              strokeWidth={3}
              className="mt-4 max-w-[9rem]"
            />
            {description ? (
              <p className="mt-4 max-w-xl text-balance text-muted-foreground">
                {description}
              </p>
            ) : null}
          </motion.header>
        )}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export type Ink = "rose" | "blue" | "olive" | "gold" | "red";

/**
 * A round ink stamp for the lucide glyphs used where no hand-drawn doodle
 * exists — same line weight, same palette, so the two sit together.
 */
const BADGE_INK: Record<Ink, string> = {
  rose: "border-brand-rose/55 text-brand-rose-ink",
  blue: "border-brand-blue/50 text-brand-blue",
  olive: "border-brand-olive/60 text-brand-olive-ink",
  gold: "border-brand-gold text-brand-gold",
  red: "border-brand-red/50 text-brand-red-ink",
};

export function InkBadge({
  ink = "blue",
  className,
  children,
}: {
  ink?: Ink;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
        BADGE_INK[ink],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * The standard card on this site: ivory paper, a solid ink border and a
 * misregistered second impression behind it. No soft shadows — this is print.
 */
export function PosterCard({
  className,
  ink = "rose",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { ink?: Ink }) {
  const borders: Record<Ink, string> = {
    rose: "border-brand-rose shadow-paper-rose",
    blue: "border-brand-blue shadow-paper-blue",
    olive: "border-brand-olive shadow-paper-olive",
    gold: "border-brand-gold shadow-paper-gold",
    red: "border-brand-red shadow-paper-red",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border-2 bg-card p-6 sm:p-7",
        borders[ink],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
