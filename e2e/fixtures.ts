/** Expected values, written out by hand so the E2E suite is an independent oracle of the copy. */
export const BR_NUMBER = "5531986983745";

export interface MarketPage {
  path: string;
  title: string;
  h1: string;
  message: string;
}

export const brPages: MarketPage[] = [
  {
    path: "/br",
    title: "AmiticIA - Inteligência e Automação que Escala",
    h1: "Inteligência e Automação que Escala",
    message: "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto.",
  },
  {
    path: "/br/wahub",
    title: "WaHub - Seu time inteiro atendendo no mesmo número do WhatsApp",
    h1: "Seu time inteiro atendendo no mesmo número do WhatsApp",
    message: "Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais.",
  },
  {
    path: "/br/patricia",
    title: "Patrícia - A primeira conversa, organizada para o advogado",
    h1: "A primeira conversa, organizada para o advogado",
    message: "Olá! Vi a Patrícia no site da AmiticIA e gostaria de saber mais.",
  },
];

export const waHref = (message: string) => `https://wa.me/${BR_NUMBER}?text=${encodeURIComponent(message)}`;
