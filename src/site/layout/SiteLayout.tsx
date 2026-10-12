import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "../styles/site.css";
import type { PageMeta } from "../meta";
import { useDocumentMeta } from "../meta";
import { trackPageview } from "../analytics";
import { useSitePage } from "./page-context";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { StickyWhatsAppBar } from "./StickyWhatsAppBar";

/** Scrolls to the #hash target (or the top) when the route changes, as a full page load would. */
const useScrollOnNavigate = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
};

export const SiteLayout = ({ meta, children }: { meta: PageMeta; children: ReactNode }) => {
  const { copy } = useSitePage();
  const { pathname } = useLocation();

  useDocumentMeta(meta);
  useScrollOnNavigate();

  // Runs after useDocumentMeta's effect, so the pageview carries the new title.
  useEffect(() => {
    trackPageview();
  }, [pathname]);

  // Reveal blocks have been set up: the no-JS fallback animation is no longer needed.
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("v2-ready");
  }, []);

  return (
    <div className="site-v2 v2-page flex flex-col" lang={meta.lang}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-surface-raised focus:px-4 focus:py-3 focus:text-sm"
      >
        {copy.common.skipToContent}
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <div aria-hidden="true" className="h-[var(--sticky-bar-h)] md:hidden" />
      <StickyWhatsAppBar />
    </div>
  );
};
