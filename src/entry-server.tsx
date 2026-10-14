import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";
import { routerFuture } from "./site/router-future";

/** HTML of the app at `url`, for the build-time prerender (scripts/prerender.mjs). */
export const render = (url: string): string =>
  renderToString(
    <StaticRouter location={url} future={routerFuture}>
      <AppShell />
    </StaticRouter>,
  );

export { prerenderPaths, prerenderFile, siteRoutes, metaFor } from "./site/routes";
export { headHtml } from "./site/meta";
