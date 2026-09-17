import { WavyRule } from "@/components/ui/wavy-frame";
import { Doodle } from "@/components/ui/doodle";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="paper relative w-full bg-secondary pt-14 pb-20 text-center">
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5">
        <WavyRule
          color="var(--brand-rose)"
          amplitude={5}
          period={56}
          strokeWidth={4}
          className="max-w-xs"
        />

        <p className="mt-8 font-display uppercase text-3xl leading-none text-brand-blue sm:text-4xl">
          {siteConfig.groomFirstName} {siteConfig.ampersand}{" "}
          {siteConfig.brideFirstName}
        </p>
        <p className="eyebrow mt-3 text-brand-rose-ink">
          {siteConfig.dateHuman} · {siteConfig.locationShort}
        </p>

        <div className="mt-7 flex items-end gap-5">
          <Doodle name="pizza" size={40} className="tilt-l" />
          <Doodle name="bicycle" size={48} />
          <Doodle name="cards" size={40} className="tilt-r" />
        </div>

        <p className="mt-7 text-xs text-muted-foreground">
          With love, from your favourite neuro-spicy queer nearlyweds.
        </p>
      </div>
    </footer>
  );
}
