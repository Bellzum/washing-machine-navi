import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const repoUrl = import.meta.env.VITE_GITHUB_REPO_URL;

  return (
    <footer className="mt-6 border-t border-sakura-100 bg-cream-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-display text-sm font-semibold text-ink-700">
          {t("footer.madeWith")} 🧺🌸
        </p>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-ink-400">
          {t("footer.disclaimer")}
        </p>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs font-medium text-sakura-600 underline underline-offset-2"
          >
            {t("footer.github")}
          </a>
        )}
      </div>
    </footer>
  );
}
