import { describe, expect, it } from "vitest";
import { fillReferral, sanitizeRef } from "./referral";

describe("sanitizeRef", () => {
  it("lowercases, then capitalises the first letter", () => {
    expect(sanitizeRef("magno")).toBe("Magno");
    expect(sanitizeRef("ISMAEL")).toBe("Ismael");
  });

  it("keeps only a-z, 0-9 and hyphen", () => {
    expect(sanitizeRef("<script>alert(1)</script>")).toBe("Scriptalert1script");
    expect(sanitizeRef("joão silva")).toBe("Joosilva");
    expect(sanitizeRef("ana-maria")).toBe("Ana-maria");
  });

  it("returns an empty string for nothing usable", () => {
    expect(sanitizeRef("")).toBe("");
    expect(sanitizeRef("!!! ???")).toBe("");
    expect(sanitizeRef(null)).toBe("");
  });

  it("cuts at 24 characters", () => {
    expect(sanitizeRef("a".repeat(40))).toBe("A" + "a".repeat(23));
  });
});

describe("fillReferral", () => {
  it("fills the template", () => {
    expect(fillReferral("(indicação de {ref})", "magno")).toBe("(indicação de Magno)");
  });

  it("is null without a template or without a usable ref", () => {
    expect(fillReferral(null, "magno")).toBeNull();
    expect(fillReferral("(indicação de {ref})", "???")).toBeNull();
    expect(fillReferral("(indicação de {ref})", null)).toBeNull();
  });
});
