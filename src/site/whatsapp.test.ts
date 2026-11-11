import { describe, expect, it } from "vitest";
import { whatsappHref, whatsappHrefFor } from "./whatsapp";
import { markets } from "./markets";
import { brCopy } from "./copy/br";
import { WHATSAPP_URL } from "@/lib/constants";

const BR_NUMBER = "5531998121645";

describe("whatsappHref", () => {
  it("builds a wa.me link with the number and the URL-encoded text", () => {
    expect(whatsappHref(BR_NUMBER, "Olá! Tudo bem?")).toBe(
      "https://wa.me/5531998121645?text=Ol%C3%A1!%20Tudo%20bem%3F",
    );
  });

  it("uses the Brazilian contact number for the br market", () => {
    expect(markets.br.whatsappNumber).toBe(BR_NUMBER);
  });

  it("keeps the legacy WHATSAPP_URL on the same number as the br market", () => {
    expect(WHATSAPP_URL).toBe(`https://wa.me/${markets.br.whatsappNumber}`);
    expect(WHATSAPP_URL).toBe(`https://wa.me/${BR_NUMBER}`);
  });

  it.each([
    ["home", "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto."],
    ["wahub", "Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais."],
  ] as const)("carries the approved %s message", (page, text) => {
    expect(brCopy[page].whatsappMessage).toBe(text);
    expect(whatsappHrefFor("br", page)).toBe(
      `https://wa.me/${BR_NUMBER}?text=${encodeURIComponent(text)}`,
    );
  });
});

const IT_NUMBER = "393926044070";

describe("whatsappHrefFor in the it market", () => {
  it("uses Flavio's Italian number", () => {
    expect(markets.it.whatsappNumber).toBe(IT_NUMBER);
  });

  it.each([
    ["home", "Ciao Flavio, ho visto il sito AmiticIA e vorrei parlare di un progetto."],
    ["wahub", "Ciao Flavio, ho visto WaHub sul sito AmiticIA e vorrei saperne di più."],
  ] as const)("carries the %s message in Italian", (page, text) => {
    expect(whatsappHrefFor("it", page)).toBe(`https://wa.me/${IT_NUMBER}?text=${encodeURIComponent(text)}`);
  });
});
