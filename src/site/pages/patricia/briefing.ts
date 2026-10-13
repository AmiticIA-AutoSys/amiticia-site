import type { ChatMessage } from "@/components/kit/originkit/live-chat";

/**
 * The hero illustration's demo case: 100 % fictitious, calm, no names. It follows the product's
 * rules on screen: the assistant says it is an AI in its first line, asks one question at a time,
 * gives no legal advice, and the reply only reaches the client after the lawyer sends it.
 * Seen from the client's phone: "them" is the office's assistant, "me" is the client.
 */
export const briefing = {
  contact: { name: "Escritório de advocacia", status: "Assistente virtual · IA" },
  chat: [
    {
      sender: "them",
      text: "Olá! Sou a assistente virtual do escritório, uma inteligência artificial. Posso fazer algumas perguntas para o advogado entender o seu caso?",
      time: "09:12",
    },
    {
      sender: "me",
      text: "Quero entender como funciona a separação. Temos dois filhos e um apartamento financiado.",
      time: "09:13",
    },
    {
      sender: "them",
      text: "Entendi. Vocês já conversaram sobre com quem as crianças vão morar?",
      time: "09:13",
    },
  ] as ChatMessage[],
  caseTitle: "Caso organizado",
  caseStatus: { pending: "Organizando…", done: "Para o advogado" },
  fields: [
    { label: "Envolvidos", value: "Cliente, ex-marido e dois filhos" },
    { label: "Contexto", value: "Separados há dois meses, sem acordo" },
    { label: "Fato central", value: "Dúvidas sobre a separação" },
    { label: "Bens", value: "Apartamento financiado" },
  ],
  replyLabel: "Resposta pronta",
  reply: "Olá! Li o seu relato. Podemos conversar amanhã às 10h para eu explicar como funciona a separação?",
  actions: { send: "Enviar", edit: "Editar" },
};
