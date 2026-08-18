"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {/* Primary inline RSVP block (always visible in-page) */}
      <section
        id="rsvp"
        className="relative w-full px-5 py-24 bg-accent/40 scroll-mt-20"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground mb-4">
            Please reply by {siteConfig.rsvpDeadlineHuman}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
            Will you join us?
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            We&apos;d love to know if you can make it. Tap below to let us know
            — it only takes a minute.
          </p>
          <div
            ref={ctaButtonsRef}
            className="mt-10 flex flex-col gap-3 w-full sm:flex-row sm:justify-center"
          >
            <Button
              size="lg"
              className="min-w-56"
              onClick={() => openWith("yes")}
            >
              <Heart className="h-4 w-4" strokeWidth={2} />
              Joyfully accept
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-56"
              onClick={() => openWith("no")}
            >
              Regretfully decline
            </Button>
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
            className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-3 w-full max-w-md"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-card/90 p-1.5 shadow-[0_15px_40px_-20px_rgba(58,66,56,0.45)] backdrop-blur-md">
              <span className="ml-3 hidden sm:inline text-xs uppercase tracking-[0.2em] text-muted-foreground">
                RSVP
              </span>
              <div className="flex flex-1 gap-1.5">
                <Button
                  size="sm"
                  className="flex-1 rounded-full"
                  onClick={() => openWith("yes")}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Will attend
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 rounded-full"
                  onClick={() => openWith("no")}
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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
