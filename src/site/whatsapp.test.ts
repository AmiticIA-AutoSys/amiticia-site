import { describe, expect, it } from "vitest";
import { whatsappHref, whatsappHrefFor } from "./whatsapp";
import { markets } from "./markets";
import { brCopy } from "./copy/br";

const BR_NUMBER = "5531986983745";

describe("whatsappHref", () => {
  it("builds a wa.me link with the number and the URL-encoded text", () => {
    expect(whatsappHref(BR_NUMBER, "Olá! Tudo bem?")).toBe(
      "https://wa.me/5531986983745?text=Ol%C3%A1!%20Tudo%20bem%3F",
    );
  });

  it("uses the live Brazilian business number for the br market", () => {
    expect(markets.br.whatsappNumber).toBe(BR_NUMBER);
  });

  it.each([
    ["home", "Olá! Vim pelo site da AmiticIA e gostaria de conversar sobre um projeto."],
    ["wahub", "Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais."],
    ["patricia", "Olá! Vi a Patrícia no site da AmiticIA e gostaria de saber mais."],
  ] as const)("carries the approved %s message", (page, text) => {
    expect(brCopy[page].whatsappMessage).toBe(text);
    expect(whatsappHrefFor("br", page)).toBe(
      `https://wa.me/${BR_NUMBER}?text=${encodeURIComponent(text)}`,
    );
  });
});
