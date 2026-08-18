"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-32 grainy"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/80 via-background to-background" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Together with their families
        </span>

        <div className="relative mt-10 mb-10 sm:mt-14 sm:mb-12 w-[min(86vw,28rem)] aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_25px_60px_-30px_rgba(58,66,56,0.45)] ring-1 ring-border/60">
          <Image
            src={siteConfig.heroImageUrl}
            alt={siteConfig.heroImageAlt}
            fill
            priority
            sizes="(max-width: 640px) 86vw, 28rem"
            className="object-cover"
          />
        </div>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.95] text-foreground">
          <span className="block">{siteConfig.groomFirstName}</span>
          <span className="block text-primary/70 italic font-normal text-5xl sm:text-6xl my-2">
            {siteConfig.ampersand}
          </span>
          <span className="block">{siteConfig.brideFirstName}</span>
        </h1>

        <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="h-px w-10 bg-border" />
          <span className="uppercase tracking-[0.3em]">
            {siteConfig.dateHuman.split(",")[1]?.trim() ?? siteConfig.dateHuman}
          </span>
          <span className="h-px w-10 bg-border" />
        </div>

        <motion.a
          href="#details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll to details"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="mt-2 h-10 w-px bg-gradient-to-b from-muted-foreground/60 to-transparent" />
        </motion.a>
      </motion.div>
    </section>
  );
}
