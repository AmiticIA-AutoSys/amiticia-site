/**
 * Partner attribution: `?ref=<partner>` on a page adds "(indicação de <Partner>)" to the pre-filled
 * WhatsApp message. The value comes from the address bar, so it is reduced to a-z, 0-9 and hyphen.
 */
const MAX_LENGTH = 24;

/** Lowercase, keep [a-z0-9-], cut at 24 characters, capitalise the first letter. "" when nothing is left. */
export const sanitizeRef = (raw: string | null | undefined): string => {
  const clean = (raw ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, MAX_LENGTH);
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

/** The template (`{ref}` placeholder) filled with the sanitised partner, or null when there is nothing to add. */
export const fillReferral = (template: string | null | undefined, raw: string | null | undefined): string | null => {
  const ref = sanitizeRef(raw);
  if (!template || !ref) return null;
  return template.split("{ref}").join(ref);
};
