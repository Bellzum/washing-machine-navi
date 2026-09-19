// Shows how a candidate's footprint differs from the user's saved old
// machine (the "+1W −23D +7H" style comparison), when the entered space
// came from that old machine. Height uses lid-open height instead of body
// height for a top-load machine whenever that's confirmed, since that's
// the figure that actually determines whether it clears the same spot.
export default function DeltaBadges({ t, delta }) {
  if (!delta) return null;
  const sign = (n) => (n > 0 ? "+" : n < 0 ? "−" : "±");
  const parts = [];
  if (delta.width != null) {
    parts.push(t("recommend.delta.width", { sign: sign(delta.width), mm: Math.abs(delta.width) }));
  }
  if (delta.depth != null) {
    parts.push(t("recommend.delta.depth", { sign: sign(delta.depth), mm: Math.abs(delta.depth) }));
  }
  if (delta.height != null) {
    parts.push(
      t("recommend.delta.height", { sign: sign(delta.height), mm: Math.abs(delta.height) }) +
        (delta.heightIsLidOpen ? t("recommend.delta.heightLidNote") : ""),
    );
  }
  if (parts.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {parts.map((p) => (
        <span key={p} className="rounded-full bg-sakura-50 px-2.5 py-1 text-xs font-medium text-sakura-600">
          {p}
        </span>
      ))}
    </div>
  );
}
