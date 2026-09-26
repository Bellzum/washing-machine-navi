import { useTranslation } from "react-i18next";
import WashingMachineIllustration from "./WashingMachineIllustration.jsx";

export default function Hero() {
  const { t } = useTranslation();

  const links = [
    { href: "#fit-check", key: "nav.fitCheck", icon: "📏" },
    { href: "#recommend", key: "nav.recommend", icon: "🏆" },
    { href: "#compare", key: "nav.compare", icon: "🧺" },
    { href: "#old-machine", key: "nav.oldMachine", icon: "📷" },
    { href: "#guide", key: "nav.guide", icon: "💡" },
  ];

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sakura-100 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-sage-100 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <WashingMachineIllustration className="mx-auto h-36 w-auto sm:h-44" />

        <span className="mt-4 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-600">
          🇯🇵 Japan apartment edition
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink-800 sm:text-4xl">
          {t("app.tagline")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600 sm:text-base">
          {t("app.subtagline")}
        </p>

        <nav className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 rounded-full border border-sakura-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sakura-50 hover:shadow"
            >
              <span aria-hidden="true">{l.icon}</span>
              {t(l.key)}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
