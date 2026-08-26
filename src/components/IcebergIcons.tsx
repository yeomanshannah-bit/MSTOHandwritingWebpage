/*
  The eight foundation icons, drawn as line art to match the iceberg poster.

  Each one is a bare 24x24 path set with no colour of its own — the caller
  supplies the stroke via `currentColor` and sizes it with a class, so the
  icons stay crisp at any size and follow whatever colour the card uses.
*/
type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      {children}
    </svg>
  );
}

/** 1 — a child sitting upright at a desk. */
export function PosturalControlIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      {/* Just the child and the chair. A desk as well made this unreadable at
          icon size, and sitting upright with the feet supported is the point. */}
      <circle cx="9" cy="5.1" r="2.1" />
      <path d="M9 7.2v5.4" />
      <path d="M9 9.4l4.3 1.2" />
      {/* chair: back, seat, legs */}
      <path d="M5.6 12.8V6.5M5.6 12.8h7.6M6.4 12.8V18M12.2 12.8V18" />
      {/* shin down to a foot flat on the floor */}
      <path d="M13.2 12.8v4.9M13.2 17.7h2.3" />
      <path d="M3.8 18.1h13.8" />
    </Svg>
  );
}

/** 2 — two hands working together. */
export function BilateralCoordinationIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      {/* One hand, then the same hand mirrored — the pair is the point. */}
      <g>
        <path d="M4.5 12.4V9.7M6.4 12.4V8.2M8.3 12.4V8.7M10.2 12.4v-2.3" />
        <path d="M3.7 12.3h7.3v3.4a3.65 3.65 0 0 1-7.3 0z" />
      </g>
      <g transform="translate(24,0) scale(-1,1)">
        <path d="M4.5 12.4V9.7M6.4 12.4V8.2M8.3 12.4V8.7M10.2 12.4v-2.3" />
        <path d="M3.7 12.3h7.3v3.4a3.65 3.65 0 0 1-7.3 0z" />
      </g>
    </Svg>
  );
}

/** 3 — a pencil held in a tripod grasp. */
export function FineMotorIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      {/* A hand gripping the pencil — the pencil alone would say the same
          thing as visual-motor integration, and two of eight icons matching
          is worse than either being imperfect. */}
      <path d="M18.6 3.2 21 5.6 13.5 13.1l-3.2.8.8-3.2z" />
      <path d="M17.1 4.7 19.5 7.1" />
      <path d="M4.3 14.1v-2.5M6.2 14.1V9.8M8.1 14.1v-3.3" />
      <path d="M3.5 14h6.8v3.3a3.4 3.4 0 0 1-6.8 0z" />
    </Svg>
  );
}

/** 4 — a seated figure, calm and centred in the body. */
export function SensoryRegulationIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="4.9" r="2.1" />
      <path d="M12 7.3c-2.1 0-3.7 1.5-3.7 3.5v1.8" />
      <path d="M12 7.3c2.1 0 3.7 1.5 3.7 3.5v1.8" />
      {/* arms resting out on the knees */}
      <path d="M8.3 12.2c-1.9.7-3.2 1.7-4 3.1" />
      <path d="M15.7 12.2c1.9.7 3.2 1.7 4 3.1" />
      {/* crossed legs */}
      <path d="M4.3 15.3c1.9-1.2 4.5-1.9 7.7-1.9s5.8.7 7.7 1.9" />
      <path d="M4.3 15.3c1.7 1.9 4.3 3 7.7 3s6-1.1 7.7-3" />
    </Svg>
  );
}

/** 5 — an eye: taking in what is on the page. */
export function VisualPerceptionIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2.8 12s3.4-5.6 9.2-5.6S21.2 12 21.2 12s-3.4 5.6-9.2 5.6S2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.9" />
    </Svg>
  );
}

/** 6 — a pencil following the line the eyes are tracking. */
export function VisualMotorIntegrationIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M16.8 3.6 19 5.8 9.2 15.6l-3 .8.8-3z" />
      <path d="M15.2 5.2 17.4 7.4" />
      <path d="M3.4 19.8c2.6 0 3.4-2.4 5.6-2.4s2.6 2.4 5.2 2.4 3.4-1.6 5.4-1.6" />
    </Svg>
  );
}

/** 7 — a head with turning gears: attention and planning. */
export function AttentionExecutiveIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      {/* head in profile */}
      <path d="M6.6 20.4v-3C4.4 15.9 3 13.5 3 10.8A7.8 7.8 0 0 1 18.6 10c0 4.7-3.4 6.2-3.4 8.3v2.1z" />
      {/* two gears meshing inside it */}
      <circle cx="9.2" cy="9.4" r="1.9" />
      <path d="M9.2 6.3v1.2M9.2 11.3v1.2M6.5 7.8l1 .6M10.9 10.4l1 .6M6.5 11l1-.6M10.9 8.4l1-.6" />
      <circle cx="14.4" cy="13.1" r="1.3" />
      <path d="M14.4 11.1v.5M14.4 14.6v.5M12.7 12.1l.4.3M15.7 13.8l.4.3M12.7 14.1l.4-.3M15.7 12.4l.4-.3" />
    </Svg>
  );
}

/** 8 — an open book showing letters. */
export function LanguageLetterIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 6.6C10.4 5.4 8.4 4.8 5.6 4.8H3.2v12.6h2.4c2.8 0 4.8.6 6.4 1.8 1.6-1.2 3.6-1.8 6.4-1.8h2.4V4.8h-2.4c-2.8 0-4.8.6-6.4 1.8Z" />
      <path d="M12 6.6v12.6" />
      <path d="M6.2 9.2h2.8M7 11.1h1.2" />
      <path d="M15.2 9.2h2.4M15.2 11.1h2.4" />
    </Svg>
  );
}

/** Icons keyed by the foundation ids in lib/icebergContent.ts. */
export const foundationIcons: Record<
  string,
  (props: IconProps) => React.ReactElement
> = {
  "postural-control": PosturalControlIcon,
  "bilateral-coordination": BilateralCoordinationIcon,
  "fine-motor-control": FineMotorIcon,
  "sensory-regulation": SensoryRegulationIcon,
  "visual-perception": VisualPerceptionIcon,
  "visual-motor-integration": VisualMotorIntegrationIcon,
  "attention-executive-function": AttentionExecutiveIcon,
  "language-letter-knowledge": LanguageLetterIcon,
};
