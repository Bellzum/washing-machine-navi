import { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import machinesData from "../data/machines.json";
import {
  computeFit,
  tapCompatible,
  checkLidClearance,
  deltaVsOldMachine,
  heightUnverifiedVsOldMachine,
} from "../lib/fit";
import { yen } from "../lib/format";
import FitBadge from "./FitBadge.jsx";
import SpecChip from "./SpecChip.jsx";
import DeltaBadges from "./DeltaBadges.jsx";

const { machines } = machinesData;

export default function CompareSection({ space }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language?.startsWith("ja");
  const [type, setType] = useState("all");
  const [onlyFit, setOnlyFit] = useState(false);
  const [sort, setSort] = useState("price");
  const [expanded, setExpanded] = useState(null);

  const rows = useMemo(() => {
    let list = machines.map((m) => {
      const bodyFit = computeFit(m, space);
      const lidClearance = checkLidClearance(m, space);
      // A confirmed lid-open failure overrides the body-height-only fit —
      // otherwise the headline Fit badge could say "Fits ◎" for a machine
      // whose lid can't actually open under the user's ceiling/shelf limit.
      const fit = lidClearance === "no" ? "no" : bodyFit;
      return {
        ...m,
        fit,
        bodyFit,
        tapNote: tapCompatible(m, space),
        lidClearance,
        heightUnverified: heightUnverifiedVsOldMachine(m, space),
        delta: deltaVsOldMachine(m, space),
      };
    });

    if (type !== "all") list = list.filter((m) => m.type === type);
    if (onlyFit) list = list.filter((m) => m.fit === "fits" || m.fit === "tight");

    list.sort((a, b) => {
      if (sort === "price") return a.price_yen - b.price_yen;
      if (sort === "capacity") return b.wash_kg - a.wash_kg;
      if (sort === "width") return a.width_mm - b.width_mm;
      return 0;
    });

    return list;
  }, [type, onlyFit, sort, space]);

  return (
    <section id="compare" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl font-bold text-ink-800">{t("compare.heading")}</h2>
        <p className="mt-1.5 text-sm text-ink-600">{t("compare.description")}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-sakura-100 bg-white p-1 shadow-sm">
            {[
              ["all", t("compare.typeAll")],
              ["vertical", t("compare.typeVertical")],
              ["drum", t("compare.typeDrum")],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setType(val)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  type === val ? "bg-sakura-300 text-white shadow" : "text-ink-600 hover:bg-sakura-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 rounded-full border border-sage-100 bg-white px-3.5 py-2 text-sm font-medium text-ink-600 shadow-sm">
            <input
              type="checkbox"
              checked={onlyFit}
              onChange={(e) => setOnlyFit(e.target.checked)}
              className="h-4 w-4 accent-sage-500"
            />
            {t("compare.fitOnlyFit")}
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-sakura-100 bg-white px-3.5 py-2 text-sm font-medium text-ink-600 shadow-sm outline-none"
          >
            <option value="price">{t("compare.sortPrice")}</option>
            <option value="capacity">{t("compare.sortCapacity")}</option>
            <option value="width">{t("compare.sortWidth")}</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-card border border-sakura-100 bg-white shadow-sm">
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th className="sticky left-0 z-10 bg-cream-100 px-4 py-3">
                    {t("compare.columns.brand")}
                  </th>
                  <th className="px-4 py-3">{t("compare.columns.type")}</th>
                  <th className="px-4 py-3">{t("compare.columns.capacity")}</th>
                  <th className="px-4 py-3">{t("compare.columns.size")}</th>
                  <th className="px-4 py-3">{t("compare.columns.tap")}</th>
                  <th className="px-4 py-3">{t("compare.columns.price")}</th>
                  <th className="px-4 py-3">{t("compare.columns.fit")}</th>
                  <th className="px-4 py-3">{t("compare.columns.links")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <Fragment key={m.id}>
                    <tr
                      className="cursor-pointer border-b border-cream-100 align-top transition hover:bg-sakura-50/50"
                      onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                    >
                      <td className="sticky left-0 z-10 bg-white px-4 py-3.5">
                        <p className="font-semibold text-ink-800">
                          {isJa ? m.brand_ja : m.brand_en}
                        </p>
                        <p className="text-xs text-ink-400">{m.model}</p>
                      </td>
                      <td className="px-4 py-3.5 text-ink-600">
                        {t(m.type === "vertical" ? "compare.typeVertical" : "compare.typeDrum")}
                      </td>
                      <td className="px-4 py-3.5 text-ink-600">
                        {m.wash_kg}kg{m.dry_kg ? ` / ${m.dry_kg}kg` : ""}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-ink-600">
                        {m.width_mm}×{m.depth_mm}×{m.height_mm}mm
                      </td>
                      <td className="px-4 py-3.5 text-ink-600">
                        <span
                          className={
                            m.tapNote === "partial" ? "text-amber-600" : "text-ink-600"
                          }
                        >
                          {t(`tapType.${m.tap}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold whitespace-nowrap text-ink-800">
                        {yen(m.price_yen)}
                      </td>
                      <td className="px-4 py-3.5">
                        <FitBadge status={m.fit} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          <a
                            href={m.yodobashi}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-full bg-sakura-100 px-2.5 py-1 text-center text-xs font-medium text-sakura-600 hover:bg-sakura-200"
                          >
                            {t("compare.yodobashi")}
                          </a>
                          <a
                            href={m.biccamera}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-full bg-sage-100 px-2.5 py-1 text-center text-xs font-medium text-sage-600 hover:bg-sage-200"
                          >
                            {t("compare.biccamera")}
                          </a>
                        </div>
                      </td>
                    </tr>
                    {expanded === m.id && (
                      <tr className="border-b border-cream-100 bg-cream-50/70">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            <SpecChip
                              label={t("specs.noiseWash")}
                              value={t("specs.dbValue", { db: m.noise_wash_db })}
                            />
                            <SpecChip
                              label={t("specs.noiseSpin")}
                              value={t("specs.dbValue", { db: m.noise_spin_db })}
                            />
                            <SpecChip
                              label={t("specs.power")}
                              value={t("specs.whValue", { wh: m.power_wash_wh })}
                            />
                            {m.power_dry_wh && (
                              <SpecChip
                                label={t("specs.powerDry")}
                                value={t("specs.whValue", { wh: m.power_dry_wh })}
                              />
                            )}
                            <SpecChip label={t("specs.water")} value={t("specs.lValue", { l: m.water_l })} />
                            <SpecChip
                              label={t("specs.time")}
                              value={t("specs.minValue", { min: m.time_min })}
                            />
                            {m.dry_time_min && (
                              <SpecChip
                                label={t("specs.timeDry")}
                                value={t("specs.minValue", { min: m.dry_time_min })}
                              />
                            )}
                            <SpecChip label={t("specs.weight")} value={t("specs.kgValue", { kg: m.weight_kg })} />
                            {m.lid_open_height_mm != null && (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
                                  m.lidClearance === "no"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-white text-ink-600"
                                }`}
                              >
                                <span className={m.lidClearance === "no" ? "" : "text-ink-400"}>
                                  {t("specs.lidOpenHeight")}
                                </span>
                                <span className="font-semibold">
                                  {t("specs.mmValue", { mm: m.lid_open_height_mm })}
                                </span>
                              </span>
                            )}
                            <SpecChip
                              label={t("compare.columns.pan")}
                              value={`${m.min_pan_mm}mm〜`}
                            />
                          </div>
                          {m.lidClearance === "no" && (
                            <p className="mt-2 text-xs font-medium text-rose-600">
                              ⚠️ {t("compare.lidExceeds", { mm: m.lid_open_height_mm })}
                            </p>
                          )}
                          {m.lidClearance === "unknown" && (
                            <p className="mt-2 text-xs font-medium text-amber-600">
                              ⚠️ {t("recommend.explain.lidUnknown")}
                            </p>
                          )}
                          {m.heightUnverified && (
                            <p className="mt-2 text-xs font-medium text-amber-600">
                              ⚠️ {t("recommend.explain.heightUnverified", { mm: m.height_mm })}
                            </p>
                          )}
                          <div className="mt-3">
                            <DeltaBadges t={t} delta={m.delta} />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {m.features.map((f) => (
                              <span
                                key={f}
                                className="rounded-full bg-sage-50 px-2.5 py-1 text-xs font-medium text-sage-600"
                              >
                                {t(`features.${f}`)}
                              </span>
                            ))}
                          </div>
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
                            {isJa ? m.notes_ja : m.notes_en}
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-ink-400">
              {t("compare.noResults")}
            </p>
          )}
        </div>

        <p className="mt-3 text-xs text-ink-400">
          {t("compare.updatedNote", { date: machinesData.updated })}
        </p>
      </div>
    </section>
  );
}
