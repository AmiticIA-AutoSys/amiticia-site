import type { CommonCopy } from "../types";

export const common: CommonCopy = {
  skipToContent: "Pular para o conteúdo",
  logoAlt: "AmiticIA",
  homeLinkLabel: "AmiticIA, página inicial",
  nav: {
    label: "Principal",
    products: {
      label: "Produtos",
      items: [
        { label: "WaHub", to: "/wahub" },
        { label: "Saiu no DOU", to: "https://saiunodou.com.br", external: true },
      ],
    },
    links: [
      { label: "Como trabalhamos", to: "/#como-trabalhamos" },
      { label: "Quem somos", to: "/#quem-somos" },
      { label: "Para quem é", to: "/#para-quem-e" },
    ],
  },
  headerCta: "Fale conosco",
  whatsappIconLabel: "Fale conosco pelo WhatsApp",
  menu: {
    open: "Abrir menu",
    title: "Menu",
  },
  languageSwitcherLabel: "Idioma",
  footer: {
    brand: "AmiticIA",
    tagline: "IA funcionando no seu negócio.",
    links: [
      { label: "WaHub", to: "/wahub" },
      { label: "Saiu no DOU", to: "https://saiunodou.com.br", external: true },
    ],
    loginLabel: "Entrar no WaHub",
    copyright: "© 2026 AmiticIA",
  },
  opensInNewTab: "(abre em nova aba)",
  referral: "(indicação de {ref})",
};
