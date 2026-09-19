import { useTranslation } from "react-i18next";

const FIT_STYLES = {
  fits: "bg-sage-100 text-sage-600",
  tight: "bg-amber-100 text-amber-700",
  no: "bg-rose-100 text-rose-600",
  unknown: "bg-cream-200 text-ink-400",
};

export default function FitBadge({ status }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${FIT_STYLES[status]}`}
    >
      {t(`compare.fitStatus.${status}`)}
    </span>
  );
}
