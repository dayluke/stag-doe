import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary/40 py-10 text-center text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-5">
        <span className="font-display text-xl text-foreground">
          {siteConfig.brideFirstName} {siteConfig.ampersand}{" "}
          {siteConfig.groomFirstName}
        </span>
        <span>{siteConfig.dateHuman} · {siteConfig.locationShort}</span>
        <span className="mt-4 text-xs">
          With love, and a lot of group-chat scheduling.
        </span>
      </div>
    </footer>
  );
}
