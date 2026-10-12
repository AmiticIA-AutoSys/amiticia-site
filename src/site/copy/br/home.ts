import type { HomeCopy } from "../types";

export const home: HomeCopy = {
  meta: {
    title: "AmiticIA - Inteligência e Automação que Escala",
    description:
      "Temos produtos prontos que colocam a IA para atender no WhatsApp da sua empresa e construímos sob medida o que o seu negócio precisar: agentes de IA, dashboards e automações.",
  },
  whatsappMessage: "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto.",
  stickyCta: "Fale conosco",
  hero: {
    title: "Inteligência e Automação que Escala",
    leadHighlight: "Inteligência Artificial & Business Intelligence",
    leadRest:
      " para sua dor. Temos produtos prontos que colocam a IA para atender no WhatsApp da sua empresa e construímos sob medida o que o seu negócio precisar: agentes de IA, dashboards que guiam decisões e automações que eliminam tarefas repetitivas. Do diagnóstico à operação rodando, self-hosted ou cloud.",
    tagline: "Isso é Data & AI Ops na prática.",
    primaryCta: "Fale com a gente",
    secondaryCta: "Ver os produtos",
  },
  products: {
    title: "Nossos produtos",
    cards: [
      {
        productId: "wahub",
        name: "WaHub",
        title: "Seu time inteiro atendendo no mesmo número do WhatsApp",
        body: "Um assistente de IA atende cada contato na hora, descobre o que a pessoa quer e entrega o lead organizado para o seu time vender.",
        cta: "Conhecer o WaHub",
      },
      {
        productId: "patricia",
        name: "Patrícia",
        title: "A primeira conversa, organizada para o advogado",
        body: "A assistente de IA para escritórios de Direito de Família. Acolhe o cliente no WhatsApp e entrega o caso organizado ao advogado.",
        cta: "Conhecer a Patrícia",
      },
    ],
  },
  benefits: {
    title: "O que você ganha",
    items: [
      "Mais receita com prospecção e ofertas orientadas por dados",
      "Menos custo com automações e agentes que executam tarefas",
      "Decisões rápidas com Power BI bem modelado e KPIs claros",
      "Velocidade de entrega: containers, CI/CD e infraestrutura enxuta",
    ],
  },
  custom: {
    eyebrow: "Sob medida",
    title: "Projetos sob medida",
    lead: "Quando o seu problema não cabe num produto pronto, a gente desenha e constrói a solução.",
    stack: {
      title: "Stack & Infra que não te deixa na mão",
      categories: ["Self-hosted e Cloud-Hybrid", "Dev & Data", "AI Engineering"],
      description:
        "LLMs de mercado, RAG, vetores, avaliação de respostas, observabilidade, segurança e escala. Nós priorizamos modelo certo para o seu caso e arquitetura sob medida.",
    },
    process: {
      title: "Como trabalhamos",
      steps: [
        {
          number: "01",
          title: "Diagnóstico Rápido",
          description: "entendemos metas, dados, ferramentas e restrições.",
        },
        {
          number: "02",
          title: "Blueprint & MVP",
          description: "definimos casos de uso, arquitetura e entregamos um MVP funcional.",
        },
        {
          number: "03",
          title: "Escala & BI",
          description: "colocamos agentes e BI para rodar com métricas, rotinas e melhorias contínuas.",
        },
      ],
    },
  },
  about: {
    eyebrow: "Quem somos",
    title: "Engenharia de verdade por trás da IA",
    lead: "A AmiticIA nasceu de uma convicção simples: inteligência artificial só entrega valor quando é construída com arquitetura e engenharia corretas desde o primeiro dia.",
    body: "Nossa base é computação científica e de alto desempenho, e inteligência artificial não é novidade aqui: trabalhamos com redes neurais desde 2006 e desenvolvemos projetos com IA desde 2020, bem antes do ChatGPT. É isso que entregamos: soluções que funcionam, escalam e não viram dor de cabeça lá na frente.",
    highlights: [
      { value: "+20 anos", label: "desenvolvendo software" },
      { value: "IA desde 2006", label: "antes do hype" },
      { value: "HPC", label: "computação científica de alto desempenho" },
    ],
  },
  audience: {
    title: "Para quem é",
    items: [
      "PMEs, E-commerce, SaaS, Indústria e Serviços B2B que querem crescer com IA sem depender de dezenas de ferramentas desconexas.",
      "Times que precisam de dashboards confiáveis (Power BI) e automação do 'trabalho invisível'.",
    ],
  },
  closing: {
    title: "Vamos começar?",
    body: "Fale com a gente para um diagnóstico objetivo: no que focar primeiro, que retorno esperar e qual o MVP ideal para começar.",
    cta: "Fale conosco",
  },
};
