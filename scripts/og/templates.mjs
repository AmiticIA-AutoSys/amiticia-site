// HTML templates of the three link-preview images (1200×630). Pure functions: they take the
// page's h1 and eyebrow from the approved copy and the binary assets as data: URLs.
// Tokens mirror DESIGN.md (dark-only v2).

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const BASE_CSS = (fontUrl) => `
@font-face { font-family: "PJS"; src: url(${fontUrl}) format("woff2"); font-weight: 200 800; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #070A12; }
body {
  position: relative; font-family: "PJS", sans-serif; color: #F5F7FB;
  -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision;
}
.glow { position: absolute; border-radius: 50%; filter: blur(8px); }
.logo { position: absolute; left: 72px; top: 60px; height: 52px; width: auto; display: block; }
.eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 22px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; color: #A7B0C2;
}
.dot { width: 12px; height: 12px; border-radius: 50%; flex: none; }
h1 { font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; text-wrap: balance; }
.hairline { position: absolute; inset: 0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); pointer-events: none; }
`;

const page = (fontUrl, css, body) =>
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${BASE_CSS(fontUrl)}${css}</style></head><body>${body}<div class="hairline"></div></body></html>`;

const logo = (logoUrl) => `<img class="logo" src="${logoUrl}" alt="AmiticIA">`;

const GRADIENT = "linear-gradient(120deg, #33CCFF, #A78BFA)";

/** Home: company-level, brand gradient glow, the two product names as tinted chips. */
export const homeTemplate = ({ fontUrl, logoUrl, h1, eyebrow, chips }) =>
  page(
    fontUrl,
    `
.g1 { left: -160px; top: -240px; width: 760px; height: 760px; background: radial-gradient(closest-side, rgba(51,204,255,.30), transparent); }
.g2 { right: -240px; bottom: -340px; width: 900px; height: 900px; background: radial-gradient(closest-side, rgba(167,139,250,.32), transparent); }
.main { position: absolute; left: 72px; top: 190px; width: 1056px; }
.eyebrow { color: transparent; background: ${GRADIENT}; -webkit-background-clip: text; background-clip: text; font-size: 24px; text-transform: none; letter-spacing: 0; font-weight: 700; margin-bottom: 28px; }
h1 { font-size: 92px; letter-spacing: -0.035em; line-height: 1.04; }
.chips { position: absolute; left: 72px; bottom: 60px; display: flex; gap: 16px; }
.chip { display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 26px 0 22px; border-radius: 9999px; font-size: 24px; font-weight: 700; background: #121826; box-shadow: inset 0 0 0 1px rgba(255,255,255,.10); }
`,
    `<div class="glow g1"></div><div class="glow g2"></div>${logo(logoUrl)}
<div class="main"><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(h1)}</h1></div>
<div class="chips">${chips.map((c) => `<span class="chip"><i class="dot" style="background:${c.tint}"></i>${esc(c.name)}</span>`).join("")}</div>`,
  );

/** WaHub: indigo→violet glow, real inbox screenshot crop in a rounded frame bleeding off the corner. */
export const wahubTemplate = ({ fontUrl, logoUrl, h1, eyebrow, shotUrl }) =>
  page(
    fontUrl,
    `
.g1 { right: -120px; top: -160px; width: 900px; height: 900px; background: radial-gradient(closest-side, rgba(110,108,245,.50), transparent); }
.g2 { right: -260px; bottom: -380px; width: 800px; height: 800px; background: radial-gradient(closest-side, rgba(147,81,224,.38), transparent); }
.main { position: absolute; left: 72px; top: 168px; width: 500px; }
.eyebrow { font-size: 20px; margin-bottom: 26px; }
.eyebrow .dot { background: linear-gradient(120deg, #6E6CF5, #A25BE0); }
h1 { font-size: 54px; line-height: 1.08; }
.frame {
  position: absolute; left: 640px; top: 120px; width: 700px; height: 560px;
  border-radius: 28px; overflow: hidden; background: #0C111D;
  box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 40px 90px rgba(0,0,0,.55), 0 0 120px rgba(110,108,245,.35);
}
.frame img { position: absolute; left: -372px; top: -96px; width: 1100px; height: auto; display: block; }
`,
    `<div class="glow g1"></div><div class="glow g2"></div>${logo(logoUrl)}
<div class="main"><div class="eyebrow"><i class="dot"></i>${esc(eyebrow)}</div><h1>${esc(h1)}</h1></div>
<div class="frame"><img src="${shotUrl}" alt=""></div>`,
  );

/** Patrícia: warm peach glow, coded "Caso organizado" briefing card. */
export const patriciaTemplate = ({ fontUrl, logoUrl, h1, eyebrow }) =>
  page(
    fontUrl,
    `
.g1 { right: -100px; top: -200px; width: 860px; height: 860px; background: radial-gradient(closest-side, rgba(242,164,119,.46), transparent); }
.g2 { left: -300px; bottom: -420px; width: 800px; height: 800px; background: radial-gradient(closest-side, rgba(167,139,250,.16), transparent); }
.main { position: absolute; left: 72px; top: 168px; width: 500px; }
.eyebrow { font-size: 20px; margin-bottom: 26px; }
.eyebrow .dot { background: #F2A477; }
h1 { font-size: 54px; line-height: 1.08; }
.card {
  position: absolute; left: 636px; top: 112px; width: 492px; padding: 30px 34px 32px;
  border-radius: 28px; background: #121826;
  box-shadow: 0 0 0 1px rgba(255,255,255,.10), 0 40px 90px rgba(0,0,0,.5), 0 0 110px rgba(242,164,119,.22), inset 0 1px 0 rgba(255,255,255,.06);
}
.card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; }
.card-title { white-space: nowrap; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
.badge { white-space: nowrap; height: 34px; padding: 0 16px; display: inline-flex; align-items: center; border-radius: 9999px; font-size: 17px; font-weight: 700; color: #F2A477; background: rgba(242,164,119,.14); box-shadow: inset 0 0 0 1px rgba(242,164,119,.35); }
.row { padding: 13px 0; border-top: 1px solid rgba(255,255,255,.08); }
.label { font-size: 15px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; color: #828B9C; margin-bottom: 6px; }
.value { font-size: 23px; font-weight: 600; line-height: 1.3; color: #F5F7FB; }
.actions { display: flex; gap: 14px; margin-top: 18px; }
.btn { flex: 1; height: 56px; display: inline-flex; align-items: center; justify-content: center; border-radius: 14px; font-size: 21px; font-weight: 750; }
.btn.primary { background: #F2A477; color: #1A0E05; }
.btn.ghost { color: #F5F7FB; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
`,
    `<div class="glow g1"></div><div class="glow g2"></div>${logo(logoUrl)}
<div class="main"><div class="eyebrow"><i class="dot"></i>${esc(eyebrow)}</div><h1>${esc(h1)}</h1></div>
<div class="card">
  <div class="card-head"><span class="card-title">Caso organizado</span><span class="badge">Para o advogado</span></div>
  <div class="row"><div class="label">Envolvidos</div><div class="value">Mãe, pai e dois filhos</div></div>
  <div class="row"><div class="label">Fato central</div><div class="value">Pedido de guarda e pensão</div></div>
  <div class="row"><div class="label">Resposta pronta</div><div class="value">Aguardando a sua aprovação</div></div>
  <div class="actions"><span class="btn primary">Enviar</span><span class="btn ghost">Editar</span></div>
</div>`,
  );
