/**
 * Typed shape of the copy of one market. Each page has its own file per market
 * (copy/<market>/<page>.ts) so page work never collides; this file is the contract.
 */
export type PageId = "home" | "wahub" | "patricia" | "unavailable";

export interface MetaCopy {
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  /** Path inside the site, optionally with a #hash. */
  to: string;
}

export interface NavGroup {
  label: string;
  items: NavLink[];
}

export interface CommonCopy {
  skipToContent: string;
  logoAlt: string;
  homeLinkLabel: string;
  nav: {
    label: string;
    products: NavGroup;
    links: NavLink[];
  };
  headerCta: string;
  whatsappIconLabel: string;
  menu: {
    open: string;
    title: string;
  };
  languageSwitcherLabel: string;
  footer: {
    brand: string;
    tagline: string;
    links: NavLink[];
    loginLabel: string;
    copyright: string;
  };
  /** Appended to the label of links that open in a new tab, for screen readers. */
  opensInNewTab: string;
  /** "(indicação de {ref})": appended to the WhatsApp message when the page is opened with ?ref=. null: no suffix. */
  referral: string | null;
}

export interface Step {
  title: string;
  body: string;
}

export interface ClosingCopy {
  title: string;
  body: string;
  cta: string;
}

export interface HomeCopy {
  meta: MetaCopy;
  whatsappMessage: string;
  /** Label of the mobile sticky WhatsApp bar on this page. */
  stickyCta: string;
  hero: {
    title: string;
    leadHighlight: string;
    leadRest: string;
    tagline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  products: {
    title: string;
    cards: Array<{
      productId: "wahub" | "patricia";
      name: string;
      title: string;
      body: string;
      cta: string;
    }>;
  };
  benefits: {
    title: string;
    items: string[];
  };
  custom: {
    eyebrow: string;
    title: string;
    lead: string;
    stack: {
      title: string;
      categories: string[];
      description: string;
    };
    process: {
      title: string;
      steps: Array<{ number: string; title: string; description: string }>;
    };
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    highlights: Array<{ value: string; label: string }>;
  };
  audience: {
    title: string;
    items: string[];
  };
  closing: ClosingCopy;
}

/** A claim that only renders once its value is confirmed. `{value}` in the template is replaced. */
export interface PendingClaim {
  value: string | null;
  template: string;
}

export interface WahubCopy {
  meta: MetaCopy;
  whatsappMessage: string;
  stickyCta: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    loginCta: string;
  };
  /** ⏸ "desde <mês/ano>" proof line under the hero. */
  liveSince: PendingClaim;
  howItWorks: {
    title: string;
    steps: Step[];
  };
  features: {
    title: string;
    items: Step[];
  };
  pricing: {
    title: string;
  };
  /** ⏸ "menos de 1/10 de um funcionário". No pricing section while null. */
  costComparison: PendingClaim;
  screenshots: {
    inbox: string;
    pipeline: string;
    leads: string;
  };
  closing: ClosingCopy;
  /** Demo video section right after the hero. null: the section does not render. */
  video: {
    title: string;
    caption: string;
    /** Accessible name of the video. */
    label: string;
  } | null;
}

export interface PatriciaCopy {
  meta: MetaCopy;
  whatsappMessage: string;
  stickyCta: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
  };
  problem: {
    title: string;
    items: string[];
  };
  howItWorks: {
    title: string;
    steps: Step[];
    risk: Step;
  };
  never: {
    title: string;
    body: string;
  };
  closing: ClosingCopy;
}

/**
 * The page a market shows at a product's path when the product is not sold there
 * (e.g. /it/patricia). `{product}` in any string is replaced by the product's name.
 */
export interface UnavailableCopy {
  meta: MetaCopy;
  whatsappMessage: string;
  stickyCta: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Link back to the market's home. */
  homeCta: string;
}

export interface MarketCopy {
  common: CommonCopy;
  home: HomeCopy;
  wahub: WahubCopy;
  /** Only in markets that sell Patrícia (products.ts). */
  patricia?: PatriciaCopy;
  unavailable: UnavailableCopy;
}
