import type { UnavailableCopy } from "../types";

/** Unused while every product is sold in Brazil; required so a future product can skip /br. */
export const unavailable: UnavailableCopy = {
  meta: {
    title: "{product} - Ainda não disponível no Brasil",
    description: "O {product} ainda não está disponível no Brasil. Veja o que a AmiticIA oferece aqui.",
  },
  whatsappMessage: "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto.",
  stickyCta: "Fale conosco",
  eyebrow: "{product} · um produto AmiticIA",
  title: "{product} ainda não está disponível no Brasil",
  body: "Por enquanto, o {product} não é oferecido no Brasil. Fale com a gente para saber o que podemos fazer pelo seu negócio.",
  homeCta: "Ir para a página inicial",
};
