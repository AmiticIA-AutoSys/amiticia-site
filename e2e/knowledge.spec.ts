import { expect, test } from "@playwright/test";
import { IT_HOST, getAs } from "./fixtures";

// The knowledge area keeps its legacy SPA route; Traefik BasicAuth guards it in production.
test("/k answers 200 with the app root", async ({ request }) => {
  const res = await request.get("/k");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('<div id="root"></div>');
});

// AC11: /k stays on amiticia.cc (Traefik adds BasicAuth there in production).
test("/k on amiticia.cc is still served by nginx", async ({ request }) => {
  const res = await getAs(request, IT_HOST, "/k");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('<div id="root"></div>');
});
