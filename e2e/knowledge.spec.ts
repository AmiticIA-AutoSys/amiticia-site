import { expect, test } from "@playwright/test";

// The knowledge area keeps its legacy SPA route; Traefik BasicAuth guards it in production.
test("/k answers 200 with the app root", async ({ request }) => {
  const res = await request.get("/k");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('<div id="root"></div>');
});
