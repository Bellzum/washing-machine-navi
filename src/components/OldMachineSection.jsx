import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { isSupabaseConfigured } from "../lib/supabaseClient";

const inputClass =
  "w-full rounded-xl border border-sakura-100 bg-cream-50 px-3.5 py-2.5 text-ink-800 shadow-sm outline-none transition focus:border-sakura-300 focus:ring-2 focus:ring-sakura-100";

export default function OldMachineSection({ user, signInWithEmail, signOut, machines, onUseForFit }) {
  const { t } = useTranslation();
  const { list, save, remove } = machines;

  const [form, setForm] = useState({ name: "", width_mm: "", depth_mm: "", height_mm: "", tap: "unknown" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const fileInputRef = useRef(null);

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await save(form, photoFile);
      setForm({ name: "", width_mm: "", depth_mm: "", height_mm: "", tap: "unknown" });
      clearPhoto();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await remove(id);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    const { error } = await signInWithEmail(email);
    if (!error) setMagicLinkSent(true);
  };

  return (
    <section id="old-machine" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-ink-800">{t("old.heading")}</h2>
        <p className="mt-1.5 text-sm text-ink-600">{t("old.description")}</p>

        {isSupabaseConfigured ? (
          <div className="mt-4 rounded-2xl border border-sage-100 bg-sage-50 p-4 text-sm">
            {user ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-ink-600">
                  {t("old.signedInAs")} <strong>{user.email}</strong>
                </span>
                <button
                  onClick={signOut}
                  className="rounded-full border border-sage-300 px-3 py-1 text-xs font-medium text-sage-600 hover:bg-sage-100"
                >
                  {t("old.signOut")}
                </button>
              </div>
            ) : magicLinkSent ? (
              <p className="text-sage-700">{t("old.checkInbox")}</p>
            ) : (
              <form onSubmit={handleMagicLink} className="flex flex-wrap items-center gap-2">
                <span className="text-ink-600">{t("old.signInPrompt")}</span>
                <input
                  type="email"
                  required
                  placeholder={t("old.loginEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-[200px] flex-1 rounded-full border border-sage-200 bg-white px-3.5 py-1.5 text-sm outline-none focus:border-sage-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-sage-400 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-sage-500"
                >
                  {t("old.sendMagicLink")}
                </button>
              </form>
            )}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-cream-200 bg-cream-100 px-4 py-2.5 text-xs text-ink-400">
            {t("old.localOnlyNote")}
          </p>
        )}

        <form
          onSubmit={handleSave}
          className="mt-6 rounded-card border border-sakura-100 bg-white p-5 shadow-sm sm:p-7"
        >
          <span className="mb-1.5 block text-sm font-medium text-ink-700">
            {t("old.photoLabel")}
          </span>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="old washing machine"
                className="h-28 w-28 rounded-2xl border border-sakura-100 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-sakura-200 bg-cream-50 text-3xl">
                📷
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer rounded-full bg-sakura-300 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-sakura-400">
                {photoPreview ? t("old.photoChange") : t("old.photoLabel")}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onPickPhoto}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="text-xs font-medium text-ink-400 underline underline-offset-2"
                >
                  {t("old.photoRemove")}
                </button>
              )}
              <p className="max-w-xs text-xs text-ink-400">{t("old.photoHelp")}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">
                {t("old.nameLabel")}
              </span>
              <input
                type="text"
                className={inputClass}
                placeholder={t("old.namePlaceholder")}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">
                {t("old.widthLabel")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={form.width_mm}
                onChange={(e) => setForm((f) => ({ ...f, width_mm: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">
                {t("old.depthLabel")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={form.depth_mm}
                onChange={(e) => setForm((f) => ({ ...f, depth_mm: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">
                {t("old.heightLabel")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={form.height_mm}
                onChange={(e) => setForm((f) => ({ ...f, height_mm: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">
                {t("old.tapLabel")}
              </span>
              <select
                className={inputClass}
                value={form.tap}
                onChange={(e) => setForm((f) => ({ ...f, tap: e.target.value }))}
              >
                <option value="unknown">{t("fit.tapUnknown")}</option>
                <option value="single">{t("fit.tapSingle")}</option>
                <option value="mixer">{t("fit.tapMixer")}</option>
              </select>
            </label>
          </div>

          <details className="mt-3 text-sm text-ink-600">
            <summary className="cursor-pointer font-medium text-sakura-600">
              {t("old.tapHelperTitle")}
            </summary>
            <p className="mt-2 max-w-lg leading-relaxed">{t("old.tapHelperBody")}</p>
          </details>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-full bg-sakura-400 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-sakura-500 disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {t("old.saveButton")}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink-700">{t("old.savedList")}</h3>
          {list.length === 0 ? (
            <p className="mt-2 text-sm text-ink-400">{t("old.empty")}</p>
          ) : (
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {list.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-2xl border border-sakura-100 bg-white p-3 shadow-sm"
                >
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name || "washing machine"}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-xl">
                      🧺
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-800">
                      {m.name || "—"}
                    </p>
                    <p className="text-xs text-ink-400">
                      {m.width_mm || "?"}×{m.depth_mm || "?"}×{m.height_mm || "?"}mm ·{" "}
                      {t(`fit.tap${m.tap === "single" ? "Single" : m.tap === "mixer" ? "Mixer" : "Unknown"}`)}
                    </p>
                    <div className="mt-1.5 flex gap-3">
                      <button
                        onClick={() =>
                          onUseForFit({
                            name: m.name,
                            width: m.width_mm,
                            depth: m.depth_mm,
                            height: m.height_mm,
                            tap: m.tap,
                          })
                        }
                        className="text-xs font-medium text-sakura-600 underline underline-offset-2"
                      >
                        {t("old.useForFit")}
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-xs font-medium text-ink-400 underline underline-offset-2"
                      >
                        {t("old.delete")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
