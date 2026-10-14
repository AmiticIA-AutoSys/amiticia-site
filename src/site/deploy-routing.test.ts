import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const compose = readFileSync("deploy/docker-compose.yaml", "utf8");
const rule = (router: string): string => {
  const m = compose.match(new RegExp(`traefik\\.http\\.routers\\.${router}\\.rule=(.*)"`));
  if (!m) throw new Error(`no rule for router ${router}`);
  return m[1];
};

describe("Traefik routing for the two domains", () => {
  it("sends amiticia.com.br and www to the site, over https and on the http redirect", () => {
    for (const router of ["amiticia", "amiticia-redirect"]) {
      expect(rule(router)).toContain("Host(`amiticia.com.br`)");
      expect(rule(router)).toContain("Host(`www.amiticia.com.br`)");
      expect(rule(router)).toContain("Host(`amiticia.cc`)");
    }
  });

  it("keeps the BasicAuth knowledge router on amiticia.cc only", () => {
    expect(rule("amiticia-k")).not.toContain("com.br");
    expect(rule("amiticia-k")).toContain("PathPrefix(`/k`)");
  });
});
