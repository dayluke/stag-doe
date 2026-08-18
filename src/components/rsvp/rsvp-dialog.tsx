"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Search, Sparkles } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { siteConfig } from "@/lib/site-config";
import {
  findPartyByGuestName,
  isSupabaseConfigured,
  submitRsvps,
  type GuestRow,
  type PartyRow,
  type MenuChoice,
} from "@/lib/supabase";

type Step = "search" | "party" | "done";

type DraftGuest = {
  id: string;
  full_name: string;
  attending: "yes" | "no";
  menuChoice: MenuChoice;
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
        next[g.id] = {
          id: g.id,
          full_name: g.full_name,
          attending: (g.attending as "yes" | "no" | null) ?? initialAttending ?? "yes",
          menuChoice: g.menu_choice ?? null,
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
          menu_choice: null,
          dietary_notes: null,
          responded_at: null,
        },
        {
          id: "demo-2",
          party_id: "demo-party",
          full_name: "Guest of " + query.trim(),
          attending: null,
          menu_choice: null,
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

    // Validate: anyone attending must have a menu choice.
    const missing = Object.values(draft).find(
      (g) => g.attending === "yes" && !g.menuChoice
    );
    if (missing) {
      toast.error(`Please pick a menu for ${missing.full_name}.`);
      return;
    }

    setSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        await submitRsvps(
          Object.values(draft).map((g) => ({
            guestId: g.id,
            attending: g.attending,
            menuChoice: g.attending === "yes" ? g.menuChoice : null,
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
                      className="w-full rounded-2xl border border-border bg-secondary/40 p-4 text-left hover:bg-secondary/70 transition-colors"
                    >
                      <div className="font-display text-lg">{p.party_name}</div>
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
                  className="mb-2 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
                <DialogTitle>{selectedParty.party_name}</DialogTitle>
                <DialogDescription>
                  Tell us who&apos;s coming, and please pick a menu for each
                  attending guest.
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
                    placeholder="Allergies, questions, song requests..."
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
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-6 w-6" strokeWidth={2} />
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
    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-lg leading-none">
          {guest.full_name}
        </span>
        <div className="flex rounded-full border border-border bg-card p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onChange({ attending: "yes" })}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              guest.attending === "yes"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Attending
          </button>
          <button
            type="button"
            onClick={() =>
              onChange({ attending: "no", menuChoice: null })
            }
            className={`px-3 py-1.5 rounded-full transition-colors ${
              guest.attending === "no"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Can&apos;t make it
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {guest.attending === "yes" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Menu choice
              </Label>
              <RadioGroup
                className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
                value={guest.menuChoice ?? ""}
                onValueChange={(v) =>
                  onChange({ menuChoice: v as MenuChoice })
                }
              >
                {siteConfig.menus.map((m) => {
                  const active = guest.menuChoice === m.id;
                  return (
                    <label
                      key={m.id}
                      htmlFor={`${guest.id}-${m.id}`}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-secondary/60"
                      }`}
                    >
                      <RadioGroupItem
                        id={`${guest.id}-${m.id}`}
                        value={m.id}
                      />
                      <div>
                        <div className="text-sm font-medium">{m.title}</div>
                        {m.subtitle ? (
                          <div className="text-xs text-muted-foreground">
                            {m.subtitle}
                          </div>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
