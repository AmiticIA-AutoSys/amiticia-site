import type { ConsultingHomeCopy } from "../types";

// Consulting first (decision of 14/11): the method leads, the products move down. DRAFT copy for
// the product owner to ratify. Three things are his and not decided: a price on the site (see
// howItWorks.price), which CNPJ appears, and whether the city appears (see about.lead).
export const home: ConsultingHomeCopy = {
  layout: "consulting",
  meta: {
    title: "AmiticIA - IA funcionando no seu negócio",
    description:
      "Vamos até a sua empresa, achamos a rotina que mais pesa e a deixamos funcionando em duas semanas. A primeira conversa é grátis.",
  },
  whatsappMessage: "Olá! Vim pelo site da AmiticIA e quero marcar a conversa de 30 minutos.",
  stickyCta: "Marcar a conversa",
  hero: {
    title: "IA funcionando no seu negócio.",
    leadHighlight: "Vamos até a sua empresa",
    leadRest: ", achamos a rotina que mais pesa e a deixamos funcionando em duas semanas.",
    tagline: "A primeira conversa é grátis: 30 minutos, por telefone.",
    primaryCta: "Marcar a conversa",
    secondaryCta: "Ver como funciona",
    secondaryHref: "#como-trabalhamos",
  },
  howItWorks: {
    eyebrow: "Como funciona",
    title: "Uma rotina funcionando em duas semanas",
    lead: "Em cada passo você sabe o que recebe e quanto tempo leva.",
    receivesLabel: "Você recebe",
    steps: [
      {
        when: "30 minutos, por telefone",
        badge: "Grátis",
        title: "Conversa",
        body: "Você conta como a empresa funciona hoje e onde a equipe perde mais tempo.",
        receives: "Uma resposta direta: se a IA ajuda no seu caso e por onde começar.",
      },
      {
        when: "Semana 1",
        title: "Diagnóstico",
        body: "Vamos até a empresa, acompanhamos quem faz o trabalho e escolhemos com você a rotina que mais pesa.",
        receives: "O plano da rotina escolhida: o que muda, quem usa e como vai funcionar.",
      },
      {
        when: "Semana 2",
        title: "Rotina funcionando",
        body: "Construímos a solução e colocamos para rodar dentro da sua empresa, junto com a sua equipe.",
        receives: "A primeira rotina funcionando até o fim da segunda semana, com a equipe sabendo usar.",
      },
    ],
    followUp: {
      when: "Depois, se você quiser",
      title: "Acompanhamento mensal",
      body: "Cuidamos para a rotina continuar funcionando, ajustamos o que for preciso e, quando fizer sentido, partimos para a próxima.",
    },
    price: {
      // ⏸ null until the product owner decides to show the price on the site.
      claim: { value: null, template: "As duas semanas custam {value}, com o preço fechado antes de começar." },
      fallback: "O preço das duas semanas é fechado. Você fica sabendo na conversa, antes de decidir qualquer coisa.",
    },
  },
  products: {
    title: "O que já construímos",
    lead: "Duas ferramentas nossas, já no ar. Quando o WaHub resolve a rotina da sua empresa, começamos por ele.",
    cards: [
      {
        productId: "wahub",
        name: "WaHub",
        title: "Seu time inteiro atendendo no mesmo número do WhatsApp",
        body: "Um assistente de IA atende cada contato na hora, descobre o que a pessoa quer e entrega o lead organizado para o seu time vender.",
        cta: "Conhecer o WaHub",
      },
      {
        productId: "saiunodou",
        name: "Saiu no DOU",
        title: "Busca pública e gratuita no Diário Oficial da União",
        body: "Portarias, editais, nomeações, aposentadorias e concursos: cada resultado leva à publicação oficial no DOU.",
        cta: "Conhecer o Saiu no DOU",
        href: "https://saiunodou.com.br",
      },
    ],
  },
  about: {
    eyebrow: "Quem somos",
    title: "Quem vai até a sua empresa",
    // The line that would carry the city, if the product owner decides to show it.
    lead: "É o André quem faz a conversa, vai até a sua empresa e constrói a solução.",
    body: "Nossa base é computação científica e de alto desempenho, e inteligência artificial não é novidade aqui: trabalhamos com redes neurais desde 2006. É isso que entregamos: soluções que funcionam, escalam e não viram dor de cabeça lá na frente.",
    highlights: [
      { value: "Em produção", label: "um cliente pagante usa o WaHub" },
      { value: "IA desde 2006", label: "redes neurais, bem antes do ChatGPT" },
      { value: "+20 anos", label: "desenvolvendo software" },
    ],
    photo: { alt: "Foto de André", caption: "André" },
  },
  fit: {
    title: "É para a sua empresa?",
    forTitle: "Para quem é",
    forItems: [
      "Empresas pequenas e médias com uma rotina que toma horas da equipe toda semana.",
      "Donos que querem ver uma rotina funcionando antes de pensar na próxima.",
      "Quem pode nos receber na empresa e mostrar o trabalho como ele é feito hoje.",
    ],
    notForTitle: "Para quem não é",
    notForItems: [
      "Quem procura só um site, um aplicativo ou uma loja virtual.",
      "Quem não pode separar algumas horas da equipe na semana do diagnóstico.",
      "Quem espera que a IA substitua a equipe inteira.",
    ],
  },
  closing: {
    title: "Vamos começar?",
    body: "Marque a conversa de 30 minutos pelo WhatsApp. É grátis, e no fim você sabe se vale seguir.",
    cta: "Marcar a conversa",
  },
};
