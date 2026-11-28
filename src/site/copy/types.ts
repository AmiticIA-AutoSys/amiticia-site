/**
 * Typed shape of the copy of one market. Each page has its own file per market
 * (copy/<market>/<page>.ts) so page work never collides; this file is the contract.
 */
export type PageId = "home" | "wahub" | "unavailable";

export interface MetaCopy {
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  /** Path inside the site, optionally with a #hash; or a full URL when `external` is set. */
  to: string;
  /** A site of its own: opens in a new tab, and says so to a screen reader. */
  external?: boolean;
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

export interface HomeHeroCopy {
  title: string;
  leadHighlight: string;
  leadRest: string;
  tagline: string;
  primaryCta: string;
  secondaryCta: string;
  /** In-page anchor of the secondary button. Not set: the products section (#produtos). */
  secondaryHref?: string;
}

export interface HomeProductsCopy {
  title: string;
  /** Set: one paragraph under the title. */
  lead?: string;
  cards: Array<{
    productId: "wahub" | "saiunodou";
    name: string;
    title: string;
    body: string;
    cta: string;
    /** Set: the product lives on its own site, and the card opens it in a new tab. */
    href?: string;
  }>;
}

/** The product-first home (Italy): products, benefits, custom projects, about, audience. */
export interface HomeCopy {
  /** Not set: this layout. The consulting layout sets "consulting" (ConsultingHomeCopy). */
  layout?: "products";
  meta: MetaCopy;
  whatsappMessage: string;
  /** Label of the mobile sticky WhatsApp bar on this page. */
  stickyCta: string;
  hero: HomeHeroCopy;
  products: HomeProductsCopy;
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

/** One step of the consulting offer: how long it takes and what the client receives. */
export interface ConsultingStep {
  /** Duration or moment: "30 minutos, por vídeo", "Semana 1". */
  when: string;
  /** Set: a small tag beside the duration ("Grátis"). */
  badge?: string;
  title: string;
  body: string;
  receives: string;
}

/**
 * The consulting-first home (Brazil, 14/11): examples, method, then what is already installed, the
 * proof, who it is for and who it is not for. The products only move down.
 */
export interface ConsultingHomeCopy {
  layout: "consulting";
  meta: MetaCopy;
  whatsappMessage: string;
  stickyCta: string;
  hero: HomeHeroCopy;
  /** Everyday manual jobs the reader may recognise, before the method; `note` says it starts with one. */
  examples: {
    eyebrow: string;
    title: string;
    lead: string;
    items: string[];
    note: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Label of the "what you receive" box in each step. */
    receivesLabel: string;
    steps: ConsultingStep[];
    /** What happens when the job does not fit one stage: the card right after the steps. */
    larger: { when: string; title: string; body: string };
    /** What stays running after the delivery: the monthly follow-up. */
    followUp: { when: string; title: string; body: string };
    /**
     * ⏸ The price is the product owner's call (16/11, not decided). While `claim.value` is null the
     * fallback line renders, with no number; once set, the filled template replaces it.
     */
    price: { claim: PendingClaim; fallback: string };
  };
  products: HomeProductsCopy;
  about: HomeCopy["about"];
  fit: {
    title: string;
    forTitle: string;
    forItems: string[];
    notForTitle: string;
    notForItems: string[];
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
    /** End card shown over the video once it finishes: the question above the WhatsApp button. */
    endTitle: string;
    /** End card button that plays the video again. */
    replay: string;
  } | null;
}

/**
 * The page a market shows at a product's path when the product is not sold there
 * (no route needs it today). `{product}` in any string is replaced by the product's name.
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
  home: HomeCopy | ConsultingHomeCopy;
  wahub: WahubCopy;
  unavailable: UnavailableCopy;
}
