import type { WahubCopy } from "../types";

export const wahub: WahubCopy = {
  meta: {
    title: "WaHub - Tutto il tuo team risponde sullo stesso numero WhatsApp",
    description:
      "Il CRM pensato per il WhatsApp delle piccole e medie imprese. Un assistente IA risponde subito, capisce cosa vuole il cliente e consegna il contatto organizzato al tuo team per vendere.",
  },
  // Ratified in the brief, word for word.
  whatsappMessage: "Ciao Flavio, ho visto WaHub sul sito AmiticIA e vorrei saperne di più.",
  stickyCta: "Parliamo di WaHub",
  hero: {
    eyebrow: "WaHub · un prodotto AmiticIA",
    title: "Tutto il tuo team risponde sullo stesso numero WhatsApp",
    lead: "Il CRM pensato per il WhatsApp delle piccole e medie imprese. Un assistente IA risponde subito, capisce cosa vuole il cliente e consegna il contatto organizzato al tuo team per vendere.",
    primaryCta: "Parliamo di WaHub",
    loginCta: "Accedi",
  },
  // ⏸ Pending, as in /br: set `value` to the confirmed month and year to show the line.
  liveSince: {
    value: null,
    template: "L'assistente IA di WaHub è testato e in uso in un'azienda di servizi in Brasile da {value}.",
  },
  howItWorks: {
    title: "Come funziona",
    steps: [
      { title: "Il cliente scrive sul WhatsApp dell'azienda", body: ", sul numero di sempre." },
      {
        title: "L'assistente IA risponde subito",
        body: ", a qualsiasi ora. Fa le domande di cui la tua attività ha bisogno e capisce se è una vendita.",
      },
      {
        title: "Il lead entra nella pipeline già organizzato",
        body: ", e il venditore riprende la conversazione da dove l'IA si è fermata.",
      },
    ],
  },
  features: {
    title: "Cosa c'è dentro",
    items: [
      {
        title: "Una sola inbox per tutto il team.",
        body: "Tutti rispondono dal browser, sullo stesso numero. Ogni conversazione ha un responsabile, uno stato e uno storico.",
      },
      {
        title: "Un assistente IA che qualifica.",
        body: "Fa le domande giuste e passa la conversazione a una persona al momento giusto.",
      },
      {
        title: "Pipeline di vendita.",
        body: "Ogni trattativa su una bacheca, dal primo contatto alla chiusura. Una trattativa ferma riceve un avviso, così nessuno se ne dimentica.",
      },
      {
        title: "Nessuno resta senza risposta.",
        body: "Già dal primo giorno, WaHub mostra chi ha chiesto qualcosa negli ultimi 60 giorni senza ricevere risposta.",
      },
      {
        title: "Impara dalle tue conversazioni.",
        body: "WaHub legge lo storico del tuo WhatsApp e propone come l'assistente deve rispondere. Niente si attiva senza che tu lo riveda e lo approvi.",
      },
      {
        title: "Riprendi le conversazioni ferme.",
        body: "Dopo 24 ore senza risposta, WhatsApp lascia scrivere all'azienda solo con messaggi approvati da Meta, e WaHub invia quei messaggi.",
      },
      {
        title: "Non cambi numero.",
        body: "WhatsApp Business continua a funzionare sul telefono.",
      },
    ],
  },
  pricing: {
    title: "Quanto costa",
  },
  // Ratified for Italy (brief): 80–150 €/month against 2,000–2,500 €/month for an employee.
  // Stops being true above ~200 €/month. No € amount appears on the page.
  costComparison: {
    value: "1/10",
    template: "Costa meno di {value} di un dipendente.",
  },
  screenshots: {
    inbox: "Inbox di WaHub con le conversazioni WhatsApp dell'azienda (dati fittizi)",
    pipeline: "Pipeline di vendita di WaHub con le trattative in colonne (dati fittizi)",
    leads: "Elenco dei lead di WaHub (dati fittizi)",
  },
  closing: {
    title: "Vuoi vedere WaHub rispondere sul tuo WhatsApp?",
    body: "Scrivici un messaggio e te lo mostriamo in funzione con il tuo caso.",
    cta: "Parliamo di WaHub",
  },
  video: null,
};
