/*
  Paper-and-pencil mark — a small decorative device.

  Used wherever the platform offers to build or continue a program. Drawn in
  the MSOT palette and sized to sit beside a heading. Swap this component's
  contents to change the artwork, and every place that uses it updates at once.
*/
export default function PaperPencilMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* sheet of paper, tilted slightly so it feels placed rather than filed */}
      <g transform="rotate(-6 30 34)">
        <rect
          x="12"
          y="12"
          width="34"
          height="44"
          rx="4"
          fill="#ffffff"
          stroke="#00558c"
          strokeWidth="2.5"
        />
        {/* ruled lines, the last one short as though writing stopped mid-word */}
        <g stroke="#01c6e3" strokeWidth="2.5" strokeLinecap="round">
          <line x1="19" y1="25" x2="39" y2="25" />
          <line x1="19" y1="34" x2="39" y2="34" />
          <line x1="19" y1="43" x2="31" y2="43" />
        </g>
      </g>

      {/* pencil, crossing the lower right corner of the page */}
      <g transform="rotate(38 44 36)">
        <rect x="40" y="10" width="9" height="34" rx="2" fill="#ffd401" />
        <rect x="40" y="6" width="9" height="5" rx="1.5" fill="#ffabb1" />
        <path d="M40,44 L49,44 L44.5,54 Z" fill="#f7c9a4" />
        <path d="M42.2,49 L46.8,49 L44.5,54 Z" fill="#00558c" />
      </g>
    </svg>
  );
}
