---
# DESIGN.md — amiticia.cc v2 (market pages: /br, later /it and /en)
# Scope: everything under src/site/**. The legacy pages (/ and /k) keep the old theme untouched.
name: AmiticIA v2
theme: dark-only
scope_class: .site-v2   # every token below is defined on this class, never on :root
colors:
  # surfaces (HSL triplets, consumed as hsl(var(--token)))
  background: "226 45% 5%"        # #070A12 page
  surface: "224 38% 8%"           # #0C111D cards
  surface-raised: "223 33% 11%"   # #121826 raised cards, menus
  border: "222 25% 16%"           # hairlines (also rgba(255,255,255,.08))
  foreground: "220 33% 97%"       # #F5F7FB primary text
  muted-foreground: "219 18% 70%" # #A7B0C2 body/secondary text (>= 7:1 on background)
  subtle-foreground: "220 13% 56%"# #828B9C captions only (>= 4.5:1 on background)
  # brand (AmiticIA): cyan -> violet, used sparingly
  brand-cyan: "195 100% 60%"      # #33CCFF
  brand-violet: "265 70% 70%"     # #A78BFA-ish
  gradient-brand: "linear-gradient(120deg, hsl(195 100% 60%), hsl(265 70% 70%))"
  # products
  wahub: "243 85% 68%"            # indigo of the WaHub app (#6E6CF5)
  wahub-2: "268 75% 62%"          # violet end of the WaHub bubble gradient
  patricia: "22 85% 70%"          # warm peach (#F2A477) — human, calm
  # actions
  whatsapp: "142 70% 49%"         # #25D366 — ONLY for WhatsApp actions
  whatsapp-foreground: "150 80% 6%" # #031A0D dark text on green (contrast ~9:1)
  focus-ring: "195 100% 60%"
typography:
  family: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif"
  source: "@fontsource-variable/plus-jakarta-sans (self-hosted, latin subset preloaded)"
  h1: { mobile: 36px, desktop: 64px, weight: 800, line-height: 1.05, tracking: -0.03em }
  h2: { mobile: 28px, desktop: 44px, weight: 750, line-height: 1.1, tracking: -0.02em }
  h3: { mobile: 20px, desktop: 24px, weight: 700, line-height: 1.25 }
  lead: { mobile: 18px, desktop: 20px, weight: 450, line-height: 1.55 }
  body: { size: 16px, weight: 400, line-height: 1.65 }
  eyebrow: { size: 13px, weight: 650, tracking: 0.08em, transform: uppercase }
  text-wrap: "balance on headings, pretty on paragraphs"
spacing:
  gutter: { mobile: 20px, desktop: 32px }
  container-max: 1200px
  section-y: { mobile: 72px, desktop: 120px }
  stack: [4, 8, 12, 16, 24, 32, 48, 64]
radius:
  control: 12px
  card: 20px
  feature-card: 28px
  pill: 9999px
elevation:
  hairline: "inset 0 1px 0 rgba(255,255,255,.06)"
  glow: "radial-gradient(closest-side, hsl(var(--glow)/.35), transparent)"
motion:
  durations: { fast: 160ms, base: 280ms, slow: 600ms }
  easing: "cubic-bezier(.22,1,.36,1)"
  reduced-motion: "every loop and reveal stops; final state shown"
breakpoints: { sm: 640px, md: 768px, lg: 1024px, xl: 1280px }
---

# AmiticIA v2 — design system

**Mood.** Calm, premium, warm-dark. A small-business owner opens the link from WhatsApp, on a phone,
often mid-conversation. The page must look like a real company with real products in the first
screen, then let them reach WhatsApp in one tap. Not neon, not "AI hype": product first.

**Concept: "a conversa que vira negócio".** Every page tells the same visual story — a WhatsApp
conversation turns into organized work (a lead in the funnel, a case briefing for the lawyer).
Real WaHub screenshots and coded illustrations carry that story; decoration never competes with it.

## Rules (non-negotiable)

1. **Scope.** All tokens live on `.site-v2`. Never edit `:root` tokens in `src/index.css`: the
   legacy `/` and `/k` pages must render exactly as before. Page-frame styles (min-height,
   background, `overflow-x: clip`) live on `.site-v2.v2-page`; base text styles use
   `:where(.site-v2)`; portalled content (menus, dialogs) carries the `site-v2` class.
2. **WhatsApp green is reserved** for WhatsApp actions, always with the WhatsApp glyph and dark
   text (`--whatsapp-foreground`). Nothing else is green.
3. **First screen works without JavaScript.** The prerendered HTML already shows the h1, the lead
   paragraph and a WhatsApp button. Hero text never starts at `opacity: 0`. Only decorative
   elements and below-the-fold sections animate.
4. **Below-the-fold reveals** use `[data-reveal]`: hidden only under `html.js` until the app marks
   `html.v2-ready`, with a CSS fallback that forces visibility after 2.5 s if the bundle never
   mounts, so a failed bundle never hides content.
5. **Reduced motion** (`prefers-reduced-motion: reduce`): loops stop, reveals are instant, the chat
   animation shows its final frame.
6. **Mobile first, 360 px is the floor.** Nothing crosses the viewport edge; every tap target is at
   least 44×44 px; the sticky WhatsApp bar never covers content (the page reserves its height)
   and steps aside while a hero or closing WhatsApp button is fully visible.
7. **Contrast AA** at minimum: body text uses `--muted-foreground`, never lighter grays on
   `--background`. Visible focus ring: 2 px `--focus-ring`, 2 px offset.
8. **Truth.** No client logos, testimonials, usage numbers or team photos. Product visuals are
   either real screenshots (fictitious demo data) or illustrations clearly built in code.
9. **Performance.** One font file family (variable, latin), WebP images with `srcset` and
   `loading="lazy"` below the fold, no third-party requests at runtime.

## Building blocks

| Block | Use | Source |
|---|---|---|
| Header | sticky, blurs on scroll; logo · nav · green "Fale conosco" pill; mobile: logo · WhatsApp icon · menu | own + Skiper `skiper40` links, `skiper41` progressive blur |
| Sticky WhatsApp bar | mobile only (`< md`), full-width green button, safe-area aware | own |
| Eyebrow | small uppercase label with a gradient dot | own |
| Product card | home: big clickable card, product-tinted glow, mini preview, "Conhecer →" | own + OriginKit `glow-border` |
| Phone + chat | WaHub hero: WhatsApp-style chat that types, then a lead card pops out | Cult `apple-iphone-17-pro` + OriginKit `live-chat` (restyled to WhatsApp) |
| Browser window + tabs | WaHub screenshots: Conversas / Funil / Leads | Cult `mock-browser-window` + `direction-aware-tabs` |
| Bento grid | WaHub "O que tem dentro": cards of varied size, some with screenshot crops | own |
| Steps | "Como funciona": 3 numbered steps joined by a line | own |
| Briefing card | Patrícia hero: chat → organized case for the lawyer, "Enviar / Editar" | own (coded illustration) |
| Rotating words | home hero accent word | OriginKit `type-sequence` (visible static word in SSR) |
| CTA band | end of every page: headline + WhatsApp button inside a glowing frame | OriginKit `glow-border` |
| Grain | hero texture at ~4 % opacity | Cult `texture-overlay` |
| Hand-drawn arrow | links chat → lead in the WaHub hero (desktop) | Cult `squiggle-arrow` |

Third-party components live in `src/components/kit/{cult,skiper,originkit}/`, adapted to this
project (Tailwind v3, `motion/react`, no Next.js APIs). Keep each file's attribution header.

## Imagery

- WaHub screenshots: `src/site/assets/wahub/*.webp` — demo tenant "Ótica Lumen", 100 % fictitious
  data, sidebar cropped out (the app still shows the "Nexus" name there).
- Product tint behind visuals: WaHub indigo→violet, Patrícia peach; AmiticIA brand gradient for
  company-level sections.
