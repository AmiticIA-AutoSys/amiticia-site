import { routerFuture } from "../../router-future";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { brCopy } from "../../copy/br";
import { SitePageProvider } from "../../layout/page-context";
import { PatriciaPage } from "./PatriciaPage";
import { briefing } from "./briefing";
import { neverClauses } from "./sections/PatriciaNever";

const { mockReducedMotion } = vi.hoisted(() => ({ mockReducedMotion: vi.fn().mockReturnValue(true) }));

vi.mock("motion/react", async (orig) => {
  const actual = await orig<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => mockReducedMotion() };
});

const copy = brCopy.patricia;

const tree = () => (
  <MemoryRouter initialEntries={["/br/patricia"]} future={routerFuture}>
    <SitePageProvider market="br" page="patricia">
      <PatriciaPage copy={copy} />
    </SitePageProvider>
  </MemoryRouter>
);

afterEach(() => {
  cleanup();
  mockReducedMotion.mockReturnValue(true);
});

const briefingCard = () => document.querySelector<HTMLElement>("[data-briefing]");

describe("Patrícia hero briefing card", () => {
  it("in its final frame shows the four case fields, the ready reply and the Enviar / Editar pair", () => {
    render(tree());
    const card = briefingCard();
    expect(card).not.toBeNull();
    const scope = within(card!);
    for (const field of briefing.fields) {
      expect(scope.getByText(field.label)).toBeInTheDocument();
      expect(scope.getByText(field.value)).toBeInTheDocument();
    }
    expect(briefing.fields.map((f) => f.label)).toEqual(["Envolvidos", "Contexto", "Fato central", "Bens"]);
    expect(scope.getByText("Resposta pronta")).toBeInTheDocument();
    expect(scope.getByText(briefing.reply)).toBeInTheDocument();
    expect(scope.getByText("Enviar")).toBeInTheDocument();
    expect(scope.getByText("Editar")).toBeInTheDocument();
    expect(card).toHaveAttribute("data-phase", "done");
  });

  it("is a hidden illustration: aria-hidden, no real buttons, while the h1 and lead stay accessible", () => {
    render(tree());
    const card = briefingCard()!;
    expect(card).toHaveAttribute("aria-hidden", "true");
    expect(card.querySelectorAll("button, a, input")).toHaveLength(0);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(copy.hero.title);
    expect(screen.getByText(copy.hero.lead)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Enviar" })).toBeNull();
  });

  it("follows the product's rules: the assistant says it is an AI first and asks one question at a time", () => {
    const [first, ...rest] = briefing.chat;
    expect(first.sender).toBe("them");
    expect(first.text).toMatch(/inteligência artificial/i);
    for (const msg of briefing.chat.filter((m) => m.sender === "them")) {
      expect((msg.text.match(/\?/g) ?? []).length).toBeLessThanOrEqual(1);
    }
    expect(rest.length).toBeGreaterThanOrEqual(2);
  });

  it("server HTML (no JS) already carries every chat line and the complete case", () => {
    // jsdom has a window, so the shared Reveal's isomorphic layout effect warns under renderToString.
    vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToString(tree());
    vi.mocked(console.error).mockRestore();
    for (const msg of briefing.chat) expect(html).toContain(msg.text);
    for (const field of briefing.fields) expect(html).toContain(field.value);
    expect(html).toContain(briefing.reply);
  });
});

describe("Patrícia sections", () => {
  it("the risk callout renders every word of its copy", () => {
    render(tree());
    expect(screen.getByRole("heading", { name: copy.howItWorks.risk.title })).toBeInTheDocument();
    expect(screen.getByText(copy.howItWorks.risk.body)).toBeInTheDocument();
  });

  it("splits the 'nunca' sentence into four clauses that keep every word, in order", () => {
    const clauses = neverClauses(copy.never.body);
    expect(clauses).toHaveLength(4);
    expect(clauses.join(" ")).toBe(copy.never.body);
    render(tree());
    const items = screen.getAllByTestId("never-item");
    expect(items.map((li) => li.textContent)).toEqual(clauses);
  });

  it("renders every step, problem and the closing band", () => {
    render(tree());
    for (const step of copy.howItWorks.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.body)).toBeInTheDocument();
    }
    for (const item of copy.problem.items) expect(screen.getByText(item)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: copy.closing.title })).toBeInTheDocument();
    expect(screen.getByText(copy.closing.body)).toBeInTheDocument();
  });

  it("never implies usage or results", () => {
    render(tree());
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/atendidos|em uso|em produção|clientes satisfeitos|escritórios usam|\d+\s*(escritórios|casos)/i);
  });
});
