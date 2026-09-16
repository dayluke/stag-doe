import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefix a file in `/public` with the deploy basePath.
 *
 * `next/image` normally handles this, but not when `images.unoptimized` is set
 * (which it is, for the static export) — it emits the `src` verbatim. Under
 * GitHub Pages' `/<repo>/` basePath a bare `/pizza-slice.svg` would 404, so
 * asset paths get built by hand.
 */
export function assetPath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/${path.replace(/^\/+/, "")}`;
}
