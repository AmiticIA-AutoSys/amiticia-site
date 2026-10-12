import type { PatriciaCopy } from "../types";

export const patricia: PatriciaCopy = {
  meta: {
    title: "Patrícia - A primeira conversa, organizada para o advogado",
    description:
      "A assistente de IA para escritórios de Direito de Família. Acolhe o cliente no WhatsApp e entrega o caso organizado ao advogado.",
  },
  whatsappMessage: "Olá! Vi a Patrícia no site da AmiticIA e gostaria de saber mais.",
  stickyCta: "Falar sobre a Patrícia",
  hero: {
    eyebrow: "Patrícia · um produto AmiticIA",
    title: "A primeira conversa, organizada para o advogado",
    lead: "A Patrícia é a assistente de IA para escritórios de Direito de Família. Ela acolhe o cliente logo no primeiro contato pelo WhatsApp e transforma uma história cheia de emoção em fatos organizados para o advogado, sem dar consultoria jurídica e sem tirar o advogado do centro do atendimento.",
    primaryCta: "Falar sobre a Patrícia",
  },
  problem: {
    title: "O problema",
    items: [
      "O advogado gasta a consulta, que é o tempo mais caro dele, coletando o básico: quem são os envolvidos, o que aconteceu, quando, se há bens.",
      "Quem chega não sabe o que é importante contar, e conta de um jeito emocional e fora de ordem.",
      "O contato chega a qualquer hora. Sem resposta rápida, o cliente procura outro escritório, e o escritório nem fica sabendo.",
    ],
  },
  howItWorks: {
    title: "Como funciona",
    steps: [
      {
        title: "Ela atende pelo WhatsApp.",
        body: "Diz desde a primeira mensagem que é uma assistente de IA e faz uma pergunta por vez.",
      },
      {
        title: "Ela entende o caso o suficiente.",
        body: "Quando já sabe quem são os envolvidos, o contexto e o fato central, para de perguntar.",
      },
      {
        title: "O advogado decide.",
        body: "Ele recebe o caso organizado com uma resposta pronta e, em um clique, envia ou edita. Nada chega ao cliente sem a aprovação dele.",
      },
    ],
    risk: {
      title: "Quando há risco.",
      body: "Se aparece risco à segurança de alguém, principalmente de uma criança, ela marca o caso como prioridade para o advogado.",
    },
  },
  never: {
    title: "O que ela nunca faz",
    body: "Não dá consultoria jurídica, não define estratégia, não promete resultado e não decide quem tem razão.",
  },
  closing: {
    title: "Quer a Patrícia no seu escritório?",
    body: "Mande uma mensagem e a gente mostra como ela atende.",
    cta: "Falar sobre a Patrícia",
  },
};
