import type { ChatMessage } from "@/components/kit/originkit/live-chat";
import { forMarket, type MarketId } from "../../markets";

/**
 * Coded illustration of the hero (DESIGN.md rule 8): a WhatsApp conversation on the customer's
 * phone that turns into a lead. 100 % fictitious and consistent with the screenshots (demo tenant
 * "Ótica Lumen", customer "Ricardo"). It only shows what the copy says WaHub does: answer at
 * once, ask the business's questions, find out if it is a sale, hand the lead to a person.
 */
const brHeroChat = {
  business: "Ótica Lumen",
  status: "online",
  composer: "Mensagem",
  messages: [
    { sender: "me", text: "Oi! Vocês fazem óculos de grau?", time: "9:38" },
    { sender: "them", text: "Oi, Ricardo! Sou o assistente da Ótica Lumen. Fazemos, sim.", time: "9:38" },
    { sender: "them", text: "Você já tem a receita do oftalmologista?", time: "9:38" },
    { sender: "me", text: "Tenho. Passo o dia todo no computador.", time: "9:40" },
    {
      sender: "them",
      text: "Então vale a lente com filtro de luz azul. Posso pedir a um vendedor para separar armações para você?",
      time: "9:40",
    },
    { sender: "me", text: "Pode, sim!", time: "9:41" },
  ] satisfies ChatMessage[],
};

const brHeroLead = {
  badge: "Lead qualificado",
  name: "Ricardo Almeida",
  fields: [
    { label: "Interesse", value: "Óculos de grau" },
    { label: "Lente", value: "Filtro de luz azul" },
  ],
  stageLabel: "Estágio",
  stageFrom: "Novo",
  stageTo: "Qualificado",
  handoff: "Vendedor assume",
};

/** Labels of the product-tour tabs (the app's own section names). */
const brTourTabs = {
  label: "Telas do WaHub",
  url: "wahub.amiticia.cc",
  inbox: "Conversas",
  pipeline: "Funil",
  leads: "Leads",
};

/** The Italian demo world of the Italian screenshots: Ottica Lumen (Naples), Riccardo Esposito. */
const itHeroChat: typeof brHeroChat = {
  business: "Ottica Lumen",
  status: "online",
  composer: "Messaggio",
  messages: [
    { sender: "me", text: "Ciao! Fate occhiali da vista?", time: "9:38" },
    { sender: "them", text: "Ciao Riccardo! Sono l'assistente di Ottica Lumen. Sì, certo.", time: "9:38" },
    { sender: "them", text: "Ha già la prescrizione dell'oculista?", time: "9:38" },
    { sender: "me", text: "Sì. Sto tutto il giorno al computer.", time: "9:40" },
    {
      sender: "them",
      text: "Allora conviene la lente con filtro luce blu. Posso chiedere a un venditore di prepararle qualche montatura?",
      time: "9:40",
    },
    { sender: "me", text: "Sì, grazie!", time: "9:41" },
  ] satisfies ChatMessage[],
};

const itHeroLead: typeof brHeroLead = {
  badge: "Lead qualificato",
  name: "Riccardo Esposito",
  fields: [
    { label: "Interesse", value: "Occhiali da vista" },
    { label: "Lente", value: "Filtro luce blu" },
  ],
  stageLabel: "Fase",
  stageFrom: "Nuovo",
  stageTo: "Qualificato",
  handoff: "Al venditore",
};

const itTourTabs: typeof brTourTabs = {
  label: "Schermate di WaHub",
  url: "wahub.amiticia.cc",
  inbox: "Conversazioni",
  pipeline: "Pipeline",
  leads: "Lead",
};

export interface WahubDemo {
  heroChat: typeof brHeroChat;
  heroLead: typeof brHeroLead;
  tourTabs: typeof brTourTabs;
}

const demos: Partial<Record<MarketId, WahubDemo>> = {
  br: { heroChat: brHeroChat, heroLead: brHeroLead, tourTabs: brTourTabs },
  it: { heroChat: itHeroChat, heroLead: itHeroLead, tourTabs: itTourTabs },
};

export const wahubDemoFor = (market: MarketId): WahubDemo => forMarket(demos, market, "WaHub page demo");
