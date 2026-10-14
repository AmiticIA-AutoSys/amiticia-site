import type { APIRequestContext } from "@playwright/test";

/** Expected values, written out by hand so the E2E suite is an independent oracle of the copy. */
export const BR_NUMBER = "5531986983745";
export const IT_NUMBER = "393926044070";

/** The two production hostnames. The suite reaches both on the one container (see playwright.config.ts). */
export const BR_HOST = "amiticia.com.br";
export const IT_HOST = "amiticia.cc";

/** What a browser or a request must use to reach `path` on `host` (plain http: the container has no TLS). */
export const urlOf = (host: string, path: string) => `http://${host}${path}`;
export const brUrl = (path: string) => urlOf(BR_HOST, path);
export const itUrl = (path: string) => urlOf(IT_HOST, path);

/** GET from the container as `host`: the Host header is what nginx picks the market by. */
export const getAs = (
  request: APIRequestContext,
  host: string,
  path: string,
  options: { headers?: Record<string, string>; maxRedirects?: number } = {},
) => request.get(path, { ...options, headers: { ...options.headers, Host: host } });

export interface MarketPage {
  host: string;
  /** Origin written into canonical and og:image: what the page's market owns. */
  origin: string;
  path: string;
  /** Where a browser opens it in the suite. */
  url: string;
  lang: string;
  number: string;
  title: string;
  h1: string;
  message: string;
}

export const brPages: MarketPage[] = [
  {
    host: BR_HOST,
    origin: "https://amiticia.com.br",
    path: "/",
    url: brUrl("/"),
    lang: "pt-BR",
    number: BR_NUMBER,
    title: "AmiticIA - Inteligência e Automação que Escala",
    h1: "Inteligência e Automação que Escala",
    message: "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto.",
  },
  {
    host: BR_HOST,
    origin: "https://amiticia.com.br",
    path: "/wahub",
    url: brUrl("/wahub"),
    lang: "pt-BR",
    number: BR_NUMBER,
    title: "WaHub - Seu time inteiro atendendo no mesmo número do WhatsApp",
    h1: "Seu time inteiro atendendo no mesmo número do WhatsApp",
    message: "Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais.",
  },
  {
    host: BR_HOST,
    origin: "https://amiticia.com.br",
    path: "/patricia",
    url: brUrl("/patricia"),
    lang: "pt-BR",
    number: BR_NUMBER,
    title: "Patrícia - A primeira conversa, organizada para o advogado",
    h1: "A primeira conversa, organizada para o advogado",
    message: "Olá! Vi a Patrícia no site da AmiticIA e gostaria de saber mais.",
  },
];

export const itPages: MarketPage[] = [
  {
    host: IT_HOST,
    origin: "https://amiticia.cc",
    path: "/it",
    url: itUrl("/it"),
    lang: "it-IT",
    number: IT_NUMBER,
    title: "AmiticIA - Intelligenza e Automazione che Scalano",
    h1: "Intelligenza e Automazione che Scalano",
    message: "Ciao Flavio, ho visto il sito AmiticIA e vorrei parlare di un progetto.",
  },
  {
    host: IT_HOST,
    origin: "https://amiticia.cc",
    path: "/it/wahub",
    url: itUrl("/it/wahub"),
    lang: "it-IT",
    number: IT_NUMBER,
    title: "WaHub - Tutto il tuo team risponde sullo stesso numero WhatsApp",
    h1: "Tutto il tuo team risponde sullo stesso numero WhatsApp",
    message: "Ciao Flavio, ho visto WaHub sul sito AmiticIA e vorrei saperne di più.",
  },
  {
    host: IT_HOST,
    origin: "https://amiticia.cc",
    path: "/it/patricia",
    url: itUrl("/it/patricia"),
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
