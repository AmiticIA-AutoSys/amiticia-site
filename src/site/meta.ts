import { useEffect } from "react";

export const SITE_ORIGIN = "https://amiticia.cc";
export const DEFAULT_OG_IMAGE = "/og-image.png";

export interface PageMeta {
  title: string;
  description: string;
  /** Path on the site, e.g. /br/wahub. */
  path: string;
  /** Path or absolute URL of the share image. */
  ogImage: string;
  lang: string;
  ogLocale: string;
}

export const absoluteUrl = (pathOrUrl: string): string =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_ORIGIN}${pathOrUrl}`;

const escapeAttr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeText = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Name/property → content pairs written to <head>, shared by the prerender and the client. */
const metaTags = (meta: PageMeta): Array<[attr: "name" | "property", key: string, content: string]> => {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(meta.ogImage);
  return [
    ["name", "description", meta.description],
    ["property", "og:title", meta.title],
    ["property", "og:description", meta.description],
    ["property", "og:type", "website"],
    ["property", "og:url", url],
    ["property", "og:locale", meta.ogLocale],
    ["property", "og:site_name", "AmiticIA"],
    ["property", "og:image", image],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", meta.title],
    ["name", "twitter:description", meta.description],
    ["name", "twitter:image", image],
  ];
};

/** The <head> block the prerender writes between <!--app-head-start--> and <!--app-head-end-->. */
export const headHtml = (meta: PageMeta): string =>
  [
    `<title>${escapeText(meta.title)}</title>`,
    `<link rel="canonical" href="${escapeAttr(absoluteUrl(meta.path))}" />`,
    ...metaTags(meta).map(([attr, key, content]) => `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`),
  ].join("\n    ");

/** Keeps <head> in sync on client-side navigation between v2 pages. */
export const useDocumentMeta = (meta: PageMeta): void => {
  useEffect(() => {
    document.title = meta.title;
    document.documentElement.lang = meta.lang;
    const head = document.head;
    for (const [attr, key, content] of metaTags(meta)) {
      let el = head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        head.appendChild(el);
      }
      el.setAttribute("content", content);
    }
    let canonical = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      head.appendChild(canonical);
    }
    canonical.href = absoluteUrl(meta.path);
  }, [meta]);
};
