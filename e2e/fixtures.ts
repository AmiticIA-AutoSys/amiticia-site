/** Expected values, written out by hand so the E2E suite is an independent oracle of the copy. */
export const BR_NUMBER = "5531986983745";
export const IT_NUMBER = "393926044070";

export interface MarketPage {
  path: string;
  lang: string;
  number: string;
  title: string;
  h1: string;
  message: string;
}

export const brPages: MarketPage[] = [
  {
    path: "/br",
    lang: "pt-BR",
    number: BR_NUMBER,
    title: "AmiticIA - Inteligência e Automação que Escala",
    h1: "Inteligência e Automação que Escala",
    message: "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto.",
  },
  {
    path: "/br/wahub",
    lang: "pt-BR",
    number: BR_NUMBER,
    title: "WaHub - Seu time inteiro atendendo no mesmo número do WhatsApp",
    h1: "Seu time inteiro atendendo no mesmo número do WhatsApp",
    message: "Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais.",
  },
  {
    path: "/br/patricia",
    lang: "pt-BR",
    number: BR_NUMBER,
    title: "Patrícia - A primeira conversa, organizada para o advogado",
    h1: "A primeira conversa, organizada para o advogado",
    message: "Olá! Vi a Patrícia no site da AmiticIA e gostaria de saber mais.",
  },
];

export const itPages: MarketPage[] = [
  {
    path: "/it",
    lang: "it-IT",
    number: IT_NUMBER,
    title: "AmiticIA - Intelligenza e Automazione che Scalano",
    h1: "Intelligenza e Automazione che Scalano",
    message: "Ciao Flavio, ho visto il sito AmiticIA e vorrei parlare di un progetto.",
  },
  {
    path: "/it/wahub",
    lang: "it-IT",
    number: IT_NUMBER,
    title: "WaHub - Tutto il tuo team risponde sullo stesso numero WhatsApp",
    h1: "Tutto il tuo team risponde sullo stesso numero WhatsApp",
    message: "Ciao Flavio, ho visto WaHub sul sito AmiticIA e vorrei saperne di più.",
  },
  {
    path: "/it/patricia",
    lang: "it-IT",
    number: IT_NUMBER,
    title: "Patrícia - Non disponibile in Italia",
    h1: "Patrícia non è ancora disponibile in Italia",
    message: "Ciao Flavio, ho visto il sito AmiticIA e vorrei parlare di un progetto.",
  },
];

/** Every prerendered market page. */
export const sitePages: MarketPage[] = [...brPages, ...itPages];

export const waHref = (message: string, number: string = BR_NUMBER) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
