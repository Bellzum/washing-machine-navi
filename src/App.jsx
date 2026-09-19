import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import FitCheckForm from "./components/FitCheckForm.jsx";
import CompareSection from "./components/CompareSection.jsx";
import OldMachineSection from "./components/OldMachineSection.jsx";
import GuideSection from "./components/GuideSection.jsx";
import Footer from "./components/Footer.jsx";
import { useAuth } from "./lib/useAuth";
import { useOldMachines } from "./lib/useOldMachines";

const DEFAULT_SPACE = {
  panId: "640",
  width: 640,
  depth: 640,
  height: "",
  tap: "unknown",
  source: null,
  sourceName: "",
};

export default function App() {
  const [space, setSpace] = useState(DEFAULT_SPACE);
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
          onUseForFit={(dims) => applyOldMachineToFit(dims, { scroll: true })}
        />
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
}
