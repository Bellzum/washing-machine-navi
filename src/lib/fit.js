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

export function tapCompatible(machine, space) {
  // A cold-only single tap works with every machine here — warm_wash is a
  // bonus feature, not a requirement. A mixer tap works with everything.
  // We only surface a note when the room has a single tap but the machine's
  // headline feature needs hot water to actually use.
  if (space?.tap === "single" && machine.warm_wash) return "partial";
  return "ok";
}
