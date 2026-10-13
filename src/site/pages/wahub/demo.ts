import type { ChatMessage } from "@/components/kit/originkit/live-chat";

/**
 * Coded illustration of the hero (DESIGN.md rule 8): a WhatsApp conversation on the customer's
 * phone that turns into a lead. 100 % fictitious and consistent with the screenshots (demo tenant
 * "Ótica Lumen", customer "Ricardo"). It only shows what the copy says WaHub does: answer at
 * once, ask the business's questions, find out if it is a sale, hand the lead to a person.
 */
export const heroChat = {
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

export const heroLead = {
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
export const tourTabs = {
  label: "Telas do WaHub",
  url: "wahub.amiticia.cc",
  inbox: "Conversas",
  pipeline: "Funil",
  leads: "Leads",
};
