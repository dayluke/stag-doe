"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doodle, Sparkle } from "@/components/ui/doodle";
import { WavyFrame } from "@/components/ui/wavy-frame";
import { RsvpDialog } from "@/components/rsvp/rsvp-dialog";
import { siteConfig } from "@/lib/site-config";

export function RsvpCta() {
  const [open, setOpen] = React.useState(false);
  const [initialAttending, setInitialAttending] =
    React.useState<"yes" | "no" | undefined>(undefined);
  const [pastHero, setPastHero] = React.useState(false);
  const [ctaInView, setCtaInView] = React.useState(false);

  const ctaButtonsRef = React.useRef<HTMLDivElement | null>(null);

  // Show the sticky bar once the user has scrolled past the hero.
  React.useEffect(() => {
    const handler = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Hide the sticky bar while the inline RSVP buttons are visible on screen.
  React.useEffect(() => {
    const target = ctaButtonsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCtaInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function openWith(intent: "yes" | "no") {
    setInitialAttending(intent);
    setOpen(true);
  }

  const stickyVisible = pastHero && !ctaInView && !open;

  return (
    <>
      {/* Primary inline RSVP block — the invite's frame, one more time. */}
      <section
        id="rsvp"
        className="paper relative w-full scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20"
      >
        <div className="relative mx-auto w-full max-w-3xl px-5 py-14 sm:px-10 sm:py-16">
          <WavyFrame
            color="var(--brand-rose)"
            amplitude={8}
            period={92}
            radius={52}
            strokeWidth={5}
            fill="var(--card)"
          />
          <Sparkle size={30} className="right-[6%] top-[8%]" />
          <Sparkle size={38} twin className="bottom-[10%] left-[5%]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-5 flex items-end gap-4">
              <Doodle
                name="cocktail"
                size={62} className="tilt-l"
              />
              <Doodle
                name="wineTable"
                size={70} className="tilt-r"
              />
            </div>
            <span className="eyebrow mb-3 text-brand-rose-ink">
              Please reply by {siteConfig.rsvpDeadlineHuman}
            </span>
            <h2 className="font-display uppercase text-brand-blue text-[clamp(2.25rem,9vw,4rem)]">
              Will you join us?
            </h2>
            <p className="mt-4 max-w-md text-balance text-muted-foreground">
              Please let us know as soon as possible whether you can make it,
              so we can finalise the numbers for the venue and activities.
            </p>
            <div
              ref={ctaButtonsRef}
              className="mt-9 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Button size="lg" className="sm:min-w-52" onClick={() => openWith("yes")}>
                <Check className="h-4 w-4" strokeWidth={3} />
                Joyfully accept
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="sm:min-w-52"
                onClick={() => openWith("no")}
              >
                Regretfully decline
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky bottom CTA — appears after the hero, hides while the inline
          buttons above are visible on screen. */}
      <AnimatePresence>
        {stickyVisible ? (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-3"
          >
            <div className="flex items-center gap-2 rounded-full border-2 border-brand-rose/60 bg-card/95 p-1.5 shadow-paper-rose backdrop-blur-md">
              <span className="eyebrow ml-3 hidden text-brand-rose-ink sm:inline">
                RSVP
              </span>
              <div className="flex flex-1 gap-1.5">
                <Button size="sm" className="flex-1" onClick={() => openWith("yes")}>
                  <Check className="h-3.5 w-3.5 [&>path]:fill-none" strokeWidth={3}/>
                  Will attend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openWith("no")}
                >
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                  Won&apos;t attend
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <RsvpDialog
        open={open}
        onOpenChange={setOpen}
        initialAttending={initialAttending}
      />
    </>
  );
}
