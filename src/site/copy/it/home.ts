import type { HomeCopy } from "../types";

// Translated from the approved /br copy (brief: AI translation, reviewed by Flavio).
// The Italian market sells only WaHub, so "products" read in the singular.
export const home: HomeCopy = {
  meta: {
    title: "AmiticIA - Intelligenza e Automazione che Scalano",
    description:
      "Abbiamo un prodotto pronto che integra l'IA per rispondere sul WhatsApp della tua azienda e costruiamo su misura ciò di cui la tua attività ha bisogno: agenti IA, dashboard e automazioni.",
  },
  whatsappMessage: "Ciao Flavio, ho visto il sito AmiticIA e vorrei parlare di un progetto.",
  stickyCta: "Contattaci",
  hero: {
    title: "Intelligenza e Automazione che Scalano",
    leadHighlight: "Intelligenza Artificiale & Business Intelligence",
    leadRest:
      " per il tuo problema. Abbiamo un prodotto pronto che integra l'IA per rispondere sul WhatsApp della tua azienda e costruiamo su misura ciò di cui la tua attività ha bisogno: agenti IA, dashboard che guidano le decisioni e automazioni che eliminano i compiti ripetitivi. Dalla diagnosi all'operatività, self-hosted o in cloud.",
    tagline: "Questo è Data & AI Ops in pratica.",
    primaryCta: "Parla con noi",
    secondaryCta: "Scopri il prodotto",
  },
  products: {
    title: "Il nostro prodotto",
    cards: [
      {
        productId: "wahub",
        name: "WaHub",
        title: "Tutto il tuo team risponde sullo stesso numero WhatsApp",
        body: "Un assistente IA risponde subito a ogni contatto, capisce cosa vuole la persona e passa il lead organizzato al tuo team per vendere.",
        cta: "Scopri WaHub",
      },
    ],
  },
  benefits: {
    title: "Cosa ottieni",
    items: [
      "Più fatturato con prospezione e offerte guidate dai dati",
      "Meno costi con automazioni e agenti che eseguono i compiti",
      "Decisioni rapide con Power BI ben modellato e KPI chiari",
      "Velocità di consegna: container, CI/CD e infrastruttura snella",
    ],
  },
  custom: {
    eyebrow: "Su misura",
    title: "Soluzioni su misura",
    lead: "Quando un prodotto pronto non basta, progettiamo e costruiamo noi la soluzione.",
    stack: {
      title: "Stack e infrastruttura che non ti lasciano a piedi",
      categories: ["Self-hosted e Cloud-Hybrid", "Dev & Data", "AI Engineering"],
      description:
        "LLM di mercato, RAG, vettori, valutazione delle risposte, osservabilità, sicurezza e scalabilità. Diamo priorità al modello giusto per il tuo caso e a un'architettura su misura.",
    },
    process: {
      title: "Come lavoriamo",
      steps: [
        {
          number: "01",
          title: "Diagnosi rapida",
          description: "capiamo obiettivi, dati, strumenti e vincoli.",
        },
        {
          number: "02",
          title: "Blueprint & MVP",
          description: "definiamo casi d'uso e architettura e consegniamo un MVP funzionante.",
        },
        {
          number: "03",
          title: "Scala & BI",
          description: "mettiamo in funzione agenti e BI con metriche, routine e miglioramenti continui.",
        },
      ],
    },
  },
  about: {
    eyebrow: "Chi siamo",
    title: "Vera ingegneria dietro l'IA",
    lead: "AmiticIA nasce da una convinzione semplice: l'intelligenza artificiale porta valore solo quando è costruita con l'architettura e l'ingegneria giuste fin dal primo giorno.",
    body: "La nostra base è il calcolo scientifico e ad alte prestazioni, e l'intelligenza artificiale non è una novità per noi: lavoriamo con le reti neurali dal 2006 e sviluppiamo progetti di IA dal 2020, ben prima di ChatGPT. È questo che consegniamo: soluzioni che funzionano, scalano e non diventano un problema più avanti.",
    highlights: [
      { value: "+20 anni", label: "di sviluppo software" },
      { value: "IA dal 2006", label: "prima dell'hype" },
      { value: "HPC", label: "calcolo scientifico ad alte prestazioni" },
    ],
  },
  audience: {
    title: "Per chi è",
    items: [
      "PMI, e-commerce, SaaS, industria e servizi B2B che vogliono crescere con l'IA senza dipendere da decine di strumenti scollegati.",
      "Team che hanno bisogno di dashboard affidabili (Power BI) e di automatizzare il 'lavoro invisibile'.",
    ],
  },
  closing: {
    title: "Iniziamo?",
    body: "Parla con noi per una diagnosi concreta: su cosa concentrarsi prima, che ritorno aspettarsi e qual è l'MVP ideale per iniziare.",
    cta: "Contattaci",
  },
};
