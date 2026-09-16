"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Moon, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/site-config";
import {
  findPartyByGuestName,
  isSupabaseConfigured,
  submitRsvps,
  type GuestRow,
  type PartyRow,
} from "@/lib/supabase";

type Step = "search" | "party" | "done";

/**
 * The slider stops: the day each night starts on, plus the day everyone
 * leaves. Picking a range of stops picks the nights in between — so
 * Friday → Sunday means the Friday and Saturday nights.
 */
const stayStops = (() => {
  const dayName = (id: string) =>
    siteConfig.itinerary.find((d) => d.id === id)?.day;

  const stops = siteConfig.nights.map((n) => ({
    id: n.id as string,
    label: dayName(n.id) ?? n.label,
  }));

  const lastNight = siteConfig.nights[siteConfig.nights.length - 1];
  const lastNightDay = siteConfig.itinerary.findIndex(
    (d) => d.id === lastNight.id
  );
  const leaveDay = siteConfig.itinerary[lastNightDay + 1];
  stops.push({
    id: leaveDay?.id ?? "leaving",
    label: leaveDay?.day ?? "Leaving",
  });

  return stops;
})();

const LAST_STOP = stayStops.length - 1;

/** Night ids covered by a [arrival, departure] pair of slider stops. */
function nightsBetween(arrival: number, departure: number): string[] {
  return siteConfig.nights.slice(arrival, departure).map((n) => n.id);
}

function staySummary(arrival: number, departure: number) {
  const nights = departure - arrival;
  return `${stayStops[arrival].label} to ${stayStops[departure].label} · ${nights} night${
    nights === 1 ? "" : "s"
  }`;
}

type DraftGuest = {
  id: string;
  full_name: string;
  attending: "yes" | "no";
  /** Index into `stayStops` — the day they arrive. */
  arrival: number;
  /** Index into `stayStops` — the day they head home. */
  departure: number;
  dietaryNotes: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAttending?: "yes" | "no";
};

export function RsvpDialog({ open, onOpenChange, initialAttending }: Props) {
  const [step, setStep] = React.useState<Step>("search");
  const [query, setQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [parties, setParties] = React.useState<PartyRow[]>([]);
  const [selectedParty, setSelectedParty] = React.useState<PartyRow | null>(
    null
  );
  const [draft, setDraft] = React.useState<Record<string, DraftGuest>>({});
  const [submitting, setSubmitting] = React.useState(false);

  // Reset state whenever the dialog is closed
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("search");
        setQuery("");
        setParties([]);
        setSelectedParty(null);
        setDraft({});
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const seedDraft = React.useCallback(
    (guests: GuestRow[]) => {
      const next: Record<string, DraftGuest> = {};
      for (const g of guests) {
        // Turn the saved night ids back into a pair of slider stops. Anyone
        // who hasn't answered yet defaults to the whole weekend.
        const saved = (g.nights ?? [])
          .map((id) => siteConfig.nights.findIndex((n) => n.id === id))
          .filter((i) => i >= 0)
          .sort((a, b) => a - b);

        next[g.id] = {
          id: g.id,
          full_name: g.full_name,
          attending: (g.attending as "yes" | "no" | null) ?? initialAttending ?? "yes",
          arrival: saved.length ? saved[0] : 0,
          departure: saved.length ? saved[saved.length - 1] + 1 : LAST_STOP,
          dietaryNotes: g.dietary_notes ?? "",
        };
      }
      setDraft(next);
    },
    [initialAttending]
  );

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;

    if (!isSupabaseConfigured) {
      // Demo mode — skip straight to a fake party so the UI can be reviewed.
      const demoGuests: GuestRow[] = [
        {
          id: "demo-1",
          party_id: "demo-party",
          full_name: query.trim(),
          attending: null,
          nights: null,
          dietary_notes: null,
          responded_at: null,
        },
        {
          id: "demo-2",
          party_id: "demo-party",
          full_name: "Guest of " + query.trim(),
          attending: null,
          nights: null,
          dietary_notes: null,
          responded_at: null,
        },
      ];
      const demoParty: PartyRow = {
        id: "demo-party",
        party_name: query.trim(),
        guests: demoGuests,
      };
      setParties([demoParty]);
      setSelectedParty(demoParty);
      seedDraft(demoGuests);
      setStep("party");
      return;
    }

    setSearching(true);
    try {
      const results = await findPartyByGuestName(query);
      if (results.length === 0) {
        toast.error("We couldn't find that name — please try again.", {
          description: "Try your full name, or contact us if you're stuck.",
        });
      } else if (results.length === 1) {
        const [p] = results;
        setSelectedParty(p);
        seedDraft(p.guests);
        setStep("party");
      } else {
        setParties(results);
        // Stay on 'search' step but show the party picker below the form.
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while searching.", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSearching(false);
    }
  }

  function choosePartyFromResults(p: PartyRow) {
    setSelectedParty(p);
    seedDraft(p.guests);
    setStep("party");
  }

  function updateGuest(id: string, patch: Partial<DraftGuest>) {
    setDraft((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function handleSubmit() {
    if (!selectedParty) return;

    setSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        await submitRsvps(
          Object.values(draft).map((g) => ({
            guestId: g.id,
            attending: g.attending,
            nights:
              g.attending === "yes" ? nightsBetween(g.arrival, g.departure) : [],
            dietaryNotes: g.dietaryNotes.trim() || null,
          }))
        );
      } else {
        // Demo mode: pretend it worked after a short delay.
        await new Promise((r) => setTimeout(r, 500));
      }
      setStep("done");
    } catch (err) {
      console.error(err);
      toast.error("We couldn't save your RSVP.", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          {step === "search" ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>RSVP</DialogTitle>
                <DialogDescription>
                  Please reply by {siteConfig.rsvpDeadlineHuman}. Find your
                  invitation by typing your name.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSearch} className="mt-6 space-y-3">
                <Label htmlFor="rsvp-name">Your name</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="rsvp-name"
                    placeholder="e.g. Alex Smith"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    autoFocus
                    className="pl-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={searching || !query.trim()}
                >
                  {searching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Find my invitation"
                  )}
                </Button>
                {!isSupabaseConfigured ? (
                  <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Demo mode — any name will work.
                  </p>
                ) : null}
              </form>

              {parties.length > 1 ? (
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We found a few possible matches:
                  </p>
                  {parties.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => choosePartyFromResults(p)}
                      className="w-full rounded-2xl border-2 border-brand-rose/45 bg-secondary p-4 text-left transition-colors hover:border-brand-rose hover:bg-accent"
                    >
                      <div className="font-display uppercase text-lg text-brand-blue-ink">
                        {p.party_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {p.guests.map((g) => g.full_name).join(", ")}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {step === "party" && selectedParty ? (
            <motion.div
              key="party"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <button
                  type="button"
                  onClick={() => setStep("search")}
                  className="eyebrow mb-3 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-brand-blue"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
                <DialogTitle>{selectedParty.party_name}</DialogTitle>
                <DialogDescription>
                  Tell us who&apos;s coming, and which days each of you can
                  make.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-5">
                {Object.values(draft).map((g) => (
                  <GuestCard
                    key={g.id}
                    guest={g}
                    onChange={(patch) => updateGuest(g.id, patch)}
                  />
                ))}

                <div className="space-y-2">
                  <Label htmlFor={`notes-${selectedParty.id}`}>
                    Anything else we should know?
                  </Label>
                  <Textarea
                    id={`notes-${selectedParty.id}`}
                    placeholder="Allergies, lifts, turning up late..."
                    value={
                      Object.values(draft)[0]?.dietaryNotes ?? ""
                    }
                    onChange={(e) => {
                      // Attach free-text notes to the first guest in the
                      // party for simplicity; the schema supports per-guest
                      // notes if you want to split them.
                      const firstId = Object.values(draft)[0]?.id;
                      if (firstId) {
                        updateGuest(firstId, { dietaryNotes: e.target.value });
                      }
                    }}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit RSVP"
                  )}
                </Button>
              </div>
            </motion.div>
          ) : null}

          {step === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center py-6 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-brand-olive text-brand-olive-ink">
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <DialogTitle>Thank you</DialogTitle>
              <DialogDescription className="mt-2 max-w-sm">
                Your RSVP has been saved. If you need to change anything, just
                search for your name again and resubmit.
              </DialogDescription>
              <Button className="mt-8" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function GuestCard({
  guest,
  onChange,
}: {
  guest: DraftGuest;
  onChange: (patch: Partial<DraftGuest>) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-brand-blue/35 bg-secondary p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display uppercase text-lg leading-none text-brand-blue-ink">
          {guest.full_name}
        </span>
        <div className="flex rounded-full border-2 border-brand-rose/45 bg-card p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => onChange({ attending: "yes" })}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              guest.attending === "yes"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-brand-blue"
            }`}
          >
            Attending
          </button>
          <button
            type="button"
            onClick={() => onChange({ attending: "no" })}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              guest.attending === "no"
                ? "bg-brand-rose text-brand-ivory"
                : "text-muted-foreground hover:text-brand-rose"
            }`}
          >
            Can&apos;t make it
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {guest.attending === "yes" ? (
          <motion.div
            key="stay"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Label>Which days?</Label>
                <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                  <Moon className="h-3.5 w-3.5 text-brand-rose-ink" strokeWidth={2} />
                  {staySummary(guest.arrival, guest.departure)}
                </span>
              </div>

              <div className="mt-4 px-1">
                <Slider
                  min={0}
                  max={LAST_STOP}
                  step={1}
                  minStepsBetweenThumbs={1}
                  value={[guest.arrival, guest.departure]}
                  onValueChange={([arrival, departure]) =>
                    onChange({ arrival, departure })
                  }
                  thumbLabels={[
                    `${guest.full_name} — day of arrival`,
                    `${guest.full_name} — day of departure`,
                  ]}
                />
                <div className="mt-3 flex justify-between">
                  {stayStops.map((stop, i) => {
                    const inStay = i >= guest.arrival && i <= guest.departure;
                    return (
                      <span
                        key={stop.id}
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                          inStay ? "text-brand-blue" : "text-muted-foreground/50"
                        }`}
                      >
                        {stop.label.slice(0, 3)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
