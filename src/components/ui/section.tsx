"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  containerClassName?: string;
  tone?: "default" | "soft" | "accent";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
  tone = "default",
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full px-5 py-20 sm:py-28 scroll-mt-20",
        tone === "soft" && "bg-secondary/40",
        tone === "accent" && "bg-accent/40",
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          "mx-auto max-w-3xl flex flex-col items-center text-center",
          containerClassName
        )}
      >
        {(eyebrow || title || description) && (
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 sm:mb-14 flex flex-col items-center"
          >
            {eyebrow ? (
              <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground mb-4">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-5 text-balance text-muted-foreground max-w-xl">
                {description}
              </p>
            ) : null}
            <span
              aria-hidden
              className="mt-6 block h-px w-16 bg-primary/50"
            />
          </motion.header>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
