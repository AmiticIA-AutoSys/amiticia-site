/** Class recipes shared by the home sections, so a new section wears the same skin as the old ones. */

/** Subtle brand border: a faint cyan→violet gradient on the border box under a solid surface. */
export const brandBorder =
  "border border-transparent [background:linear-gradient(hsl(var(--surface)),hsl(var(--surface)))_padding-box,linear-gradient(120deg,hsl(var(--brand-cyan)/0.45),hsl(var(--border))_45%,hsl(var(--brand-violet)/0.45))_border-box]";

/** The gradient line joining numbered steps; `--line-dir` turns it (to bottom on phones, to right from md). */
export const brandLine = "linear-gradient(var(--line-dir), hsl(var(--brand-cyan)), hsl(var(--brand-violet)))";

/** Numbered step badge: a conic brand ring around a dark disc. */
export const stepRingClass =
  "relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_120deg,hsl(var(--brand-cyan)),hsl(var(--brand-violet)),hsl(var(--brand-cyan)))] p-px";
export const stepDiscClass =
  "inline-flex h-full w-full items-center justify-center rounded-full bg-background text-base font-extrabold tabular-nums text-foreground";

/** Plain card: the home's tiles and lists. */
export const cardClass = "rounded-[20px] border border-border bg-surface shadow-[var(--hairline)]";

/** Small uppercase label, the eyebrow's type without its dot. */
export const labelClass = "text-[13px] font-[650] uppercase tracking-[0.08em]";
