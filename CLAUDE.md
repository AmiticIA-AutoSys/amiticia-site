# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## What This Is

Marketing website for **amiticia.cc**: a Vite + React SPA served by nginx in Docker, behind
Traefik on the Hostinger VPS. Two generations live side by side:

- **v2 market pages**: `/br`, `/br/wahub`, `/br/patricia` (later `/it`, `/en`). They are
  prerendered to static HTML at build time and hydrated in the browser. Design rules and tokens are
  in `DESIGN.md`, with tokens scoped to `.site-v2`. Copy lives in `src/site/copy/<market>/` and
  changes only with the product owner's approval.
- **Legacy pages**: `/` (the old one-page landing) and `/k` (knowledge area behind Traefik
  BasicAuth). They stay exactly as they are until v2 is validated; `e2e/legacy.spec.ts` guards `/`
  pixel by pixel.

Status: v2 lives on branch `v2-br` and is not on amiticia.cc; `main` is what is live. Phones see v2
through the preview stack (see Deployment).

## Tech Stack

- **Build**: Vite 5. `npm run build` = client build → SSR build → `scripts/prerender.mjs`
- **Framework**: React 18 + TypeScript (`strict: false` in `tsconfig.app.json`) + react-router-dom 6
- **Styling**: Tailwind CSS 3.4 + shadcn-ui (Radix, `src/components/ui/`: don't hand-edit) + `motion`
- **Font**: Plus Jakarta Sans Variable, self-hosted (`@fontsource-variable`), v2 pages only
- **Tests**: vitest + Testing Library (jsdom); Playwright + axe against the real Docker image
- **Package manager**: npm (`package-lock.json` is the source of truth, matching the Docker build)

## Scripts

```bash
npm ci             # install deps (also installs the husky hooks)
npm run dev        # Vite dev server on :8080 (SPA only, no prerender)
npm run build      # client + SSR build, then prerender /br pages into dist/<path>/index.html
npm run typecheck  # tsc --noEmit -p tsconfig.app.json
npm run lint       # ESLint
npm test           # vitest (unit + component)
npm run e2e        # build the Docker image, run it on 127.0.0.1:${E2E_PORT:-4310}, run Playwright
npm run og         # regenerate the share images public/og/br-*.jpg (rerun and commit after an h1/eyebrow change)
bash scripts/e2e-preview-nginx.sh   # check the preview stack's nginx: noindex, no /k, robots.txt
```

Parallel worktrees must use different `E2E_PORT` values. Update the legacy `/` screenshot baseline
only from a known-good image: `npx playwright test e2e/legacy.spec.ts --update-snapshots`.

`npm run build` reads two build-time variables (Docker build args of the same name): `SITE_URL`, the
origin of canonical and og URLs (default `https://amiticia.cc`), and `SITE_NOINDEX=1`, which marks
every prerendered page noindex. `scripts/preview-tunnel.sh` and `scripts/preview-deploy.sh <url>`
act on the VPS: coordinator only (see Preview stack).

## Project Layout

```
src/
  site/              v2 market pages: everything new lives here
    markets.ts products.ts routes.tsx meta.ts whatsapp.ts analytics.ts
    copy/<market>/   approved page copy, one file per page
    layout/          header, footer, sticky WhatsApp bar, buttons, primitives
    pages/<page>/    page component + sections/
    styles/site.css  .site-v2 tokens and base styles
    assets/          v2 images (WaHub screenshots: fictitious demo data)
  components/kit/    adapted third-party components (Cult UI, Skiper UI, OriginKit): keep attribution headers
  components/ui/     shadcn primitives
  pages/ components/ legacy pages and their components
  legacy/            LegacyLayout: providers only the legacy pages use (react-query, tooltips, toasters),
                     loaded on demand so /br never downloads them
  entry-server.tsx   SSR entry used by the prerender
public/og/           share images, 1200×630 JPEG ≤ 180 KB (WhatsApp drops bigger ones)
e2e/                 Playwright specs + the legacy screenshot baseline
scripts/             prerender, e2e-preview, og/ (share images), preview-* (VPS preview stack)
deploy/              production compose: the VPS checkout deploys from here
deploy/preview/      throwaway preview stack (quick tunnel, noindex): see Preview stack
.github/workflows/   deploy.yml: build → ghcr.io → SSH deploy (push to main only)
```

## Testing discipline

Red → Green → Refactor. Which test proves which kind of change:

| Change | Test |
|---|---|
| Registries, WhatsApp links, analytics, meta/head builders, copy rules (pending claims), share-image size | vitest unit |
| Component behaviour (clicks tracked, tabs, chat final frame, reduced motion) | vitest + Testing Library |
| Prerendered HTML, routing, nginx headers, hydration, mobile overflow, CTA visibility, axe, legacy look | Playwright against the Docker image (`npm run e2e`) |
| Visual quality | build → screenshot at 360/390/768/1280/1440 → critique loop (`standards/skills/frontend-design`) |

**Pre-commit stack** (husky): `pre-commit` runs `typecheck`, `lint`, `test`; `commit-msg` runs
commitlint (Conventional Commits); `pre-push` runs `npm run e2e`. Never `--no-verify`.

## Conformance and dispatch

> **Conformance:** `qgat` -- n/a (TODO-RATIFY): static marketing SPA with no business logic to ratchet; unit tests run in pre-commit and Playwright E2E against the real Docker image in pre-push.
>
> **Conformance:** `srev` -- n/a (TODO-RATIFY): no backend, no secrets and no customer data in the bundle; the public-repo leak risk (people and client names in the working docs) is handled by keeping `HANDOFF.md`, `brief.md` and `copy-br.md` in `.git/info/exclude`.
>
> **Conformance:** `disp` -- n/a (TODO-RATIFY): npm outlier without the pnpm dispatch script; the coordinator dispatches by hand (below).

**Manual dispatch** (same contract as `standards.md#worktree-dispatch`): write
`.claude/plans/<slug>.md`, then `git worktree add .claude/worktrees/<slug> -b agent/<slug> <base>`,
copy the plan to `<worktree>/.claude/PLAN.md`, run `npm ci` there, and give each parallel worker its
own `E2E_PORT`. There is no database to allocate.

## Behavioral probes

| Probe | Tool | Allowed target |
|---|---|---|
| Each `/br` page renders from prerendered HTML, hydrates with no console errors, and every WhatsApp button carries its page's message | Playwright (`npm run e2e`, unattended) | the local Docker image |
| The legacy `/` and `/k` still render as before | Playwright (`npm run e2e`, unattended) | the local Docker image |
| The pages look right on a real phone and the WhatsApp buttons open the pre-filled chat | a person on a phone (attended) | the preview tunnel URL |
| The WhatsApp link preview shows the page's image and title | attended: paste the link in a WhatsApp chat (third party) | the preview tunnel URL |

Run them at the merge/release boundary, not in the commit gate. ⚠️ Never probe `amiticia.cc`
before v2 ships: it also fronts co-hosted paths owned by other repos (see below).

## Deployment

- **Production.** Push to `main` → GitHub Actions builds `ghcr.io/eusoubrasileiro/amitic-ai-core`
  (`:latest` and `:sha-<short>`) → SSH deploy. The VPS deploys from
  `/opt/amiticia/amiticia-site/deploy/docker-compose.yaml`, a checkout of this repo
  (`standards/deployment.md`). The compose has `pull_policy: always`: **any push to `main` ships.**
- ⚠️ **Issue #1.** On `main`, the workflow still `cd`s into `/root/amiticia-site`, which no longer
  exists: CI builds the image but the deploy step fails. The live version got there by a manual
  deploy. Fixed on `v2-br` (`614fd1a`); the fix ships when `v2-br` merges to `main`.
- **Caching** (`nginx.conf`): HTML is never cached, because it names the hashed bundles. Other
  files from `public/` are cached for an hour, and `/assets/` is immutable for a year.
- **Manual deploy** (escape hatch):
  ```bash
  ssh hostinger
  cd /opt/amiticia/amiticia-site && git fetch origin && git reset --hard origin/main
  cd deploy && docker compose pull && docker compose up -d
  ```
- **Rollback**: pin `image:` to `:sha-<short>` in the VPS checkout's compose, then `docker compose up -d`.
- **`/k` BasicAuth** comes from `deploy/.env` on the VPS (`AMITICIA_K_BASICAUTH`, chmod 600), never
  from git: this repo is **public**. Regenerate with
  `htpasswd -nbB andre '<password>' | sed -e 's/\$/\$\$/g'`.
- `amiticia-site.yml` at the repo root is the pre-2026-08-31 reference copy, superseded by
  `deploy/docker-compose.yaml`. Do not use it.
- Required GitHub secrets: `SSH_HOST` (Hostinger IP), `SSH_USER` (`root`), `SSH_KEY` (deploy key).
  `GITHUB_TOKEN` handles the ghcr.io push.

### Preview stack (before anything changes on amiticia.cc)

The preview stack is a throwaway copy of the site for phones. It runs on the same VPS, isolated
from production:

- **Where:** compose project `amiticia-site-preview` in `/opt/amiticia/amiticia-site-preview`, a
  checkout of this repo on `v2-br`. Its files are in `deploy/preview/`.
- **Isolation:** no Traefik labels, no `network_public`, no published ports, no DNS.
- **URL:** a Cloudflare quick tunnel gives a random `https://*.trycloudflare.com` address. Anyone
  holding it can open the site; it is unguessable but not a secret.
- **Indexing:** every page is noindex (meta tag and `X-Robots-Tag`), `robots.txt` disallows all,
  and `/k` answers 404.
- **v2 only:** `/` redirects to `/br`, so the bare preview URL never shows the legacy landing.

To bring it up:

1. Commit on `v2-br`. No GitHub push is needed: both scripts call `scripts/preview-sync.sh`,
   which ships the local `v2-br` to the VPS checkout as a git bundle over ssh.
2. Run `scripts/preview-deploy.sh`. It builds the image locally with noindex, ships it with
   `docker save | ssh … docker load`, and starts `web`. Rerun it after each commit.
3. Run `scripts/preview-tunnel.sh`. It starts the tunnel if needed and prints its current URL.

The URL changes whenever the tunnel container restarts, including after a VPS reboot: rerun
`scripts/preview-tunnel.sh` to read the new one. Nothing needs a rebuild, because
`nginx.preview.conf` rewrites the baked `https://amiticia.cc` origin in HTML to the requested host,
so canonical and og URLs follow the current tunnel.

Tear down with
`ssh hostinger 'cd /opt/amiticia/amiticia-site-preview/deploy/preview && docker compose down'`.

### Gotchas

- **Repo name mismatch**: git origin is `eusoubrasileiro/amitic-ai-core.git`, not `amiticia-site`.
  The ghcr.io image name follows the repo name.
- **`vite.config.ts` `preview.allowedHosts`** only matters for `npm run preview`; production is nginx.
- **Never commit** `mcp-logs.txt`, `wa-logs.txt`, or the working docs listed in `.git/info/exclude`.

## Co-hospedagem em amiticia.cc (por path, via Traefik)

Este SPA responde à raiz de `amiticia.cc`. Outros projetos podem co-hospedar em **paths** do mesmo
domínio usando **containers próprios** com label Traefik `PathPrefix(/<slug>)` de prioridade maior.
**NÃO incluir esses projetos neste repo**: eles têm compose/CI/CD próprios.

| Path | Projeto / container | Fonte |
|---|---|---|
| `/pibconfins` | Tesouraria PIB Confins (dashboard financeiro da igreja) | `side-projects/pibconfins-site/` |

Rotas deste SPA: `/`, `/k`, `/br/*` (e no futuro `/it/*`, `/en/*`). Ao adicionar uma nova rota,
confirmar antes que o path não conflita com nenhum co-hospedado.

## Parent Context

This repo is part of the AmiticIA monorepo at `~/Projects/amiticia/repositories/`. See the root
`CLAUDE.md` there for cross-project conventions. This site is an outlier: it uses npm and is not
part of any pnpm workspace.
