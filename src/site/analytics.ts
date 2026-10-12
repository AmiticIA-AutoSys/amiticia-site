/**
 * Cookieless analytics through Umami (self-hosted). The script tag is injected by the
 * prerender only when UMAMI_SCRIPT_URL and UMAMI_WEBSITE_ID are set, with
 * data-auto-track="false", so every pageview and event goes through here.
 *
 * Calls made before the script has loaded are queued and flushed on its `load` event
 * (or on the next call that finds `window.umami`). Without Umami everything is a no-op.
 */
import type { MarketId } from "./markets";
import type { PageId } from "./copy/types";

type UmamiPayload = Record<string, unknown>;

export interface Umami {
  track: (eventOrBuilder?: string | ((props: UmamiPayload) => UmamiPayload), data?: UmamiPayload) => void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

export type WhatsAppPlacement = "header" | "menu" | "hero" | "sticky" | "cta" | "card";

export interface WhatsAppClick {
  market: MarketId;
  page: PageId;
  placement: WhatsAppPlacement;
}

export const SCRIPT_ID = "umami-script";
const MAX_QUEUE = 50;

type Call = (umami: Umami) => void;
let queue: Call[] = [];
let listening: HTMLElement | null = null;

const currentUmami = (): Umami | undefined =>
  typeof window !== "undefined" && typeof window.umami?.track === "function" ? window.umami : undefined;

const flush = () => {
  const umami = currentUmami();
  if (!umami) return;
  const pending = queue;
  queue = [];
  for (const call of pending) {
    try {
      call(umami);
    } catch {
      // Analytics must never break the page.
    }
  }
};

const listenForScript = () => {
  if (typeof document === "undefined") return;
  const script = document.getElementById(SCRIPT_ID);
  if (!script || script === listening) return;
  listening = script;
  script.addEventListener("load", flush, { once: true });
};

const send = (call: Call) => {
  if (typeof window === "undefined") return;
  if (queue.length < MAX_QUEUE) queue.push(call);
  if (currentUmami()) flush();
  else listenForScript();
};

export const trackPageview = (): void => {
  if (typeof window === "undefined") return;
  const url = window.location.pathname + window.location.search;
  const title = document.title;
  send((umami) => umami.track((props) => ({ ...props, url, title })));
};

export const trackWhatsAppClick = ({ market, page, placement }: WhatsAppClick): void => {
  send((umami) => umami.track("whatsapp-click", { market, page, placement }));
};

export const __resetAnalyticsForTests = (): void => {
  queue = [];
  listening = null;
};
