import machinesData from "../data/machines.json";
import { computeFit, checkLidClearance, deltaVsOldMachine, heightUnverifiedVsOldMachine } from "./fit";

const { machines } = machinesData;

export const CAPACITY_BANDS = {
  solo: { min: 0, max: 7, ideal: 6 },
  couple: { min: 7, max: 8.5, ideal: 7.5 },
  family: { min: 9, max: 99, ideal: 10 },
  any: null,
};

export const DEFAULT_PREFS = { capacity: "any", dry: "any", type: "any" };

// How many ranked results the caller can ask for. The UI shows TOP_SHOWN by
// default with a "show more" toggle that reveals up to TOP_MAX.
export const TOP_SHOWN = 5;
export const TOP_MAX = 10;

// Scores every machine against the user's stated space + preferences, hard
// -excludes anything that plainly won't fit once a space has been entered
// (that's the whole point — "reliable comparison" instead of a wall of
// specs), and returns up to TOP_MAX ranked machines. Each result also gets
// a short list of "explain" entries — structured {type, params} objects the
// UI turns into a couple of plain-language sentences on why it was picked,
// built from real spec numbers (not just a fit/capacity/type tag).
export function recommend(space, prefs) {
  const spaceKnown = computeFit(machines[0], space) !== "unknown";

  const candidates = machines
    .map((m) => {
      const fit = computeFit(m, space);
      const lidClearance = checkLidClearance(m, space);
      const heightUnverified = heightUnverifiedVsOldMachine(m, space);
      return { ...m, fit, lidClearance, heightUnverified };
    })
    // Hard-exclude anything that won't physically fit once we know the space,
    // and — separately — anything whose CONFIRMED lid-open height won't clear
    // an entered ceiling/shelf limit. A machine with an unconfirmed lid-open
    // height is kept (we just don't know), never silently dropped.
    .filter((m) => !(spaceKnown && m.fit === "no") && m.lidClearance !== "no");

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

  const top = scored.slice(0, TOP_MAX);

  // Relative standouts (quietest / cheapest) are judged against this
  // shortlist, not the whole 14-model catalog, so the claim stays honest
  // even when the space/preferences have already ruled a lot of it out.
  const spinValues = top.map((m) => m.noise_spin_db).filter((v) => typeof v === "number");
  const quietThreshold = spinValues.length
    ? spinValues.reduce((a, b) => a + b, 0) / spinValues.length - 2
    : null;
  const cheapest = top.reduce(
    (min, m) => (min === null || m.price_yen < min ? m.price_yen : min),
    null,
  );

  const band = CAPACITY_BANDS[prefs.capacity];

  const results = top.map((m) => {
    const explain = [];

    if (m.fit === "fits") explain.push({ type: "fitGood" });
    else if (m.fit === "tight") explain.push({ type: "fitTight" });

    // Capacity: say so either way. Staying silent when a machine falls
    // short of what was asked for is exactly what reads as "not listening
    // to my preference" — so a mismatch gets its own sentence too, not
    // just a missing tag.
    if (band) {
      if (m.wash_kg >= band.min && m.wash_kg <= band.max) {
        explain.push({ type: "capacityMatch", params: { kg: m.wash_kg, household: prefs.capacity } });
      } else if (m.wash_kg < band.min) {
        explain.push({ type: "capacityBelow", params: { kg: m.wash_kg, capacity: prefs.capacity } });
      } else {
        explain.push({ type: "capacityAbove", params: { kg: m.wash_kg, capacity: prefs.capacity } });
      }
    }

    if (prefs.dry === "heat_pump") {
      if (m.features.includes("heat_pump_dry")) explain.push({ type: "dryHeatPump" });
      else explain.push({ type: "dryMismatchHeatPump" });
    } else if (prefs.dry === "simple") {
      if (m.dry_kg) explain.push({ type: "drySimple" });
      else explain.push({ type: "dryMismatchSimple" });
    } else if (prefs.dry === "none" && !m.dry_kg) {
      explain.push({ type: "noDryBudget" });
    }

    if (prefs.type !== "any") {
      if (m.type === prefs.type) {
        explain.push({ type: "typeMatch", params: { type: m.type } });
      } else {
        explain.push({ type: "typeMismatch", params: { type: m.type } });
      }
    }

    if (typeof m.noise_spin_db === "number" && quietThreshold !== null && m.noise_spin_db <= quietThreshold) {
      explain.push({ type: "quiet", params: { db: m.noise_spin_db } });
    }

    if (m.price_yen === cheapest) {
      explain.push({ type: "valuePick", params: { price: m.price_yen } });
    } else if (m.features.includes("premium")) {
      explain.push({ type: "premiumPick" });
    }

    if (m.lidClearance === "fits") {
      explain.push({ type: "lidFits", params: { mm: m.lid_open_height_mm } });
    } else if (m.lidClearance === "unknown") {
      explain.push({ type: "lidUnknown" });
    }

    if (m.heightUnverified) {
      explain.push({ type: "heightUnverified", params: { mm: m.height_mm } });
    }

    return { ...m, explain, delta: deltaVsOldMachine(m, space) };
  });

  // If NONE of the shown results actually satisfy a stated preference, the
  // list is silently falling back to "closest available" rather than truly
  // matching what was asked for — that's the exact situation that reads as
  // broken/out-of-sync, so the UI surfaces it as an explicit heads-up
  // instead of pretending everything lines up. Each check is judged against
  // the OTHER active preferences too, not capacity/type/dry in isolation —
  // otherwise a machine that only matches on, say, capacity but is the
  // wrong type can silently satisfy the "capacity" check and hide the
  // banner, even though nothing shown actually meets what was asked for
  // taken together.
  const capacityOk = (m) => !band || (m.wash_kg >= band.min && m.wash_kg <= band.max);
  const typeOk = (m) => prefs.type === "any" || m.type === prefs.type;
  const dryOk = (m) => {
    if (prefs.dry === "heat_pump") return m.features.includes("heat_pump_dry");
    if (prefs.dry === "simple") return !!m.dry_kg;
    return true;
  };

  const unmet = {
    capacity: band ? !results.some((m) => capacityOk(m) && typeOk(m) && dryOk(m)) : false,
    type: prefs.type !== "any" ? !results.some((m) => typeOk(m) && capacityOk(m) && dryOk(m)) : false,
    dry:
      prefs.dry === "heat_pump" || prefs.dry === "simple"
        ? !results.some((m) => dryOk(m) && capacityOk(m) && typeOk(m))
        : false,
  };

  // Separate from "unmet preferences" above: these flag when we had to show
  // at least one result we couldn't fully verify against what was entered —
  // an unconfirmed lid-open height, or (for a candidate taller than a saved
  // old machine used as the space reference) a body height we deliberately
  // didn't hard-exclude on, since that figure isn't a measured clearance —
  // rather than pretending everything shown was fully checked.
  const lidCaution = results.some((m) => m.lidClearance === "unknown");
  const heightCaution = results.some((m) => m.heightUnverified);

  return { results, spaceKnown, totalCandidates: candidates.length, unmet, lidCaution, heightCaution };
}
