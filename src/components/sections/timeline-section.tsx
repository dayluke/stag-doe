"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";

export function TimelineSection() {
  return (
    <Section
      id="timeline"
      eyebrow="The running order"
      title="A day in the life"
      description="Here’s roughly how the day will unfold."
      tone="soft"
    >
      <ol className="relative mx-auto mt-2 max-w-xl">
        {/* center rail */}
        <span
          aria-hidden
          className="absolute left-[6.5rem] top-3 bottom-3 w-px bg-border sm:left-32"
        />
        {siteConfig.timeline.map((entry, index) => (
          <motion.li
            key={`${entry.time}-${entry.title}`}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative grid grid-cols-[5.5rem_auto_1fr] sm:grid-cols-[8rem_auto_1fr] items-start gap-5 py-5 text-left"
          >
            <span className="font-display text-lg text-muted-foreground text-right pr-2 pt-0.5">
              {entry.time}
            </span>
            <span
              aria-hidden
              className="relative z-10 mt-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"
            />
            <div>
              <h3 className="font-display text-xl leading-tight text-foreground">
                {entry.title}
              </h3>
              {entry.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.description}
                </p>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
