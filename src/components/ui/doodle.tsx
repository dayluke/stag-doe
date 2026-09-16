import Image from "next/image";
import { assetPath, cn } from "@/lib/utils";

/**
 * The hand-drawn line art from the invite, dropped in as decoration.
 *
 * Each SVG carries its own ink colour, so there's nothing to tint here — the
 * only job is to letterbox it into a square-ish box without distorting it.
 * Intrinsic sizes come from each file's viewBox.
 */
const DOODLES = {
  barbeque: { file: "barbeque.svg", w: 168, h: 239, alt: "A charcoal barbecue" },
  bicycle: { file: "bicycle.svg", w: 187, h: 170, alt: "A bicycle" },
  cocktail: {
    file: "cocktail-glass.svg",
    w: 201,
    h: 287,
    alt: "A martini glass with olives",
  },
  croissant: { file: "croissant.svg", w: 209, h: 163, alt: "A croissant" },
  dustpan: {
    file: "dustpan.svg",
    w: 168,
    h: 164,
    alt: "A dustpan and brush",
  },
  iceCream: { file: "ice-cream.svg", w: 187, h: 477, alt: "An ice cream cone" },
  movieTicket: {
    file: "movie-ticket.svg",
    w: 201,
    h: 149,
    alt: "A movie ticket",
  },
  pizza: { file: "pizza-slice.svg", w: 195, h: 229, alt: "A slice of pizza" },
  cards: {
    file: "playing-cards.svg",
    w: 192,
    h: 179,
    alt: "A fanned hand of playing cards",
  },
  pool: { file: "pool.svg", w: 259, h: 122, alt: "A swimming pool" },
  snooker: {
    file: "snooker.svg",
    w: 236,
    h: 242,
    alt: "A cue and two pool balls",
  },
  suitcase: { file: "suitcase.svg", w: 168, h: 160, alt: "A suitcase" },
  wineBottle: { file: "wine-bottle.svg", w: 75, h: 203, alt: "A wine bottle" },
  wineTable: {
    file: "wine-glass-and-bottle.svg",
    w: 227,
    h: 211,
    alt: "A glass of wine and a bottle on a table",
  },
  star: { file: "star-single.svg", w: 78, h: 95, alt: "" },
  stars: { file: "star-twin.svg", w: 50, h: 50, alt: "" },
  house: { file: "house.svg", w: 100, h: 100, alt: "A house" },
} as const;

export type DoodleName = keyof typeof DOODLES;

type DoodleProps = {
  name: DoodleName;
  /**
   * Side of the square box the drawing is letterboxed into. The wine bottle is
   * 0.37:1 and the pool is 2.13:1, so pinning one edge would blow the other
   * one out — both edges stay inside the box.
   */
  size?: number;
  /**
   * The box side as any CSS length, for responsive art — e.g.
   * `"min(22vw, 118px)"`. Overrides `size`.
   */
  box?: string;
  className?: string;
  /** Decorative by default; pass a label when the drawing carries meaning. */
  label?: string;
  priority?: boolean;
};

export function Doodle({
  name,
  size = 64,
  box,
  className,
  label,
  priority,
}: DoodleProps) {
  const art = DOODLES[name];
  const longest = Math.max(art.w, art.h);
  const scale = size / longest;
  const alt = label ?? "";

  /*
   * Both edges are derived from one box side, so the ratio is exact at any
   * width. Setting them in CSS (not just as attributes) matters: `width: auto`
   * would make the browser fall back to each SVG's own intrinsic size and
   * ignore these numbers entirely.
   */
  const side = box ?? `${size}px`;
  const cssSize = {
    width: `calc(${side} * ${(art.w / longest).toFixed(4)})`,
    height: `calc(${side} * ${(art.h / longest).toFixed(4)})`,
  };

  return (
    <Image
      src={assetPath(art.file)}
      alt={alt}
      width={Math.round(art.w * scale)}
      height={Math.round(art.h * scale)}
      priority={priority}
      aria-hidden={alt === "" || undefined}
      className={cn("max-w-full select-none", className)}
      style={cssSize}
    />
  );
}

/**
 * The little gold four-point sparkles scattered around the invite's border.
 * Purely decorative, and absolutely positioned by the caller.
 */
export function Sparkle({
  size = 28,
  twin = false,
  className,
  style,
}: {
  size?: number;
  twin?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute block", className)}
      style={style}
    >
      <Doodle name={twin ? "stars" : "star"} size={size} />
    </span>
  );
}
