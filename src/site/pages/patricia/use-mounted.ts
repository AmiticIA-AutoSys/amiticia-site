import { useEffect, useState } from "react";

/**
 * True after the first client render; false on the server and during hydration. Lets a kit
 * component whose server HTML does not hydrate cleanly mount on the client only (see BriefingCard).
 */
export const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};
