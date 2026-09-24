import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { recommend, DEFAULT_PREFS, TOP_SHOWN } from "../lib/recommend";
import { yen } from "../lib/format";
import FitBadge from "./FitBadge.jsx";
import SpecChip from "./SpecChip.jsx";
import DeltaBadges from "./DeltaBadges.jsx";

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
  "bg-cream-100 text-ink-500",
  "bg-cream-100 text-ink-500",
  "bg-cream-100 text-ink-500",
  "bg-cream-100 text-ink-500",
  "bg-cream-100 text-ink-500",
];

function explainSentence(t, e) {
  switch (e.type) {
    case "fitGood":
      return t("recommend.explain.fitGood");
    case "fitTight":
      return t("recommend.explain.fitTight");
    case "capacityMatch":
      return t("recommend.explain.capacityMatch", {
        kg: e.params.kg,
        household: t(`recommend.household.${e.params.household}`),
      });
    case "dryHeatPump":
      return t("recommend.explain.dryHeatPump");
    case "drySimple":
      return t("recommend.explain.drySimple");
    case "noDryBudget":
      return t("recommend.explain.noDryBudget");
    case "typeMatch":
      return t(
        e.params.type === "vertical"
          ? "recommend.explain.typeMatchVertical"
          : "recommend.explain.typeMatchDrum",
      );
    case "quiet":
      return t("recommend.explain.quiet", { db: e.params.db });
    case "valuePick":
      return t("recommend.explain.valuePick", { price: yen(e.params.price) });
    case "premiumPick":
      return t("recommend.explain.premiumPick");
    case "capacityBelow":
      return t("recommend.explain.capacityBelow", {
        kg: e.params.kg,
        household: t(`recommend.household.${e.params.capacity}`),
      });
    case "capacityAbove":
      return t("recommend.explain.capacityAbove", { kg: e.params.kg });
    case "dryMismatchHeatPump":
      return t("recommend.explain.dryMismatchHeatPump");
    case "dryMismatchSimple":
      return t("recommend.explain.dryMismatchSimple");
    case "typeMismatch":
      return t(
        e.params.type === "vertical"
          ? "recommend.explain.typeMismatchVertical"
          : "recommend.explain.typeMismatchDrum",
      );
    case "lidFits":
      return t("recommend.explain.lidFits", { mm: e.params.mm });
    case "lidUnknown":
      return t("recommend.explain.lidUnknown");
    default:
      return null;
  }
}


function unmetMessage(t, prefs, unmet) {
  const messages = [];
  if (unmet.capacity) {
    const key = { solo: "capacitySolo", couple: "capacityCouple", family: "capacityFamily" }[prefs.capacity];
    messages.push(t("recommend.unmet.capacity", { label: t(`recommend.${key}`) }));
  }
  if (unmet.type) {
    const key = prefs.type === "vertical" ? "typeShortVertical" : "typeShortDrum";
    messages.push(t("recommend.unmet.type", { label: t(`recommend.${key}`) }));
  }
  if (unmet.dry) {
    messages.push(t("recommend.unmet.dry"));
  }
  return messages;
}

export default function RecommendSection({ space }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language?.startsWith("ja");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [showAll, setShowAll] = useState(false);

  const setPref = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }));

  const { results, unmet, lidCaution } = useMemo(() => recommend(space, prefs), [space, prefs]);
  const shown = showAll ? results : results.slice(0, TOP_SHOWN);
  const hasMore = results.length > TOP_SHOWN;
  const unmetMessages = useMemo(() => unmetMessage(t, prefs, unmet), [t, prefs, unmet]);

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

        {unmetMessages.length > 0 && (
          <div className="mt-4 flex flex-col gap-1.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            {unmetMessages.map((msg) => (
              <p key={msg} className="text-xs leading-relaxed font-medium text-amber-700">
                {msg}
              </p>
            ))}
          </div>
        )}

        {lidCaution && (
          <p className="mt-4 rounded-2xl border border-cream-200 bg-cream-100 px-4 py-2.5 text-xs leading-relaxed text-ink-500">
            {t("recommend.lidCaution")}
          </p>
        )}

        {results.length === 0 ? (
          <p className="mt-6 rounded-card border border-sakura-100 bg-white px-4 py-10 text-center text-sm text-ink-400 shadow-sm">
            {t("recommend.noResults")}
          </p>
        ) : (
          <ol className="mt-6 flex flex-col gap-3">
            {shown.map((m, i) => (
              <li
                key={m.id}
                className={`flex flex-col gap-3 rounded-card border bg-white p-4 shadow-sm sm:p-5 ${
                  i === 0 ? "border-sakura-300 ring-2 ring-sakura-100" : "border-sakura-100"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                </div>

                {m.explain.length > 0 &&
                  (i === 0 ? (
                    <div className="rounded-2xl bg-cream-50 px-3.5 py-2.5">
                      <p className="text-xs font-semibold tracking-wide text-sakura-600 uppercase">
                        {t("recommend.topPickHeading")}
                      </p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink-600">
                        {m.explain.map((e, idx) => {
                          const sentence = explainSentence(t, e);
                          if (!sentence) return null;
                          return (
                            <li key={idx}>
                              {sentence}
                              {e.type === "lidUnknown" && <span aria-hidden="true"> ⚠️</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-cream-50 px-3.5 py-2.5 text-sm leading-relaxed text-ink-600">
                      {m.explain.map((e) => explainSentence(t, e)).filter(Boolean).join(" ")}
                      {m.lidClearance === "unknown" && <span aria-hidden="true"> ⚠️</span>}
                    </p>
                  ))}

                <DeltaBadges t={t} delta={m.delta} />

                <div className="flex flex-wrap gap-1.5">
                  <SpecChip label={t("specs.noiseSpin")} value={t("specs.dbValue", { db: m.noise_spin_db })} />
                  <SpecChip label={t("specs.power")} value={t("specs.whValue", { wh: m.power_wash_wh })} />
                  <SpecChip label={t("specs.water")} value={t("specs.lValue", { l: m.water_l })} />
                  <SpecChip label={t("specs.time")} value={t("specs.minValue", { min: m.time_min })} />
                  <SpecChip label={t("specs.weight")} value={t("specs.kgValue", { kg: m.weight_kg })} />
                  {m.lid_open_height_mm != null && (
                    <SpecChip
                      label={t("specs.lidOpenHeight")}
                      value={t("specs.mmValue", { mm: m.lid_open_height_mm })}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="mt-4 w-full rounded-full border border-sakura-200 bg-white py-2.5 text-sm font-medium text-sakura-600 shadow-sm transition hover:bg-sakura-50"
          >
            {showAll ? t("recommend.showLess") : t("recommend.showMore", { n: results.length })}
          </button>
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
