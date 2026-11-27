import type { ConsultingHomeCopy } from "../types";

// Consulting first (decision of 14/11): the method leads, the products move down. Reworded on 17/11
// so that no line counts clients, none promises a finished job in a fixed time, and a reader who
// does not know what can be automated finds examples before the method. The page stays clean:
// contract terms for edge cases belong in the written proposal, not here. Vocabulary: "serviço" is
// the client's own task, "trabalho" is ours; "passo" is one of the three steps, "etapa" is one
// slice of the construction. Three things are the product owner's and not decided: a price on the
// site (see howItWorks.price), which CNPJ appears, and whether the city appears (see about.lead).
export const home: ConsultingHomeCopy = {
  layout: "consulting",
  meta: {
    title: "AmiticIA - IA funcionando no seu negócio",
    description:
      "Vamos até a sua empresa, encontramos o serviço repetitivo que mais toma tempo da sua equipe e colocamos a IA para trabalhar nele. A primeira conversa é grátis.",
  },
  whatsappMessage: "Olá! Vim pelo site da AmiticIA e quero marcar a conversa de 30 minutos.",
  stickyCta: "Marcar a conversa",
  hero: {
    title: "IA funcionando no seu negócio.",
    leadHighlight: "Vamos até a sua empresa",
    leadRest: ", encontramos o serviço repetitivo que mais toma tempo da sua equipe e colocamos a IA para trabalhar nele.",
    tagline:
      "A primeira conversa é grátis: 30 minutos, por telefone. Depois, uma semana de diagnóstico diz o que fazer e quanto custa.",
    primaryCta: "Marcar a conversa",
    secondaryCta: "Ver como funciona",
    secondaryHref: "#como-trabalhamos",
  },
  examples: {
    eyebrow: "Onde a IA ajuda",
    title: "Sua equipe faz algum destes serviços toda semana?",
    lead: "Você não precisa saber o que a IA faz. Se um destes serviços se repete na sua empresa, é por aí que o trabalho costuma começar.",
    items: [
      "Digitar no sistema o que chegou por WhatsApp, e-mail ou PDF.",
      "Conferir nota fiscal, boleto ou extrato com a planilha.",
      "Cobrar de cliente documento, resposta ou pagamento atrasado, um por um.",
      "Responder as mesmas perguntas no WhatsApp o dia inteiro.",
      "Fechar o mês juntando dados de várias planilhas e sistemas.",
      "Confirmar consulta, visita ou entrega, mensagem por mensagem.",
    ],
    note: "Começamos por um deles. Os outros ficam para depois, um de cada vez, se você quiser.",
  },
  howItWorks: {
    eyebrow: "Como funciona",
    title: "Você decide a cada passo",
    lead: "São três passos. Em cada um você sabe antes o que recebe e quanto custa, e decide se segue.",
    receivesLabel: "Você recebe",
    steps: [
      {
        when: "30 minutos, por telefone",
        badge: "Grátis",
        title: "Conversa",
        body: "Você conta como a empresa funciona hoje. Nós perguntamos onde o serviço emperra, onde se repete e onde depende de uma pessoa só.",
        receives: "Uma resposta direta: se vale olhar mais de perto e por onde começar. Se não valer, dizemos.",
      },
      {
        when: "Uma semana, na sua empresa",
        title: "Diagnóstico",
        body: "Vamos até a empresa e acompanhamos quem faz o serviço, do começo ao fim. Juntos, escolhemos por onde começar: o que ajuda mais e é mais fácil de fazer.",
        receives:
          "Por escrito: o que fazer primeiro, o que depende de você e em quantas etapas dá para fazer, com o prazo e o preço de cada uma.",
      },
      {
        when: "Em etapas de até duas semanas",
        title: "Construção",
        body: "Construímos e colocamos para funcionar dentro da sua empresa, junto com a sua equipe. Se o diagnóstico mostrar um trabalho pequeno, uma etapa basta.",
        receives: "No fim de cada etapa: o que foi combinado por escrito, funcionando na sua empresa.",
      },
    ],
    larger: {
      when: "Quando o trabalho é maior",
      title: "Nem tudo cabe em duas semanas",
      body: "O diagnóstico mostra isso antes de você contratar a construção. O trabalho maior vem dividido em etapas, cada uma com entrega, prazo e preço por escrito, e você decide a cada uma se segue.",
    },
    followUp: {
      when: "Depois da entrega",
      title: "Acompanhamento mensal",
      body: "Acompanhamos o que ficou funcionando, ajustamos o que for preciso e, quando você quiser, partimos para o próximo serviço.",
    },
    price: {
      // ⏸ null until the product owner decides to show the price on the site.
      claim: {
        value: null,
        template: "O diagnóstico custa {value}. O preço de cada etapa vem fechado no diagnóstico, antes de você contratar.",
      },
      fallback:
        "O preço do diagnóstico você fica sabendo na conversa. O de cada etapa vem fechado no diagnóstico, antes de você contratar.",
    },
  },
  products: {
    title: "O que já construímos",
    lead: "Duas ferramentas nossas, já no ar. Quando o WaHub resolve o seu caso, começamos por ele, sem construir do zero.",
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
  // Quem somos speaks as the company ("nós", "a equipe"): no person is named or shown, in any market.
  about: {
    eyebrow: "Quem somos",
    title: "Quem cuida do seu projeto",
    // The line that would carry the city, if the product owner decides to show it.
    lead: "A mesma equipe conversa com você, entende como a sua empresa funciona e constrói a solução. Do começo ao fim.",
    // The team's history is told in the company's voice and repeats no date from the tiles.
    body: "A nossa base é a computação científica, onde o programa precisa dar a resposta certa. É com esse cuidado que a solução é construída: para funcionar no dia a dia da sua empresa e não virar dor de cabeça lá na frente.",
    highlights: [
      // In use, with no count of who uses it.
      { value: "Em uso", label: "o WaHub, atendendo pelo WhatsApp no dia a dia" },
      { value: "IA desde 2006", label: "redes neurais na equipe, bem antes do ChatGPT" },
      { value: "+20 anos", label: "de experiência da equipe em desenvolvimento de software" },
    ],
  },
  fit: {
    title: "É para a sua empresa?",
    forTitle: "Para quem é",
    forItems: [
      "Empresas pequenas e médias em que a equipe gasta horas, toda semana, com serviço repetitivo.",
      "Quem prefere começar pequeno e ver funcionando antes de investir mais.",
      "Quem pode nos receber na empresa e liberar algumas horas da equipe para mostrar como o serviço é feito hoje.",
    ],
    notForTitle: "Para quem não é",
    notForItems: [
      "Quem procura só um site, um aplicativo ou uma loja virtual.",
      "Quem quer o preço de um projeto grande antes de alguém olhar como o serviço é feito.",
      "Quem espera que a IA substitua a equipe inteira.",
    ],
  },
  closing: {
    title: "Vamos conversar?",
    body: "Você marca pelo WhatsApp e a conversa é por telefone: 30 minutos, sem custo. No fim você sabe se vale olhar mais de perto e por onde começar.",
    cta: "Marcar a conversa",
  },
};
