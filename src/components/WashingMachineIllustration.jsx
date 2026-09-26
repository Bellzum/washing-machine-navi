// A hand-drawn-style illustration of a front-load washing machine, done in
// the app's own sakura/sage palette so it reads as part of the design
// rather than a bolted-on stock image. Pure inline SVG — no external asset,
// so it stays crisp at any size and costs nothing to load.
export default function WashingMachineIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 360 320"
      className={className}
      role="img"
      aria-label="Illustration of a friendly front-load washing machine with soap bubbles and sakura petals"
    >
      <defs>
        <radialGradient id="wmi-drum" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#eef6e8" />
          <stop offset="55%" stopColor="var(--color-sage-200)" />
          <stop offset="100%" stopColor="var(--color-sage-400)" />
        </radialGradient>
        <linearGradient id="wmi-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="var(--color-cream-100)" />
        </linearGradient>
        <clipPath id="wmi-drum-clip">
          <circle cx="152" cy="182" r="78" />
        </clipPath>
      </defs>

      {/* floating sakura petals */}
      <g opacity="0.9">
        <path d="M296 46c6-8 17-8 21 1 3 8-3 16-11 17-9 1-16-10-10-18z" fill="var(--color-sakura-300)" />
        <path d="M320 84c5-6 13-5 16 1 2 6-3 12-9 13-7 1-12-8-7-14z" fill="var(--color-sakura-200)" />
        <path d="M46 40c5-7 15-6 18 2 2 7-3 14-10 14-8 0-13-9-8-16z" fill="var(--color-sakura-200)" />
      </g>

      {/* soap bubbles */}
      <circle cx="70" cy="96" r="8" fill="var(--color-sakura-100)" />
      <circle cx="54" cy="118" r="4.5" fill="var(--color-sakura-200)" />
      <circle cx="300" cy="130" r="6" fill="var(--color-sage-200)" />
      <circle cx="284" cy="152" r="9" fill="var(--color-sakura-100)" />

      {/* machine shadow */}
      <ellipse cx="180" cy="300" rx="118" ry="10" fill="var(--color-sakura-100)" opacity="0.6" />

      {/* body */}
      <rect x="62" y="58" width="236" height="224" rx="28" fill="url(#wmi-body)" stroke="var(--color-sakura-200)" strokeWidth="3" />

      {/* control panel */}
      <rect x="86" y="78" width="164" height="26" rx="13" fill="var(--color-sakura-300)" />
      <circle cx="102" cy="91" r="5.5" fill="#fff" />
      <circle cx="120" cy="91" r="5.5" fill="#fff" />
      <rect x="140" y="86" width="94" height="10" rx="5" fill="#fff" opacity="0.85" />

      {/* drum housing */}
      <circle cx="152" cy="182" r="86" fill="#ffffff" stroke="var(--color-sakura-200)" strokeWidth="3" />
      <circle cx="152" cy="182" r="78" fill="url(#wmi-drum)" />

      {/* drum window swirl + suds */}
      <g clipPath="url(#wmi-drum-clip)">
        <path
          d="M84 200c30 22 66 22 96-2 26-20 58-18 84 4"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M78 226c34 20 72 16 100-8 24-20 54-16 78 6"
          fill="none"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.4"
        />
        <circle cx="118" cy="150" r="10" fill="#ffffff" opacity="0.75" />
        <circle cx="140" cy="136" r="5.5" fill="#ffffff" opacity="0.7" />
        <circle cx="188" cy="152" r="7" fill="#ffffff" opacity="0.6" />
      </g>
      <circle cx="152" cy="182" r="78" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.7" />

      {/* small side dial */}
      <circle cx="270" cy="146" r="15" fill="#ffffff" stroke="var(--color-sakura-200)" strokeWidth="2.5" />
      <circle cx="270" cy="146" r="4" fill="var(--color-sakura-400)" />

      {/* feet */}
      <rect x="86" y="278" width="16" height="10" rx="3" fill="var(--color-ink-100)" />
      <rect x="258" y="278" width="16" height="10" rx="3" fill="var(--color-ink-100)" />
    </svg>
  );
}
