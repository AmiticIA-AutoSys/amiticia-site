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
// the products down; the order is the spec in business/estrategia/2026-11-14 §4.
describe("Brazilian home, consulting first", () => {
  it("shows the sections in the agreed order", () => {
    renderHome();
    expect(h2s()).toEqual([
      "Uma rotina funcionando em duas semanas",
      "O que já instalamos",
      "Quem vai até a sua empresa",
      "É para a sua empresa?",
      "Vamos começar?",
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
  const LEAD = `${HIGHLIGHT}, achamos a rotina que mais pesa e a deixamos funcionando em duas semanas.`;
  const TAGLINE = "A primeira conversa é grátis: 30 minutos, por telefone.";
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

describe("how it works", () => {
  const section = () => document.getElementById("como-trabalhamos") as HTMLElement;
  const steps = () => within(section()).getAllByRole("listitem").filter((li) => li.parentElement?.tagName === "OL");

  it("has three numbered steps: the conversation, the diagnosis, the routine working", () => {
    renderHome();
    expect(within(section()).getByRole("heading", { level: 2 })).toHaveTextContent("Uma rotina funcionando em duas semanas");
    expect(steps()).toHaveLength(3);
    expect(steps().map((li) => within(li).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "Conversa",
      "Diagnóstico",
      "Rotina funcionando",
    ]);
  });

  it("says how long each step takes, and that the conversation is free and by phone", () => {
    renderHome();
    const [talk, diagnosis, routine] = steps();
    expect(talk).toHaveTextContent("30 minutos, por telefone");
    expect(talk).toHaveTextContent("Grátis");
    expect(diagnosis).toHaveTextContent("Semana 1");
    expect(routine).toHaveTextContent("Semana 2");
    expect(diagnosis).not.toHaveTextContent("Grátis");
    expect(routine).not.toHaveTextContent("Grátis");
  });

  it("says what the client receives at each step", () => {
    renderHome();
    for (const li of steps()) {
      expect(li).toHaveTextContent("Você recebe");
    }
    expect(steps()[2]).toHaveTextContent("A primeira rotina funcionando até o fim da segunda semana");
  });

  it("offers the monthly follow-up as optional, after the three steps", () => {
    renderHome();
    const followUp = within(section()).getByRole("heading", { level: 3, name: "Acompanhamento mensal" }).closest("div")!;
    expect(section().querySelector("ol")!.compareDocumentPosition(followUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(section()).toHaveTextContent("Depois, se você quiser");
  });

  // Whether a price appears on the site is Andre's call, not decided: no number until he says so.
  it("says the price is fixed and told in the conversation, with no number", () => {
    renderHome();
    expect(brCopy.home.layout === "consulting" && brCopy.home.howItWorks.price.claim.value).toBeNull();
    expect(section()).toHaveTextContent(
      "O preço das duas semanas é fechado. Você fica sabendo na conversa, antes de decidir qualquer coisa.",
    );
  });
});

describe("what we have already installed", () => {
  const productsSection = () => screen.getByRole("region", { name: "O que já instalamos" });

  const saiuCard = () =>
    within(productsSection()).getByRole("link", { name: "Conhecer o Saiu no DOU (abre em nova aba)" });

  it("comes after how it works, with a one-line lead", () => {
    renderHome();
    const how = document.getElementById("como-trabalhamos")!;
    expect(how.compareDocumentPosition(productsSection()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(productsSection()).toHaveTextContent(
      "Duas ferramentas nossas, já no ar. Quando uma delas resolve a rotina da sua empresa, começamos por ela.",
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
    "Nossa base é computação científica e de alto desempenho, e inteligência artificial não é novidade aqui: trabalhamos com redes neurais desde 2006. É isso que entregamos: soluções que funcionam, escalam e não viram dor de cabeça lá na frente.";

  it("says a paying client uses WaHub in production, naming no client and no amount", () => {
    renderHome();
    const tile = within(about()).getByText("um cliente pagante usa o WaHub").closest("li")!;
    expect(tile).toHaveTextContent("Em produção");
    expect(about().textContent).not.toMatch(/R\$|\bPRV\b|por mês/i);
  });

  it("says who comes, keeps the approved bio and its one date", () => {
    renderHome();
    expect(within(about()).getByRole("heading", { level: 2 })).toHaveTextContent("Quem vai até a sua empresa");
    expect(about()).toHaveTextContent("É o André quem faz a conversa, vai até a sua empresa e constrói a solução.");
    const paragraphs = Array.from(about().querySelectorAll("p")).map((p) => p.textContent);
    expect(paragraphs).toContain(BODY);
    expect(about().textContent).not.toContain("desde 2020");
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
      "Empresas pequenas e médias com uma rotina que toma horas da equipe toda semana.",
    );
    expect(list("Para quem não é")[0]).toHaveTextContent("Quem procura só um site, um aplicativo ou uma loja virtual.");
  });
});

describe("home closing", () => {
  it("asks for the free conversation on WhatsApp", () => {
    renderHome();
    const closing = screen.getByRole("heading", { level: 2, name: "Vamos começar?" }).parentElement!;
    expect(closing).toHaveTextContent("Marque a conversa de 30 minutos pelo WhatsApp. É grátis, e no fim você sabe se vale seguir.");
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
