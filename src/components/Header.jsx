import { useTranslation } from "react-i18next";

function WashingMachineMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden="true">
      <rect x="6" y="4" width="52" height="56" rx="10" fill="var(--color-sakura-300)" />
      <rect x="6" y="4" width="52" height="14" rx="7" fill="var(--color-sakura-400)" />
      <circle cx="16" cy="11" r="2.4" fill="#fff" />
      <circle cx="24" cy="11" r="2.4" fill="#fff" />
      <circle cx="32" cy="34" r="17" fill="#fff" />
      <circle cx="32" cy="34" r="13" fill="var(--color-sage-400)" />
      <circle
        cx="32"
        cy="34"
        r="13"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeDasharray="4 5"
      />
    </svg>
  );
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language?.startsWith("ja");

  const toggleLang = () => {
    i18n.changeLanguage(isJa ? "en" : "ja");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-sakura-100 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <WashingMachineMark />
          <div className="leading-tight">
            <p className="font-display text-lg font-bold text-ink-800 sm:text-xl">
              {t("app.title")}
            </p>
            <p className="text-xs text-ink-400">{t("app.titleEn")}</p>
          </div>
        </a>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 rounded-full border border-sakura-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-600 shadow-sm transition hover:bg-sakura-50 active:scale-95"
        >
          <span aria-hidden="true">🌐</span>
          {t("lang.switchTo")}
        </button>
      </div>
    </header>
  );
}
