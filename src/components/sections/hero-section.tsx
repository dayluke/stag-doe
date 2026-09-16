"use client";

import { motion } from "framer-motion";
import { Doodle, Sparkle, type DoodleName } from "@/components/ui/doodle";
import { WavyFrame } from "@/components/ui/wavy-frame";
import { siteConfig } from "@/lib/site-config";

/**
 * The doodle grid, laid out to echo the invite: three loose rows, nothing
 * quite square to anything else. `nudge` is a per-item transform so the
 * arrangement reads as hand-placed rather than as a CSS grid.
 */
const POSTER_DOODLES: {
  name: DoodleName;
  span: string;
  nudge: string;
  size: number;
}[] = [
  { name: "pizza", span: "col-start-1", nudge: "-rotate-3", size: 118 },
  { name: "wineTable", span: "col-start-2", nudge: "rotate-1", size: 126 },
  { name: "cocktail", span: "col-start-3", nudge: "rotate-2", size: 112 },
  {
    name: "bicycle",
    span: "col-start-1 col-span-2 justify-self-center",
    nudge: "-rotate-1",
    size: 138,
  },
  { name: "croissant", span: "col-start-3", nudge: "rotate-3", size: 128 },
  { name: "cards", span: "col-start-1", nudge: "-rotate-2", size: 116 },
  { name: "movieTicket", span: "col-start-2", nudge: "rotate-2", size: 120 },
  { name: "wineBottle", span: "col-start-3", nudge: "-rotate-2", size: 96 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const { groomFirstName, brideFirstName, dateHuman, locationShort } =
    siteConfig;

  return (
    <section
      id="home"
      className="paper relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-8 sm:py-12"
    >
      <WavyFrame
        color="var(--brand-rose)"
        amplitude={9}
        period={112}
        radius={64}
        strokeWidth={6}
        className="inset-2 sm:inset-5"
        fill="var(--card)"
      />

      {/* The gold sparkles that punctuate the invite's border. */}
      <Sparkle size={30} className="right-[9%] top-[7%]" />
      <Sparkle size={44} twin className="left-[7%] top-[18%]" />
      <Sparkle size={34} twin className="bottom-[16%] left-[8%]" />
      <Sparkle size={26} className="bottom-[6%] right-[10%]" />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center px-2 text-center sm:px-8"
      >
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display uppercase text-brand-blue text-[clamp(2.6rem,12.5vw,6.5rem)] leading-[0.88] tracking-[0.01em]"
        >
          <span className="block">{groomFirstName} and</span>
          <span className="block">{brideFirstName}&rsquo;s</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="my-6 grid w-full grid-cols-3 place-items-center gap-x-2 gap-y-3 sm:my-8 sm:gap-x-6 sm:gap-y-5"
        >
          {POSTER_DOODLES.map((item) => (
            <div
              key={item.name}
              className={`${item.span} ${item.nudge} flex justify-center`}
            >
              <Doodle
                name={item.name}
                size={item.size}
                priority
                // Let the art breathe on phones, but cap it on wide screens.
                box={`min(23vw, ${item.size}px)`}
              />
            </div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-brand-blue text-[clamp(2.4rem,11.5vw,5.75rem)] leading-[0.9]"
        >
          Stag {siteConfig.ampersand} Doe
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col items-center gap-1.5"
        >
          <span className="eyebrow text-brand-rose-ink">{dateHuman}</span>
          <span className="eyebrow text-muted-foreground">{locationShort}</span>
        </motion.div>

        <motion.a
          href="#details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-8 flex flex-col items-center text-muted-foreground transition-colors hover:text-brand-blue"
          aria-label="Scroll to the details"
        >
          <span className="eyebrow">Scroll</span>
          <span
            aria-hidden
            className="mt-2 h-8 w-px bg-gradient-to-b from-brand-rose to-transparent"
          />
        </motion.a>
      </motion.div>
    </section>
  );
}
