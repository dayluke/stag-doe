import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { PasswordModal } from "@/components/PasswordModal";
import "./globals.css";

const sans = Nunito({
  variable: "--font-sans-nunito",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Block Berthold — the chunky poster face used on the invite itself, for both
 * "LUKE AND LEANNE'S" and "Stag & Doe". Self-hosted so there's no third-party
 * request and no layout shift. Font by OnlineWebFonts (CC BY 4.0).
 */
const display = localFont({
  src: "../../public/fonts/block-berthold.woff2",
  variable: "--font-display-block",
  weight: "400",
  style: "normal",
  display: "swap",
  // Block Berthold sits high in the em box; nudge the fallback to match so the
  // swap doesn't jump.
  adjustFontFallback: false,
  fallback: ["Haettenschweiler", "Arial Narrow Bold", "sans-serif"],
});

export const metadata: Metadata = {
  title: `${siteConfig.groomFirstName} & ${siteConfig.brideFirstName} — Stag & Doe`,
  description: `${siteConfig.groomFirstName} and ${siteConfig.brideFirstName} are getting married — first, a weekend away. ${siteConfig.dateHuman} in ${siteConfig.locationShort}.`,
  openGraph: {
    title: `${siteConfig.groomFirstName} & ${siteConfig.brideFirstName} — Stag & Doe`,
    description: `Join us ${siteConfig.dateHuman} in ${siteConfig.locationShort}.`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PasswordModal>{children}</PasswordModal>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "2px solid var(--brand-rose)",
              borderRadius: "1rem",
            },
          }}
        />
      </body>
    </html>
  );
}
