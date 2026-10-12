# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## What This Is

Marketing website for **amiticia.cc** — the public-facing landing page for the AmiticIA product suite. Single-page Vite + React app deployed as a Docker container on the Hostinger VPS behind Traefik.

## Tech Stack

- **Build**: Vite 5
- **Framework**: React 18 + TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn-ui (Radix primitives under `src/components/ui/`)
- **Router**: react-router-dom v6
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Package manager**: npm (`package-lock.json` is the source of truth, matching the Docker build)

## Scripts

```bash
npm install        # Install deps
npm run dev        # Vite dev server on :8080
npm run build      # Production build to dist/
npm run lint       # ESLint
npm run preview    # Preview built dist (vite default :4173)
npm start          # Preview built dist on :3000, host mode (what deploy runs)
```

## Project Layout

```
src/
  pages/            # Top-level routes
  components/       # Shared components
    ui/             # shadcn-ui primitives (don't edit by hand — use shadcn CLI)
  hooks/            # Custom hooks
  lib/              # Utilities (cn, etc.)
  assets/           # Static assets imported by code
public/             # Static files served as-is
Dockerfile          # Multi-stage: node builder → nginx runtime
nginx.conf          # SPA fallback + asset caching, listens on :3000
deploy/             # THE deployed compose (+ .env.example) — the VPS runs it from /opt/amiticia/amiticia-site/deploy/
.github/workflows/
  deploy.yml        # CI/CD: build → push to ghcr.io → SSH deploy
```

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

This repo has no tests at all, and for a one-page marketing SPA that is a
defensible trade — but it means **nothing** confirms the built bundle renders.
A blank white screen ships exactly as cleanly as a working page.

| Probe | Tool | Allowed target |
|---|---|---|
| The landing page renders visible content after a production build — no white screen, no console errors | `playwright` MCP | `npm run build && npm start` on `localhost:3000` — never `amiticia.cc` |
| Client-side routes resolve under the SPA fallback rather than 404ing | `playwright` MCP | the same local preview |

Run them at the merge/release boundary, not in the commit gate. Neither touches
a third party, so both may run unattended.

⚠️ Probe the local preview, never the live domain. `amiticia.cc` also fronts
co-hosted paths owned by other repos (see below); driving it exercises their
containers, not this build.

## Deployment

**Fully automated.** Push to `main` → GitHub Actions builds the image → pushes `ghcr.io/amiticia-autosys/amiticia-site:latest` → SSHes into the Hostinger VPS → `git pull` in `/opt/amiticia/amiticia-site` → `docker compose pull && up -d` from `deploy/`. End-to-end takes ~2 min.

### How it works

1. **Image build** (`Dockerfile`): multi-stage. Stage 1 `node:20-alpine` runs `npm ci && npm run build`. Stage 2 `nginx:alpine` copies `dist/` into `/usr/share/nginx/html` and serves it on port 3000 using `nginx.conf` (SPA fallback + immutable caching for `/assets/`).
2. **Registry**: `ghcr.io/amiticia-autosys/amiticia-site`, tagged `:latest` and `:sha-<short>` per commit. The VPS pulls with the same ghcr.io login as every other `amiticia-autosys` image. Builds from before the 2026-10-13 rename stay at `ghcr.io/eusoubrasileiro/amitic-ai-core` — rollback only.
3. **Compose** (`deploy/docker-compose.yaml`): the deployed file. The VPS runs it from `/opt/amiticia/amiticia-site/deploy/`, a checkout of this repo, with `deploy/.env` (gitignored, chmod 600) holding `AMITICIA_K_BASICAUTH`. Change routing, volumes or labels here and push — never edit the VPS copy.
4. **CI/CD** (`.github/workflows/deploy.yml`): triggers on push to `main` or manual dispatch. `build-and-push` (`docker/build-push-action`, GHA cache), then `deploy` (`appleboy/ssh-action`: `git pull --ff-only`, `docker compose pull && up -d`, `docker image prune -f`). The image name is written in both the workflow and the compose file — change them together.

### Required GitHub secrets

| Name | Value |
|---|---|
| `SSH_HOST` | Hostinger IP |
| `SSH_USER` | `root` |
| `SSH_KEY` | Private ed25519 key for the Actions deploy user |

`GITHUB_TOKEN` (auto-provided) handles ghcr.io push.

### Manual deploy (escape hatch)

If Actions is broken:
```bash
ssh hostinger
cd /opt/amiticia/amiticia-site && git pull --ff-only
cd deploy && docker compose pull && docker compose up -d
```

To roll back, pin the image in `deploy/docker-compose.yaml` to `:sha-<short>` and run the pull + up above. Commit the pin, or the next deploy undoes it.

### Gotchas

- **Public repo, free CI.** Public repos run Actions for free; private ones draw on the org's limited minutes, which is why the AmiticIA default is no GitHub CI (`standards/standards.md`). Make this repo private and the deploy pipeline starts costing.
- **Public repo, so no secrets in git.** The `/k` BasicAuth hash lives only in the VPS's `deploy/.env`. Regenerate with `htpasswd -nbB andre '<password>' | sed -e 's/\$/\$\$/g'`.
- **Renamed 2026-10-13** from `eusoubrasileiro/amitic-ai-core`. GitHub redirects the old URL; creating any repo at the old name would break that redirect.
- **`vite.config.ts` `preview.allowedHosts`** is only used for `npm run preview` (local dev). Production serves via nginx, which doesn't care about host headers. Leaving it correct anyway is cheap insurance.
- **Never commit** `mcp-logs.txt` or `wa-logs.txt` — local debug artifacts (already gitignored).

## Co-hospedagem em amiticia.cc (por path, via Traefik)

Este SPA responde à raiz de `amiticia.cc`. Outros projetos podem co-hospedar em **paths** do mesmo domínio usando **containers próprios** com label Traefik `PathPrefix(/<slug>)` de prioridade maior. **NÃO incluir esses projetos neste repo** — eles têm compose/CI/CD próprios.

Paths co-hospedados atualmente:

| Path | Projeto / container | Fonte |
|---|---|---|
| `/pibconfins` | Tesouraria PIB Confins (dashboard financeiro da igreja) | `side-projects/pibconfins-site/` |

Ao adicionar uma nova rota neste SPA (ex.: `/blog`), confirmar antes que o path não conflita com nenhum co-hospedado.

## Parent Context

This repo is part of the AmiticIA monorepo at `~/Projects/amiticia/repositories/`. See the root `CLAUDE.md` there for cross-project conventions (pnpm workspaces elsewhere, WhatsApp integration patterns, etc.). This site is an outlier: it uses npm and is not part of any pnpm workspace.
