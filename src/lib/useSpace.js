import { useEffect, useState } from "react";

const LOCAL_KEY = "wmnavi-space";

export const DEFAULT_SPACE = {
  panId: "640",
  width: 640,
  depth: 640,
  height: "",
  tap: "unknown",
  source: null,
  sourceName: "",
};

function readSaved() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    // Merge over DEFAULT_SPACE so an older saved shape never crashes
    // a newer version of the app that expects extra fields.
    return { ...DEFAULT_SPACE, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

// Persists the fit-check space to this browser, so once someone sets it
// up (by hand, or by saving their first old machine — see App.jsx) it's
// still there the next time they open the app. Purely per-browser; it
// never affects what any other visitor sees.
export function useSpace() {
  const [space, setSpace] = useState(() => readSaved() ?? DEFAULT_SPACE);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(space));
    } catch {
      // localStorage can throw (private mode, quota) — losing persistence
      // silently is fine, the app still works fully in-memory.
    }
  }, [space]);

  return [space, setSpace];
}
