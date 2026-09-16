import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { assetPath } from "@/lib/utils";

/**
 * Web app manifest — drives the home-screen icon and splash colours when the
 * site is "Add to Home Screen"-ed on Android. The maskable entry lets Android
 * crop the icon into whatever shape the launcher uses without clipping the art.
 *
 * Unlike the `favicon`/`icon`/`apple-icon` file conventions, Next doesn't
 * rewrite URLs inside the manifest body, so these go through `assetPath` to
 * pick up the GitHub Pages basePath.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.groomFirstName} & ${siteConfig.brideFirstName} — Stag & Doe`,
    short_name: "Stag & Doe",
    description: `Join us ${siteConfig.dateHuman} in ${siteConfig.locationShort}.`,
    start_url: assetPath("/"),
    display: "standalone",
    background_color: "#f8f6ea",
    theme_color: "#d46c7f",
    icons: [
      {
        src: assetPath("/android-chrome-192x192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: assetPath("/android-chrome-512x512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: assetPath("/android-chrome-512x512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

// The site is a static export (`output: "export"`), so this route has to be
// prerendered at build time rather than served on request.
export const dynamic = "force-static";
