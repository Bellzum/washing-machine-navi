// Compares a machine's footprint against the user's install space.
// Returns one of: "unknown" | "fits" | "tight" | "no"
const COMFORT_MARGIN_MM = 20;

export function computeFit(machine, space) {
  const w = Number(space?.width);
  const d = Number(space?.depth);
  const h = space?.height === "" || space?.height == null ? null : Number(space.height);

  if (!w || !d) return "unknown";

  const widthDiff = w - machine.width_mm;
  const depthDiff = d - machine.depth_mm;

  if (widthDiff < 0 || depthDiff < 0) return "no";
  if (h != null && !Number.isNaN(h) && h > 0 && h < machine.height_mm) return "no";

  if (widthDiff < COMFORT_MARGIN_MM || depthDiff < COMFORT_MARGIN_MM) return "tight";
  return "fits";
}

// A top-load machine needs real headroom above its body height for the lid
// to swing fully open — always noticeably more than the closed body height
// (a shelf or vent fan can block the body just fine and still stop the lid
// from opening). Returns:
//   "n/a"     — not a top-load machine, or no ceiling/shelf limit was entered
//   "unknown" — it's top-load and a limit was entered, but we don't have a
//               confirmed lid-open figure for this exact model to check it
//   "fits"    — confirmed lid-open height clears the entered limit
//   "no"      — confirmed lid-open height exceeds the entered limit
//
// Deliberately skipped when space.source === "old_machine": picking "use my
// old machine as reference" auto-fills the height field with that machine's
// own CLOSED body height, not a real ceiling/shelf limit someone measured —
// treating it as a hard lid-clearance cutoff would wrongly reject machines
// whose lid just needs more headroom than the old machine's body happened
// to be tall. Editing the height field afterward clears that source flag
// (see FitCheckForm), which re-enables this check against the real number.
export function checkLidClearance(machine, space) {
  const h = space?.height === "" || space?.height == null ? null : Number(space.height);
  if (
    machine.type !== "vertical" ||
    h == null ||
    Number.isNaN(h) ||
    h <= 0 ||
    space?.source === "old_machine"
  ) {
    return "n/a";
  }
  if (machine.lid_open_height_mm == null) return "unknown";
  return h >= machine.lid_open_height_mm ? "fits" : "no";
}

// When the entered space came from a saved old machine, this reports how a
// candidate's footprint differs from it — the classic "+1W -23D +7H" style
// comparison, using lid-open height (not body height) for the height delta
// on a top-load machine whenever that's confirmed, since that's the figure
// that actually matters for clearance.
export function deltaVsOldMachine(machine, space) {
  if (space?.source !== "old_machine") return null;
  const oldW = Number(space.width);
  const oldD = Number(space.depth);
  const oldH = space.height === "" || space.height == null ? null : Number(space.height);
  const newH = machine.lid_open_height_mm ?? machine.height_mm;
  return {
    width: oldW ? machine.width_mm - oldW : null,
    depth: oldD ? machine.depth_mm - oldD : null,
    height: oldH ? newH - oldH : null,
    heightIsLidOpen: machine.type === "vertical" && machine.lid_open_height_mm != null,
  };
}

export function tapCompatible(machine, space) {
  // A cold-only single tap works with every machine here — warm_wash is a
  // bonus feature, not a requirement. A mixer tap works with everything.
  // We only surface a note when the room has a single tap but the machine's
  // headline feature needs hot water to actually use.
  if (space?.tap === "single" && machine.warm_wash) return "partial";
  return "ok";
}
