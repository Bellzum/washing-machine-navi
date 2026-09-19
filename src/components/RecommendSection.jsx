import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { recommend, DEFAULT_PREFS } from "../lib/recommend";
import { yen } from "../lib/format";
import FitBadge from "./FitBadge.jsx";

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ val, label, hint }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`rounded-2xl border px-3.5 py-2 text-left text-sm font-medium transition ${
            value === val
              ? "border-sakura-400 bg-sakura-300 text-white shadow"
              : "border-sakura-100 bg-cream-50 text-ink-600 hover:bg-sakura-50"
          }`}
        >
          <span className="block">{label}</span>
          {hint && (
            <span className={`block text-xs font-normal ${value === val ? "text-white/85" : "text-ink-400"}`}>
              {hint}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

const RANK_STYLES = [
  "bg-sakura-400 text-white", // #1
  "bg-sakura-200 text-ink-700",
  "bg-cream-200 text-ink-700",
  "bg-cream-200 text-ink-700",
  "bg-cream-200 text-ink-700",
];

export default function RecommendSection({ space }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language?.startsWith("ja");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const setPref = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }));

  const { results } = useMemo(() => recommend(space, prefs), [space, prefs]);

  const capacityOptions = [
    { val: "solo", label: t("recommend.capacitySolo") },
    { val: "couple", label: t("recommend.capacityCouple") },
    { val: "family", label: t("recommend.capacityFamily") },
    { val: "any", label: t("recommend.capacityAny") },
  ];
  const dryOptions = [
    { val: "none", label: t("recommend.dryNone") },
    { val: "simple", label: t("recommend.drySimple") },
    { val: "heat_pump", label: t("recommend.dryHeatPump") },
    { val: "any", label: t("recommend.dryAny") },
  ];
  const typeOptions = [
    { val: "vertical", label: t("recommend.typeVertical"), hint: t("recommend.typeVerticalHint") },
    { val: "drum", label: t("recommend.typeDrum"), hint: t("recommend.typeDrumHint") },
    { val: "any", label: t("recommend.typeAny") },
  ];

  return (
    <section id="recommend" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-bold text-ink-800">{t("recommend.heading")}</h2>
        <p className="mt-1.5 text-sm text-ink-600">{t("recommend.description")}</p>

        <div className="mt-6 rounded-card border border-sakura-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t("recommend.capacityLabel")}</p>
              <ChipGroup options={capacityOptions} value={prefs.capacity} onChange={setPref("capacity")} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t("recommend.dryLabel")}</p>
              <ChipGroup options={dryOptions} value={prefs.dry} onChange={setPref("dry")} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t("recommend.typeLabel")}</p>
              <ChipGroup options={typeOptions} value={prefs.type} onChange={setPref("type")} />
              <p className="mt-1.5 text-xs text-ink-400">{t("recommend.typeHelp")}</p>
            </div>
          </div>

          <p className="mt-5 rounded-full bg-cream-100 px-3.5 py-2 text-xs text-ink-400">
            {t("recommend.spaceHint")}
          </p>
        </div>

        {results.length === 0 ? (
          <p className="mt-6 rounded-card border border-sakura-100 bg-white px-4 py-10 text-center text-sm text-ink-400 shadow-sm">
            {t("recommend.noResults")}
          </p>
        ) : (
          <ol className="mt-6 flex flex-col gap-3">
            {results.map((m, i) => (
              <li
                key={m.id}
                className={`flex flex-col gap-3 rounded-card border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5 ${
                  i === 0 ? "border-sakura-300 ring-2 ring-sakura-100" : "border-sakura-100"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${RANK_STYLES[i]}`}
                >
                  {i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="font-semibold text-ink-800">
                      {isJa ? m.brand_ja : m.brand_en} {m.model}
                    </p>
                    <FitBadge status={m.fit} />
                  </div>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {t(m.type === "vertical" ? "compare.typeVertical" : "compare.typeDrum")} ·{" "}
                    {m.wash_kg}kg{m.dry_kg ? ` / ${m.dry_kg}kg` : ""} · {m.width_mm}×{m.depth_mm}×
                    {m.height_mm}mm
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.reasons.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-600"
                      >
                        {t(`recommend.reasons.${r}`)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
                  <p className="text-lg font-bold text-ink-800">{yen(m.price_yen)}</p>
                  <div className="flex gap-1.5">
                    <a
                      href={m.yodobashi}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-sakura-100 px-2.5 py-1 text-xs font-medium text-sakura-600 hover:bg-sakura-200"
                    >
                      {t("compare.yodobashi")}
                    </a>
                    <a
                      href={m.biccamera}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-600 hover:bg-sage-200"
                    >
                      {t("compare.biccamera")}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        <a
          href="#compare"
          className="mt-5 inline-block text-sm font-medium text-sakura-600 underline underline-offset-2"
        >
          {t("recommend.viewAll")}
        </a>
      </div>
    </section>
  );
}
