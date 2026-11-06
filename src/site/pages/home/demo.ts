import type { ChatMessage } from "@/components/kit/originkit/live-chat";
import { forMarket, type MarketId } from "../../markets";

/**
 * Labels drawn inside the home illustrations. They are visuals, not page copy: the demo tenant
 * and contacts are 100 % fictitious and match the WaHub page and share images.
 */
const brWahubDemo = {
  contact: "Ricardo",
  status: "online",
  chat: [
    { sender: "them", text: "Oi! Vocês fazem óculos de grau com filtro de luz azul?", time: "10:42" },
    { sender: "me", text: "Fazemos sim, Ricardo! É para usar no computador?", time: "10:42" },
  ] satisfies ChatMessage[],
  lead: {
    title: "Lead qualificado",
    name: "Ricardo Almeida",
    fields: [
      ["Interesse", "óculos de grau"],
      ["Lentes", "filtro de luz azul"],
    ],
    from: "Novo",
    to: "Qualificado",
    handoff: "Vendedor assume",
  },
};

/** Same scene in the Italian demo world (Ottica Lumen, Naples; customer Riccardo Esposito). */
const itWahubDemo: typeof brWahubDemo = {
  contact: "Riccardo",
  status: "online",
  chat: [
    { sender: "them", text: "Ciao! Fate occhiali da vista con filtro luce blu?", time: "10:42" },
    { sender: "me", text: "Certo, Riccardo! Le servono per il computer?", time: "10:42" },
  ] satisfies ChatMessage[],
  lead: {
    title: "Lead qualificato",
    name: "Riccardo Esposito",
    fields: [
      ["Interesse", "occhiali da vista"],
      ["Lenti", "filtro luce blu"],
    ],
    from: "Nuovo",
    to: "Qualificato",
    handoff: "Al venditore",
  },
};

export const wahubDemoFor = (market: MarketId) =>
  forMarket({ br: brWahubDemo, it: itWahubDemo }, market, "WaHub home demo");

export const productTint = {
  wahub: {
    color: "hsl(var(--wahub))",
    gradient: "linear-gradient(120deg, hsl(var(--wahub)), hsl(var(--wahub-2)))",
    text: "text-[hsl(243_90%_80%)]",
  },
} as const;
