import machinesData from "../data/machines.json";
import { computeFit } from "./fit";

const { machines } = machinesData;

export const CAPACITY_BANDS = {
  solo: { min: 0, max: 7, ideal: 6 },
  couple: { min: 7, max: 8.5, ideal: 7.5 },
  family: { min: 9, max: 99, ideal: 10 },
  any: null,
};

export const DEFAULT_PREFS = { capacity: "any", dry: "any", type: "any" };

// Scores every machine against the user's stated space + preferences, hard
// -excludes anything that plainly won't fit once a space has been entered
// (that's the whole point — "reliable comparison" instead of a wall of
// specs), and returns the top 5 with short reason tags to show our work.
export function recommend(space, prefs) {
  const spaceKnown = computeFit(machines[0], space) !== "unknown";

  const candidates = machines
    .map((m) => {
      const fit = computeFit(m, space);
      return { ...m, fit };
    })
    // Hard-exclude anything that won't physically fit once we know the space.
    .filter((m) => !(spaceKnown && m.fit === "no"));

  const scored = candidates.map((m) => {
    let score = 0;
    const reasons = [];

    if (m.fit === "fits") {
      score += 30;
      reasons.push("fits");
    } else if (m.fit === "tight") {
      score += 15;
      reasons.push("tight");
    }

    const band = CAPACITY_BANDS[prefs.capacity];
    if (band) {
      if (m.wash_kg >= band.min && m.wash_kg <= band.max) {
        score += 20;
        reasons.push("capacity");
      } else {
        score -= Math.abs(m.wash_kg - band.ideal) * 3;
      }
    }

    if (prefs.dry === "heat_pump") {
      if (m.features.includes("heat_pump_dry")) {
        score += 22;
        reasons.push("dryHeatPump");
      } else if (m.dry_kg) {
        score += 6;
      } else {
        score -= 12;
      }
    } else if (prefs.dry === "simple") {
      if (m.dry_kg) {
        score += 16;
        reasons.push("dry");
      } else {
        score -= 6;
      }
    } else if (prefs.dry === "none") {
      if (!m.dry_kg) {
        score += 10;
        reasons.push("noDryBudget");
      }
    }

    if (prefs.type !== "any") {
      if (m.type === prefs.type) {
        score += 15;
        reasons.push("type");
      } else {
        score -= 18;
      }
    }

    // Small price tiebreaker — cheaper nudges ahead when everything else
    // is close, never dominates a real preference mismatch above.
    score += (260000 - m.price_yen) / 25000;

    return { ...m, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);

  return { results: scored.slice(0, 5), spaceKnown, totalCandidates: candidates.length };
}
