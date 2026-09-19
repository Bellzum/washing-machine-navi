import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import FitCheckForm from "./components/FitCheckForm.jsx";
import CompareSection from "./components/CompareSection.jsx";
import OldMachineSection from "./components/OldMachineSection.jsx";
import GuideSection from "./components/GuideSection.jsx";
import Footer from "./components/Footer.jsx";
import { useAuth } from "./lib/useAuth";
import { useOldMachines } from "./lib/useOldMachines";
import { useSpace } from "./lib/useSpace";

export default function App() {
  const [space, setSpace] = useSpace();
  const { user, signInWithEmail, signOut } = useAuth();
  const oldMachines = useOldMachines(user);

  // Fills the fit-check space from a saved old machine, whether triggered
  // from the fit-check form's own picker (① — no scroll needed) or from a
  // card down in the old-machine list (③ — scrolls back up to show it).
  const applyOldMachineToFit = (dims, { scroll = false } = {}) => {
    setSpace((s) => ({
      ...s,
      panId: "custom",
      width: dims.width || s.width,
      depth: dims.depth || s.depth,
      height: dims.height || s.height,
      tap: dims.tap && dims.tap !== "unknown" ? dims.tap : s.tap,
      source: "old_machine",
      sourceName: dims.name || "",
    }));
    if (scroll) {
      document.getElementById("fit-check")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Saving your very first old machine also sets it as your fit-check
  // reference automatically — a sensible one-time "default" for you
  // personally (persisted in this browser via useSpace), without touching
  // what any other visitor sees.
  const handleSaveOldMachine = async (form, photoFile) => {
    const wasEmpty = oldMachines.list.length === 0;
    const saved = await oldMachines.save(form, photoFile);
    if (wasEmpty) {
      applyOldMachineToFit({
        name: saved.name,
        width: saved.width_mm,
        depth: saved.depth_mm,
        height: saved.height_mm,
        tap: saved.tap,
      });
    }
    return saved;
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <Hero />
        <FitCheckForm space={space} setSpace={setSpace} oldMachines={oldMachines.list} onUseOldMachine={applyOldMachineToFit} />
        <CompareSection space={space} />
        <OldMachineSection
          user={user}
          signInWithEmail={signInWithEmail}
          signOut={signOut}
          machines={oldMachines}
          onSave={handleSaveOldMachine}
          onUseForFit={(dims) => applyOldMachineToFit(dims, { scroll: true })}
        />
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
}
