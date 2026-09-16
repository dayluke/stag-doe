"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The wobbly rose border that frames the invite.
 *
 * It's measured rather than stretched: an SVG scaled with
 * `preserveAspectRatio="none"` would squash the waves on the long edges and
 * fatten the stroke, so instead we watch the container size and regenerate the
 * path. That keeps the wave period and the line weight identical all the way
 * round, whatever the aspect ratio of what it's wrapping.
 */

type Sample = { x: number; y: number; nx: number; ny: number };

/**
 * Walk the perimeter of a rounded rectangle, returning the point and the
 * outward normal at arc length `s`. Clockwise from the top-left corner.
 */
function pointAt(s: number, w: number, h: number, r: number): Sample {
  const straightX = w - 2 * r;
  const straightY = h - 2 * r;
  const arc = (Math.PI * r) / 2;

  // Each leg of the walk: how long it is, and how to place a point along it.
  const legs: {
    len: number;
    at: (t: number) => Sample;
  }[] = [
    // Top edge, left to right.
    {
      len: straightX,
      at: (t) => ({ x: r + t, y: 0, nx: 0, ny: -1 }),
    },
    // Top-right corner.
    {
      len: arc,
      at: (t) => {
        const a = -Math.PI / 2 + (t / arc) * (Math.PI / 2);
        return {
          x: w - r + r * Math.cos(a),
          y: r + r * Math.sin(a),
          nx: Math.cos(a),
          ny: Math.sin(a),
        };
      },
    },
    // Right edge, top to bottom.
    {
      len: straightY,
      at: (t) => ({ x: w, y: r + t, nx: 1, ny: 0 }),
    },
    // Bottom-right corner.
    {
      len: arc,
      at: (t) => {
        const a = (t / arc) * (Math.PI / 2);
        return {
          x: w - r + r * Math.cos(a),
          y: h - r + r * Math.sin(a),
          nx: Math.cos(a),
          ny: Math.sin(a),
        };
      },
    },
    // Bottom edge, right to left.
    {
      len: straightX,
      at: (t) => ({ x: w - r - t, y: h, nx: 0, ny: 1 }),
    },
    // Bottom-left corner.
    {
      len: arc,
      at: (t) => {
        const a = Math.PI / 2 + (t / arc) * (Math.PI / 2);
        return {
          x: r + r * Math.cos(a),
          y: h - r + r * Math.sin(a),
          nx: Math.cos(a),
          ny: Math.sin(a),
        };
      },
    },
    // Left edge, bottom to top.
    {
      len: straightY,
      at: (t) => ({ x: 0, y: h - r - t, nx: -1, ny: 0 }),
    },
    // Top-left corner.
    {
      len: arc,
      at: (t) => {
        const a = Math.PI + (t / arc) * (Math.PI / 2);
        return {
          x: r + r * Math.cos(a),
          y: r + r * Math.sin(a),
          nx: Math.cos(a),
          ny: Math.sin(a),
        };
      },
    },
  ];

  let left = s;
  for (const leg of legs) {
    if (left <= leg.len || leg === legs[legs.length - 1]) {
      return leg.at(Math.min(left, leg.len));
    }
    left -= leg.len;
  }
  return legs[0].at(0);
}

/** A closed cubic path through the samples, via Catmull-Rom. */
function smoothClosedPath(pts: { x: number; y: number }[]): string {
  const n = pts.length;
  const f = (i: number) => pts[((i % n) + n) % n];
  const r2 = (v: number) => Math.round(v * 100) / 100;

  let d = `M ${r2(pts[0].x)} ${r2(pts[0].y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = f(i - 1);
    const p1 = f(i);
    const p2 = f(i + 1);
    const p3 = f(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${r2(c1x)} ${r2(c1y)}, ${r2(c2x)} ${r2(c2y)}, ${r2(p2.x)} ${r2(p2.y)}`;
  }
  return `${d} Z`;
}

/** How many samples we take per wave — enough for the curve to read as a sine. */
const SAMPLES_PER_WAVE = 10;

function wavyPath(
  width: number,
  height: number,
  opts: { amplitude: number; period: number; radius: number }
) {
  const { amplitude, period } = opts;
  // Keep the whole wave — crest to trough — inside the measured box.
  const pad = amplitude;
  const w = Math.max(1, width - 2 * pad);
  const h = Math.max(1, height - 2 * pad);
  const radius = Math.max(0, Math.min(opts.radius, w / 2, h / 2));

  const perimeter =
    2 * (w - 2 * radius) + 2 * (h - 2 * radius) + 2 * Math.PI * radius;

  // A whole number of waves means the last crest meets the first seamlessly.
  const waves = Math.max(6, Math.round(perimeter / period));
  const count = waves * SAMPLES_PER_WAVE;

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const s = (i / count) * perimeter;
    const { x, y, nx, ny } = pointAt(s, w, h, radius);
    const offset = amplitude * Math.sin((i / count) * waves * 2 * Math.PI);
    pts.push({ x: pad + x + nx * offset, y: pad + y + ny * offset });
  }

  return smoothClosedPath(pts);
}

type WavyFrameProps = {
  /** Stroke colour. Defaults to the invite's rose. */
  color?: string;
  /** Wave height in px, crest to centreline. */
  amplitude?: number;
  /** Wave length in px along the perimeter. */
  period?: number;
  /** Corner radius of the underlying rounded rectangle. */
  radius?: number;
  strokeWidth?: number;
  /** Fill inside the frame — handy for using it as a card background. */
  fill?: string;
  className?: string;
};

export function WavyFrame({
  color = "var(--brand-rose)",
  amplitude = 6,
  period = 76,
  radius = 44,
  strokeWidth = 4,
  fill = "none",
  className,
}: WavyFrameProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Round to whole pixels so sub-pixel scroll jitter doesn't re-path.
      setSize((prev) => {
        const w = Math.round(width);
        const h = Math.round(height);
        return prev && prev.w === w && prev.h === h ? prev : { w, h };
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const d = React.useMemo(
    () =>
      size && size.w > 8 && size.h > 8
        ? wavyPath(size.w, size.h, { amplitude, period, radius })
        : null,
    [size, amplitude, period, radius]
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {d && size ? (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          fill="none"
          className="block"
        >
          <path
            d={d}
            fill={fill}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
}

/**
 * A single wavy rule — the same line, but only the top edge of it. Used to
 * separate sections without boxing them in.
 */
export function WavyRule({
  color = "var(--brand-rose)",
  amplitude = 5,
  period = 64,
  strokeWidth = 3,
  className,
}: {
  color?: string;
  amplitude?: number;
  period?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width))
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height = amplitude * 2 + strokeWidth * 2;

  const d = React.useMemo(() => {
    if (width < 16) return null;
    const waves = Math.max(2, Math.round(width / period));
    const count = waves * SAMPLES_PER_WAVE;
    const mid = height / 2;
    const pts: string[] = [];
    for (let i = 0; i <= count; i++) {
      const x = (i / count) * width;
      const y = mid + amplitude * Math.sin((i / count) * waves * 2 * Math.PI);
      // Quadratic-free: a dense polyline of a sine reads perfectly smooth at
      // 10 samples per wave once the stroke is rounded.
      pts.push(`${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`);
    }
    return `M ${pts.join(" L ")}`;
  }, [width, amplitude, period, height]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("w-full", className)}
      style={{ height }}
    >
      {d ? (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
}
