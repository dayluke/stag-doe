import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { PasswordModal } from "@/components/PasswordModal";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.groomFirstName} & ${siteConfig.brideFirstName} — Wedding`,
  description: `${siteConfig.groomFirstName} and ${siteConfig.brideFirstName} are getting married on ${siteConfig.dateHuman}. Come celebrate with us.`,
  openGraph: {
    title: `${siteConfig.groomFirstName} & ${siteConfig.brideFirstName} — Wedding`,
    description: `Join us on ${siteConfig.dateHuman} at ${siteConfig.venueShortName}.`,
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
      style={{
        // Expose the Cormorant variable to the global --font-display consumer.
        ["--font-display" as string]: "var(--font-display-cormorant)",
      }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PasswordModal>
          {children}
        </PasswordModal>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
