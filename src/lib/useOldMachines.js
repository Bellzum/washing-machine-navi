import { useEffect, useState } from "react";
import { listOldMachines, saveOldMachine, deleteOldMachine } from "./oldMachines";

// Single source of truth for the "logged old machines" list, shared by
// the fit-check form (which offers them as a size reference) and the
// old-machine section (which manages them). Lifted to App so both stay
// in sync without re-fetching from Supabase/localStorage independently.
export function useOldMachines(user) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listOldMachines(user)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [user]);

  const save = async (form, photoFile) => {
    const saved = await saveOldMachine(user, form, photoFile);
    setList((prev) => [saved, ...prev]);
    return saved;
  };

  const remove = async (id) => {
    await deleteOldMachine(user, id);
    setList((prev) => prev.filter((m) => m.id !== id));
  };

  return { list, loading, save, remove };
}
