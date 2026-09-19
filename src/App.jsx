import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import FitCheckForm from "./components/FitCheckForm.jsx";
import CompareSection from "./components/CompareSection.jsx";
import OldMachineSection from "./components/OldMachineSection.jsx";
import GuideSection from "./components/GuideSection.jsx";
import Footer from "./components/Footer.jsx";

const DEFAULT_SPACE = { panId: "640", width: 640, depth: 640, height: "", tap: "unknown" };

export default function App() {
  const [space, setSpace] = useState(DEFAULT_SPACE);

  const useOldMachineForFit = (dims) => {
    setSpace((s) => ({
      ...s,
      panId: "custom",
      width: dims.width || s.width,
      depth: dims.depth || s.depth,
      height: dims.height || s.height,
      tap: dims.tap && dims.tap !== "unknown" ? dims.tap : s.tap,
    }));
    document.getElementById("fit-check")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <Hero />
        <FitCheckForm space={space} setSpace={setSpace} />
        <CompareSection space={space} />
        <OldMachineSection onUseForFit={useOldMachineForFit} />
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
}
