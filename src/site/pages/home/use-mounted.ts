import { useEffect, useState } from "react";

/**
 * False on the server and during hydration, true after mount. Used to mount kit components
 * whose inline <style> text React's SSR escapes (quotes, "<"), which breaks hydration.
 */
export const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};
