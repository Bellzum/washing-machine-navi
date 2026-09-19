import { useTranslation } from "react-i18next";
import machinesData from "../data/machines.json";

const { standard_pans: standardPans } = machinesData;

function Field({ label, help, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      {children}
      {help && <span className="mt-1 block text-xs text-ink-400">{help}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-sakura-100 bg-cream-50 px-3.5 py-2.5 text-ink-800 shadow-sm outline-none transition focus:border-sakura-300 focus:ring-2 focus:ring-sakura-100";

export default function FitCheckForm({ space, setSpace }) {
  const { t } = useTranslation();

  const applyPan = (panId) => {
    if (panId === "custom") {
      setSpace((s) => ({ ...s, panId }));
      return;
    }
    const pan = standardPans.find((p) => p.id === panId);
    setSpace((s) => ({
      ...s,
      panId,
      width: pan.width_mm,
      depth: pan.depth_mm,
    }));
  };

  const reset = () =>
    setSpace({ panId: "640", width: 640, depth: 640, height: "", tap: "unknown" });

  return (
    <section id="fit-check" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-ink-800">{t("fit.heading")}</h2>
        <p className="mt-1.5 text-sm text-ink-600">{t("fit.description")}</p>

        <div className="mt-6 rounded-card border border-sakura-100 bg-white p-5 shadow-sm sm:p-7">
          <Field label={t("fit.panPreset")}>
            <div className="flex flex-wrap gap-2">
              {standardPans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPan(p.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    space.panId === p.id
                      ? "border-sakura-400 bg-sakura-300 text-white shadow"
                      : "border-sakura-100 bg-cream-50 text-ink-600 hover:bg-sakura-50"
                  }`}
                >
                  {p.width_mm}×{p.depth_mm}
                </button>
              ))}
              <button
                type="button"
                onClick={() => applyPan("custom")}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  space.panId === "custom"
                    ? "border-sakura-400 bg-sakura-300 text-white shadow"
                    : "border-sakura-100 bg-cream-50 text-ink-600 hover:bg-sakura-50"
                }`}
              >
                {t("fit.panCustom")}
              </button>
            </div>
          </Field>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label={t("fit.widthLabel")}>
              <input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={space.width}
                onChange={(e) =>
                  setSpace((s) => ({ ...s, panId: "custom", width: e.target.value }))
                }
              />
            </Field>
            <Field label={t("fit.depthLabel")}>
              <input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={space.depth}
                onChange={(e) =>
                  setSpace((s) => ({ ...s, panId: "custom", depth: e.target.value }))
                }
              />
            </Field>
            <Field label={t("fit.heightLabel")} help={t("fit.heightHelp")}>
              <input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={space.height}
                onChange={(e) => setSpace((s) => ({ ...s, height: e.target.value }))}
                placeholder="—"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label={t("fit.tapLabel")}>
              <div className="flex flex-wrap gap-2">
                {[
                  ["single", t("fit.tapSingle")],
                  ["mixer", t("fit.tapMixer")],
                  ["unknown", t("fit.tapUnknown")],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSpace((s) => ({ ...s, tap: val }))}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      space.tap === val
                        ? "border-sage-400 bg-sage-300 text-white shadow"
                        : "border-sage-100 bg-cream-50 text-ink-600 hover:bg-sage-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-cream-200 pt-4">
            <details className="text-sm text-ink-600">
              <summary className="cursor-pointer font-medium text-sakura-600">
                {t("fit.helperTitle")}
              </summary>
              <p className="mt-2 max-w-md leading-relaxed">{t("fit.helperBody")}</p>
            </details>
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-full border border-cream-200 px-4 py-1.5 text-sm font-medium text-ink-400 transition hover:bg-cream-100"
            >
              {t("fit.resetButton")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
