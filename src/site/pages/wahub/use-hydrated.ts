import { useEffect, useState } from "react";

/**
 * False on the server and on the hydrating render, true right after. The kit's LiveChat and
 * GlowBorder render a <style> whose quotes React 18 escapes in server HTML (`&quot;`), which
 * breaks hydration; this page renders a static twin first and mounts the kit after hydration.
 */
export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
};
