import type { ChatMessage } from "@/components/kit/originkit/live-chat";

/**
 * Labels drawn inside the home illustrations. They are visuals, not page copy: the demo tenant
 * and contacts are 100 % fictitious and match the WaHub and Patrícia pages and share images.
 */
export const wahubDemo = {
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

export const patriciaDemo = {
  client: "Cliente",
  message: "Quero entender como funciona a separação…",
  time: "19:08",
  case: {
    title: "Caso organizado",
    fields: [
      ["Envolvidos", "Cliente, ex-marido e dois filhos"],
      ["Contexto", "Separados há dois meses, sem acordo"],
      ["Fato central", "Dúvidas sobre a separação"],
      ["Bens", "Apartamento financiado"],
    ],
    replyLabel: "Resposta pronta",
    reply: "Olá! Li o seu relato. Podemos conversar amanhã às 10h para eu explicar como funciona a separação?",
    send: "Enviar",
    edit: "Editar",
  },
};

export const productTint = {
  wahub: {
    color: "hsl(var(--wahub))",
    gradient: "linear-gradient(120deg, hsl(var(--wahub)), hsl(var(--wahub-2)))",
    text: "text-[hsl(243_90%_80%)]",
  },
  patricia: {
    color: "hsl(var(--patricia))",
    gradient: "linear-gradient(120deg, hsl(var(--patricia)), hsl(22 85% 60%))",
    text: "text-patricia",
  },
} as const;
