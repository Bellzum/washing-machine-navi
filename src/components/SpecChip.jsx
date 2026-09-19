// Small "label: value" pill used to show pamphlet-style spec numbers
// (noise, power, water, time, weight) on both the recommendation cards
// and the comparison table's expanded detail row.
export default function SpecChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink-600 shadow-sm">
      <span className="text-ink-400">{label}</span>
      <span className="font-semibold text-ink-700">{value}</span>
    </span>
  );
}
