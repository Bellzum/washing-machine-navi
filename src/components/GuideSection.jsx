import { useTranslation } from "react-i18next";

export default function GuideSection() {
  const { t } = useTranslation();

  const cards = [
    { icon: "📐", title: "guide.panTitle", body: "guide.panBody" },
    { icon: "🌀", title: "guide.typeTitle", body: "guide.typeBody" },
    { icon: "🚰", title: "guide.tapTitle", body: "guide.tapBody" },
    { icon: "👨‍👩‍👧", title: "guide.capacityTitle", body: "guide.capacityBody" },
    { icon: "📏", title: "guide.lidTitle", body: "guide.lidBody" },
    { icon: "📢", title: "guide.adsTitle", body: "guide.adsBody" },
  ];

  return (
    <section id="guide" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl font-bold text-ink-800">{t("guide.heading")}</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-card border border-sage-100 bg-white p-5 shadow-sm"
            >
              <span className="text-2xl">{c.icon}</span>
              <h3 className="mt-2 font-display text-base font-bold text-ink-800">
                {t(c.title)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{t(c.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
