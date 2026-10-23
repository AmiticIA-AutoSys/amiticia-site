import type { WahubCopy } from "../types";

export const wahub: WahubCopy = {
  meta: {
    title: "WaHub - Seu time inteiro atendendo no mesmo número do WhatsApp",
    description:
      "O CRM feito para o WhatsApp das pequenas e médias empresas. Um assistente de IA responde na hora, entende o que o cliente quer e entrega o contato organizado para o seu time vender.",
  },
  whatsappMessage: "Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais.",
  stickyCta: "Falar sobre o WaHub",
  hero: {
    eyebrow: "WaHub · um produto AmiticIA",
    title: "Seu time inteiro atendendo no mesmo número do WhatsApp",
    lead: "O CRM feito para o WhatsApp das pequenas e médias empresas. Um assistente de IA responde na hora, entende o que o cliente quer e entrega o contato organizado para o seu time vender.",
    primaryCta: "Falar sobre o WaHub",
    loginCta: "Entrar",
  },
  // ⏸ Pending: set `value` to the confirmed "<mês/ano>" (e.g. "março de 2026") to show the line.
  liveSince: {
    value: null,
    template:
      "O assistente de IA do WaHub está testado e em uso numa empresa de serviços no Brasil desde {value}.",
  },
  howItWorks: {
    title: "Como funciona",
    steps: [
      { title: "O cliente chama no WhatsApp da empresa", body: ", no mesmo número de sempre." },
      {
        title: "O assistente de IA atende na hora",
        body: ", a qualquer hora. Faz as perguntas que o seu negócio precisa e descobre se é uma venda.",
      },
      {
        title: "O lead entra no funil já organizado",
        body: ", e o vendedor assume a conversa de onde a IA parou.",
      },
    ],
  },
  features: {
    title: "O que tem dentro",
    items: [
      {
        title: "Uma caixa de entrada para o time todo.",
        body: "Todos respondem pelo navegador, no mesmo número. Cada conversa tem responsável, status e histórico.",
      },
      {
        title: "Assistente de IA que qualifica.",
        body: "Faz as perguntas certas e passa a conversa para uma pessoa na hora certa.",
      },
      {
        title: "Funil de vendas.",
        body: "Cada negócio num quadro, do primeiro contato ao fechamento. Negócio parado ganha um aviso para ninguém esquecer.",
      },
      {
        title: "Ninguém fica sem resposta.",
        body: "Já no primeiro dia, o WaHub mostra quem perguntou algo nos últimos 60 dias e não recebeu resposta.",
      },
      {
        title: "Aprende com as suas conversas.",
        body: "O WaHub lê o histórico do seu WhatsApp e propõe como o assistente deve atender. Nada é ligado sem você revisar e aprovar.",
      },
      {
        title: "Retome conversas paradas.",
        body: "Depois de 24 horas sem resposta, o WhatsApp só deixa a empresa escrever com mensagens aprovadas pela Meta, e o WaHub envia essas mensagens.",
      },
      {
        title: "Você não troca de número.",
        body: "O WhatsApp Business continua funcionando no celular.",
      },
    ],
  },
  pricing: {
    title: "Quanto custa",
  },
  // ⏸ Pending: set `value` to "1/10" once the price and the cost of an attendant are confirmed.
  costComparison: {
    value: null,
    template: "Custa menos de {value} de um funcionário.",
  },
  screenshots: {
    inbox: "Caixa de entrada do WaHub com as conversas do WhatsApp da empresa (dados fictícios)",
    pipeline: "Funil de vendas do WaHub com os negócios em colunas (dados fictícios)",
    leads: "Lista de leads do WaHub (dados fictícios)",
  },
  closing: {
    title: "Quer ver o WaHub atendendo o seu WhatsApp?",
    body: "Mande uma mensagem e a gente mostra funcionando com o seu caso.",
    cta: "Falar sobre o WaHub",
  },
  video: {
    title: "Veja o WaHub atendendo, em 1min30",
    caption: "Empresa fictícia. As telas e as respostas do assistente de IA são reais; a narração usa voz sintética.",
    label: "Vídeo: o WaHub atendendo um cliente no WhatsApp, 1min30",
  },
};
