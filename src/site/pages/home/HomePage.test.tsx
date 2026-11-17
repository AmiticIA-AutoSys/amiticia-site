import { readFileSync } from "node:fs";
import { routerFuture } from "../../router-future";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { brCopy } from "../../copy/br";
import { itCopy } from "../../copy/it";
import { SitePageProvider } from "../../layout/page-context";
import { SiteRoutes } from "../../routes";
import { HomePage } from "./HomePage";

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={["/"]} future={routerFuture}>
      <SitePageProvider market="br" page="home">
        <HomePage copy={brCopy.home} />
      </SitePageProvider>
    </MemoryRouter>,
  );

const renderSite = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <SiteRoutes />
    </MemoryRouter>,
  );

const h2s = () => screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

// 14/11: the company's main work is consulting. The Brazilian home leads with the method and moves
// the products down, in the order the product owner agreed.
describe("Brazilian home, consulting first", () => {
  it("shows the sections in the agreed order", () => {
    renderHome();
    expect(h2s()).toEqual([
      "Sua equipe faz algum destes serviços toda semana?",
      "Você decide a cada passo",
      "O que já construímos",
      "Quem vai até a sua empresa",
      "É para a sua empresa?",
      "Vamos conversar?",
    ]);
  });

  it("has no technology list, no Power BI and no product-first sections", () => {
    const { container } = renderHome();
    for (const gone of [
      "Power BI",
      "Stack",
      "CI/CD",
      "RAG",
      "Self-hosted",
      "AI Engineering",
      "Projetos sob medida",
      "O que você ganha",
      "Nossos produtos",
      "Blueprint",
      "E-commerce",
      "SaaS",
    ]) {
      expect(container.textContent).not.toContain(gone);
    }
    expect(document.getElementById("sob-medida")).toBeNull();
  });
});

describe("home hero lead", () => {
  const TITLE = "IA funcionando no seu negócio.";
  const HIGHLIGHT = "Vamos até a sua empresa";
  const LEAD = `${HIGHLIGHT}, encontramos o serviço repetitivo que mais toma tempo da sua equipe e colocamos a IA para trabalhar nele.`;
  const TAGLINE = "A primeira conversa é grátis: 30 minutos, por telefone. Depois, uma semana de diagnóstico diz o que fazer e quanto custa.";
  const DESCRIPTION = `${LEAD} A primeira conversa é grátis.`;

  const hero = () => screen.getByRole("heading", { level: 1 }).closest("section")!;

  it("keeps the card's phrase as its h1, full stop included", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(TITLE);
  });

  it("says in one sentence what the consulting does, its opening words highlighted", () => {
    renderHome();
    const lead = hero().querySelector("p.v2-lead")!;
    expect(lead.textContent).toBe(LEAD);
    expect(lead.querySelector("span")!.textContent).toBe(HIGHLIGHT);
  });

  it("names the free first conversation right under the lead", () => {
    renderHome();
    expect(hero().querySelector("p.v2-lead")!.nextElementSibling!.textContent).toBe(TAGLINE);
  });

  it("offers the WhatsApp button and a link down to how it works", () => {
    renderHome();
    expect(within(hero()).getByRole("link", { name: /Marcar a conversa/ })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    );
    expect(within(hero()).getByRole("link", { name: "Ver como funciona" })).toHaveAttribute("href", "#como-trabalhamos");
  });

  it("drops the old lead, the old title and the jargon", () => {
    renderHome();
    for (const gone of ["Colocamos a inteligência", "que Escala", "Temos um produto", "Data & AI Ops", "para sua dor", "self-hosted"]) {
      expect(hero().textContent).not.toContain(gone);
    }
  });

  it("repeats the phrase in the footer, under the brand", () => {
    renderSite();
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(TITLE).tagName).toBe("P");
    expect(footer.textContent).not.toContain("Data & AI Ops");
  });

  it("carries the phrase in the page title and the offer in the description", () => {
    expect(brCopy.home.meta.title).toBe("AmiticIA - IA funcionando no seu negócio");
    expect(brCopy.home.meta.description).toBe(DESCRIPTION);
  });

  it("gives the fallback head of index.html the same title and description", () => {
    const html = readFileSync("index.html", "utf8");
    expect(html).toContain("<title>AmiticIA - IA funcionando no seu negócio</title>");
    expect(html).toContain('<meta property="og:title" content="AmiticIA - IA funcionando no seu negócio" />');
    expect(html).toContain(`<meta name="description" content="${DESCRIPTION}" />`);
    expect(html).toContain(`<meta property="og:description" content="${DESCRIPTION}" />`);
  });
});

// 17/11: many owners do not know what can be automated. Concrete examples come before the method.
describe("examples of where the work starts", () => {
  const section = () => document.getElementById("onde-ajuda") as HTMLElement;

  it("comes between the hero and how it works, with six examples", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    const how = document.getElementById("como-trabalhamos")!;
    expect(hero.compareDocumentPosition(section()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(section().compareDocumentPosition(how) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(section()).getByRole("heading", { level: 2 })).toHaveTextContent("Sua equipe faz algum destes serviços toda semana?");
    expect(within(section()).getAllByRole("listitem")).toHaveLength(6);
  });

  it("tells the reader he does not need to know what AI does", () => {
    renderHome();
    expect(section()).toHaveTextContent("Você não precisa saber o que a IA faz.");
    expect(within(section()).getAllByRole("listitem")[0]).toHaveTextContent("Digitar no sistema o que chegou por WhatsApp, e-mail ou PDF.");
  });

  it("says the work starts with one and the others come one at a time", () => {
    renderHome();
    expect(section()).toHaveTextContent("Começamos por um deles. Os outros ficam para depois, um de cada vez, se você quiser.");
  });
});

// 17/11: no sentence promises a finished job in a fixed time. "Duas semanas" only appears as the
// size of a stage, and the first screen and the description carry no duration for the build.
describe("no promise a client could throw back", () => {
  it("keeps 'duas semanas' out of the first screen and the description", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    expect(hero.textContent).not.toContain("duas semanas");
    expect(brCopy.home.meta.description).not.toContain("duas semanas");
  });

  it("never says a routine is working in two weeks", () => {
    expect(JSON.stringify(brCopy.home)).not.toMatch(/funcionando em duas semanas|fim da segunda semana|Semana 2/);
  });
});

describe("how it works", () => {
  const section = () => document.getElementById("como-trabalhamos") as HTMLElement;
  const steps = () => within(section()).getAllByRole("listitem").filter((li) => li.parentElement?.tagName === "OL");

  it("has three numbered steps: the conversation, the diagnosis, the construction", () => {
    renderHome();
    expect(within(section()).getByRole("heading", { level: 2 })).toHaveTextContent("Você decide a cada passo");
    expect(steps()).toHaveLength(3);
    expect(steps().map((li) => within(li).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "Conversa",
      "Diagnóstico",
      "Construção",
    ]);
  });

  it("says how long each step takes, and that the conversation is free and by phone", () => {
    renderHome();
    const [talk, diagnosis, build] = steps();
    expect(talk).toHaveTextContent("30 minutos, por telefone");
    expect(talk).toHaveTextContent("Grátis");
    expect(diagnosis).toHaveTextContent("Uma semana, na sua empresa");
    expect(build).toHaveTextContent("Em etapas de até duas semanas");
    expect(diagnosis).not.toHaveTextContent("Grátis");
    expect(build).not.toHaveTextContent("Grátis");
  });

  it("says what the client receives at each step", () => {
    renderHome();
    for (const li of steps()) {
      expect(li).toHaveTextContent("Você recebe");
    }
    expect(steps()[1]).toHaveTextContent("em quantas etapas dá para fazer, com o prazo e o preço de cada uma");
    expect(steps()[2]).toHaveTextContent("o que foi combinado por escrito, funcionando, e a sua equipe treinada para usar");
  });

  // 17/11: the fear is a client saying "you promised two weeks". The page says what happens when
  // the job is bigger, in plain words, right after the steps.
  it("says what happens when the job does not fit one stage", () => {
    renderHome();
    const larger = within(section()).getByRole("heading", { level: 3, name: "Nem tudo cabe em duas semanas" }).closest("div")!;
    expect(section().querySelector("ol")!.compareDocumentPosition(larger) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(section()).toHaveTextContent("Quando o trabalho é maior");
    expect(larger).toHaveTextContent("O diagnóstico mostra isso antes de você contratar a construção.");
    expect(larger).toHaveTextContent("Terminada uma, você decide se segue para a próxima.");
    expect(larger).toHaveTextContent("O prazo vale quando o que depende de você (acessos, documentos, gente disponível) chega a tempo.");
  });

  it("uses 'passo' for the three steps and 'etapa' only for the slices of the construction", () => {
    renderHome();
    const [talk, diagnosis] = steps();
    expect(within(section()).getByRole("heading", { level: 2 }).textContent).toContain("passo");
    expect(talk).not.toHaveTextContent(/etapa/i);
    expect(diagnosis).not.toHaveTextContent(/passo/i);
  });

  it("says the monthly fee exists, after the steps and the bigger-job card", () => {
    renderHome();
    const followUp = within(section()).getByRole("heading", { level: 3, name: "Acompanhamento mensal" }).closest("div")!;
    expect(section().querySelector("ol")!.compareDocumentPosition(followUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(section()).toHaveTextContent("Depois da entrega");
    expect(followUp).toHaveTextContent("O que continua funcionando tem uma mensalidade, dita antes de construir.");
    const larger = within(section()).getByRole("heading", { level: 3, name: "Nem tudo cabe em duas semanas" });
    expect(larger.compareDocumentPosition(followUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  // Whether a price appears on the site is Andre's call, not decided: no number until he says so.
  it("says when each price is known, with no number", () => {
    renderHome();
    expect(brCopy.home.layout === "consulting" && brCopy.home.howItWorks.price.claim.value).toBeNull();
    expect(section()).toHaveTextContent(
      "O preço do diagnóstico você fica sabendo na conversa. O de cada etapa vem fechado no diagnóstico, antes de você contratar.",
    );
  });
});

describe("what we have already built", () => {
  const productsSection = () => screen.getByRole("region", { name: "O que já construímos" });

  const saiuCard = () =>
    within(productsSection()).getByRole("link", { name: "Conhecer o Saiu no DOU (abre em nova aba)" });

  it("comes after how it works, with a one-line lead", () => {
    renderHome();
    const how = document.getElementById("como-trabalhamos")!;
    expect(how.compareDocumentPosition(productsSection()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(productsSection()).toHaveTextContent(
      "Duas ferramentas nossas, já no ar. Quando o WaHub resolve o seu caso, começamos por ele, sem construir do zero.",
    );
  });

  it("has exactly two cards, WaHub first, each one a single link", () => {
    renderHome();
    const links = within(productsSection()).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/wahub", "https://saiunodou.com.br"]);
    expect(within(productsSection()).getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  it("keeps the WaHub card inside the site, in the same tab, with its own text", () => {
    renderHome();
    const wahub = within(productsSection()).getByRole("link", { name: "Conhecer o WaHub" });
    expect(wahub).toHaveAttribute("href", "/wahub");
    expect(wahub).not.toHaveAttribute("target");
    expect(wahub).toHaveAccessibleDescription(
      "Seu time inteiro atendendo no mesmo número do WhatsApp Um assistente de IA atende cada contato na hora, descobre o que a pessoa quer e entrega o lead organizado para o seu time vender.",
    );
  });

  it("makes the whole Saiu no DOU card open its own site in a new tab", () => {
    renderHome();
    const card = saiuCard();
    expect(card).toHaveAttribute("href", "https://saiunodou.com.br");
    expect(card).toHaveAttribute("target", "_blank");
    expect(card).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("gives Saiu no DOU the same anatomy as WaHub: name, title, description and call to action", () => {
    renderHome();
    const card = saiuCard();
    expect(within(card).getByText("Saiu no DOU")).toBeInTheDocument();
    expect(
      within(card).getByRole("heading", { level: 3, name: "Busca pública e gratuita no Diário Oficial da União" }),
    ).toBeInTheDocument();
    expect(card).toHaveAccessibleDescription(
      "Busca pública e gratuita no Diário Oficial da União Portarias, editais, nomeações, aposentadorias e concursos: cada resultado leva à publicação oficial no DOU.",
    );
    expect(card).toHaveTextContent("Conhecer o Saiu no DOU");
  });

  it("draws the Saiu no DOU search as a decorative illustration with fictional labels", () => {
    renderHome();
    const illustration = saiuCard().querySelector('[aria-hidden="true"]');
    expect(illustration).not.toBeNull();
    for (const label of ["concurso público", "Seção 3", "Seção 2", "Portaria de nomeação", "Órgão Exemplo"]) {
      expect(illustration).toHaveTextContent(label);
    }
    expect(illustration).toHaveTextContent("Edital de concurso público");
    // Hidden from assistive technology: only the call to action names the card.
    expect(within(saiuCard()).queryByText("Portaria de nomeação")).toBeInTheDocument();
    expect(saiuCard()).not.toHaveAccessibleName(expect.stringContaining("Portaria"));
  });

  it("offers no WhatsApp link inside the section", () => {
    renderHome();
    const hrefs = within(productsSection()).getAllByRole("link").map((l) => l.getAttribute("href") ?? "");
    expect(hrefs.filter((h) => h.includes("wa.me"))).toEqual([]);
  });
});

describe("Saiu no DOU in the site navigation", () => {
  const expectNewTabLink = (link: HTMLElement) => {
    expect(link).toHaveAttribute("href", "https://saiunodou.com.br");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  };

  it("is in the footer, and says it opens in a new tab", () => {
    renderSite();
    const footer = screen.getByRole("contentinfo");
    expectNewTabLink(within(footer).getByRole("link", { name: "Saiu no DOU (abre em nova aba)" }));
    expect(within(footer).getByRole("link", { name: "WaHub" })).toHaveAttribute("href", "/wahub");
  });

  it("follows WaHub in the mobile menu, and says it opens in a new tab", () => {
    renderSite();
    fireEvent.click(screen.getByRole("button", { name: brCopy.common.menu.open }));
    const links = within(screen.getByRole("dialog")).getAllByRole("link");
    const names = links.map((a) => a.textContent ?? "");
    expect(names.indexOf("Saiu no DOU (abre em nova aba)")).toBe(names.indexOf("WaHub") + 1);
    expectNewTabLink(links[names.indexOf("Saiu no DOU (abre em nova aba)")]);
  });

  it("follows WaHub in the header's product list, as an external entry", () => {
    expect(brCopy.common.nav.products.items).toEqual([
      { label: "WaHub", to: "/wahub" },
      { label: "Saiu no DOU", to: "https://saiunodou.com.br", external: true },
    ]);
  });
});

describe("the Brazilian menu", () => {
  it("points every anchor at a section the home really has, in page order", () => {
    renderHome();
    const anchors = brCopy.common.nav.links.map((l) => l.to);
    expect(anchors).toEqual(["/#como-trabalhamos", "/#quem-somos", "/#para-quem-e"]);
    for (const to of anchors) {
      expect(document.getElementById(to.slice(2))).not.toBeNull();
    }
  });
});

describe("the proof: who comes to your company", () => {
  const about = () => document.getElementById("quem-somos") as HTMLElement;
  const BODY =
    "A base dele é a computação científica, onde o programa precisa dar a resposta certa. É com esse cuidado que a solução é construída: para funcionar no dia a dia da sua empresa e não virar dor de cabeça lá na frente.";

  // 17/11: "um cliente pagante" told the reader how many clients there are. The tile says the
  // product is in use and counts nothing.
  it("says WaHub is in daily use, counting no clients and naming no client or amount", () => {
    renderHome();
    const tile = within(about()).getByText("o WaHub, atendendo pelo WhatsApp no dia a dia").closest("li")!;
    expect(tile).toHaveTextContent("Em uso");
    expect(JSON.stringify(brCopy.home)).not.toMatch(/pagante|um cliente|\bclientes\b/i);
    expect(about().textContent).not.toMatch(/R\$|\bPRV\b|por mês/i);
  });

  it("says who comes, speaks of his history in his name, and repeats no date from the tiles", () => {
    renderHome();
    expect(within(about()).getByRole("heading", { level: 2 })).toHaveTextContent("Quem vai até a sua empresa");
    expect(about()).toHaveTextContent("É o André quem conversa com você, vai até a sua empresa e constrói a solução. Do começo ao fim, a mesma pessoa.");
    const paragraphs = Array.from(about().querySelectorAll("p")).map((p) => p.textContent);
    expect(paragraphs).toContain(BODY);
    expect(about().textContent).not.toContain("desde 2020");
    expect(BODY).not.toMatch(/2006|[Nn]ossa base|trabalhamos/);
  });

  it("keeps the experience tiles, without the HPC jargon", () => {
    renderHome();
    expect(about()).toHaveTextContent("redes neurais, bem antes do ChatGPT");
    expect(about()).toHaveTextContent("desenvolvendo software");
    expect(about().textContent).not.toContain("HPC");
  });
});

describe("home Quem somos photo", () => {
  const about = () => document.getElementById("quem-somos") as HTMLElement;
  const photo = () => within(about()).getByRole("img", { name: "Foto de André" });

  it("shows André's photo, captioned with his name and nothing else", () => {
    renderHome();
    expect(photo().closest("figure")?.querySelector("figcaption")?.textContent).toBe("André");
  });

  it("describes him as neither founder nor owner", () => {
    renderHome();
    expect(about().textContent).not.toMatch(/fundador|fundou|founder|dono|propriet|s[oó]cio|CEO/i);
  });

  it("reserves its space, loads lazily and offers both sizes", () => {
    renderHome();
    expect(photo()).toHaveAttribute("width", "540");
    expect(photo()).toHaveAttribute("height", "675");
    expect(photo()).toHaveAttribute("loading", "lazy");
    expect(photo().getAttribute("srcset")).toMatch(/270w.*540w/);
    expect(photo().getAttribute("sizes")).toBeTruthy();
  });

  it("shares the highlight tiles' card: same radius, border and surface", () => {
    renderHome();
    const card = photo().closest("li") as HTMLElement;
    const tile = within(about()).getByText("desenvolvendo software").closest("li") as HTMLElement;
    for (const name of ["rounded-[20px]", "border", "border-border", "bg-surface"]) {
      expect(card).toHaveClass(name);
      expect(tile).toHaveClass(name);
    }
  });

  it.each(["andre-270.webp", "andre-540.webp"])("%s is a small WebP with no metadata", (name) => {
    const bytes = readFileSync(`src/site/assets/${name}`);
    expect(bytes.subarray(0, 4).toString("latin1")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("latin1")).toBe("WEBP");
    expect(bytes.includes("EXIF")).toBe(false);
    expect(bytes.includes("XMP ")).toBe(false);
    expect(bytes.length).toBeLessThanOrEqual(60 * 1024);
  });
});

describe("who it is for, and who it is not for", () => {
  const section = () => document.getElementById("para-quem-e") as HTMLElement;
  const list = (title: string) =>
    within(within(section()).getByRole("heading", { level: 3, name: title }).closest("div")!).getAllByRole("listitem");

  it("comes after the proof and lists three of each", () => {
    renderHome();
    const about = document.getElementById("quem-somos")!;
    expect(about.compareDocumentPosition(section()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(list("Para quem é")).toHaveLength(3);
    expect(list("Para quem não é")).toHaveLength(3);
  });

  it("names small businesses and the team's time, and turns away a plain site or app", () => {
    renderHome();
    expect(list("Para quem é")[0]).toHaveTextContent(
      "Empresas pequenas e médias em que a equipe gasta horas, toda semana, com serviço repetitivo.",
    );
    expect(list("Para quem é")[2]).toHaveTextContent("liberar algumas horas da equipe");
    expect(list("Para quem não é")[1]).toHaveTextContent(
      "Quem quer o preço de um projeto grande antes de alguém olhar como o serviço é feito.",
    );
    expect(list("Para quem não é")[0]).toHaveTextContent("Quem procura só um site, um aplicativo ou uma loja virtual.");
  });
});

describe("home closing", () => {
  it("asks for the free conversation on WhatsApp", () => {
    renderHome();
    const closing = screen.getByRole("heading", { level: 2, name: "Vamos conversar?" }).parentElement!;
    expect(closing).toHaveTextContent("Você marca pelo WhatsApp e a conversa é por telefone: 30 minutos, sem custo. No fim você sabe se vale olhar mais de perto e por onde começar.");
    expect(within(closing).getByRole("link", { name: /Marcar a conversa/ })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    );
  });
});

// Three decisions are Andre's and not taken (16/11): price on the site, which CNPJ, whether the city
// appears. Until he decides, the Brazilian home carries none of them, and none of what a client pays.
describe("what the Brazilian home must not say yet", () => {
  const copyText = JSON.stringify(brCopy.home) + JSON.stringify(brCopy.common);

  it("has no price: no R$ and no amount in the copy or the rendered page", () => {
    const { container } = renderSite();
    expect(copyText).not.toMatch(/R\$|reais|\bmil\b/i);
    expect(container.textContent).not.toMatch(/R\$|reais/i);
  });

  it("has no CNPJ", () => {
    const { container } = renderSite();
    expect(container.textContent).not.toMatch(/CNPJ|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/);
  });

  it("names no city or region", () => {
    const { container } = renderSite();
    expect(container.textContent).not.toMatch(/Lagoa Santa|Belo Horizonte|\bBH\b|Vetor Norte|Confins|Vespasiano|Minas/);
  });

  it("writes plain Portuguese: no em dash or en dash in the home copy", () => {
    expect(JSON.stringify(brCopy.home)).not.toMatch(/[—–]/);
  });
});

describe("home hero illustration", () => {
  it("is hidden from assistive technology, so its demo text is not announced", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    const illustration = hero.querySelector("[data-hero-illustration]");
    expect(illustration).not.toBeNull();
    expect(illustration).toHaveAttribute("aria-hidden", "true");
    const el = within(hero).getByText("Lead qualificado");
    expect(el.closest('[aria-hidden="true"]')).toBe(illustration);
    // The only heading in the hero is the h1: the cards' titles are not headings.
    expect(within(hero).getAllByRole("heading").map((h) => h.tagName)).toEqual(["H1"]);
  });

  it("shows only the WaHub flow, not the retired case-briefing flow", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    expect(within(hero).queryByText("Caso organizado")).toBeNull();
  });
});

describe("the retired product", () => {
  it("appears nowhere on the rendered home, header and footer included", () => {
    const { container } = renderSite();
    expect(container.textContent).not.toMatch(/patr[ií]cia/i);
    expect(container.innerHTML).not.toMatch(/patr[ií]cia/i);
  });
});

// The consulting home is Brazilian only: the Italian home keeps its product-first sections untouched.
describe("the Italian home", () => {
  it("keeps every section it had, in the same order", () => {
    renderSite("/it");
    expect(screen.getAllByRole("heading").map((h) => `${h.tagName} ${h.textContent}`)).toEqual([
      "H1 Intelligenza e Automazione che Scalano",
      "H2 Il nostro prodotto",
      "H3 Tutto il tuo team risponde sullo stesso numero WhatsApp",
      "H2 Cosa ottieni",
      "H2 Soluzioni su misura",
      "H3 Stack e infrastruttura che non ti lasciano a piedi",
      "H3 Come lavoriamo",
      "H4 Diagnosi rapida",
      "H4 Blueprint & MVP",
      "H4 Scala & BI",
      "H2 Vera ingegneria dietro l'IA",
      "H2 Per chi è",
      "H2 Iniziamo?",
    ]);
    expect(itCopy.home.layout).toBeUndefined();
  });

  it("keeps its hero button pointing at its product", () => {
    renderSite("/it");
    expect(screen.getByRole("link", { name: /Scopri il prodotto/ })).toHaveAttribute("href", "#produtos");
  });
});
