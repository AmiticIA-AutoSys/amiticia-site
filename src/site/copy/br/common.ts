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
        { label: "Patrícia", to: "/patricia" },
      ],
    },
    links: [
      { label: "Sob medida", to: "/#sob-medida" },
      { label: "Como trabalhamos", to: "/#como-trabalhamos" },
      { label: "Quem somos", to: "/#quem-somos" },
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
    tagline: "Data & AI Ops",
    links: [
      { label: "WaHub", to: "/wahub" },
      { label: "Patrícia", to: "/patricia" },
    ],
    loginLabel: "Entrar no WaHub",
    copyright: "© 2026 AmiticIA",
  },
  opensInNewTab: "(abre em nova aba)",
  referral: "(indicação de {ref})",
};
