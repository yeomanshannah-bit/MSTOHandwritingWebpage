/*
  The nine pre-writing shapes, drawn rather than described. A teacher running
  the shape check needs to see the shape they're asking the child to copy, and
  a written label ("Diagonal lines") is slower to read than the thing itself.

  Deliberately plain: a single stroke weight, round caps, currentColor so the
  glyph inherits whatever colour the card sets. These are models to copy, not
  decoration — no fills, no flourishes.
*/

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Each shape drawn inside a 64×64 box with an 8px margin. */
const glyphs: Record<string, React.ReactNode> = {
  vertical: <line x1="32" y1="8" x2="32" y2="56" />,
  horizontal: <line x1="8" y1="32" x2="56" y2="32" />,
  circle: <circle cx="32" cy="32" r="23" />,
  cross: (
    <>
      <line x1="32" y1="8" x2="32" y2="56" />
      <line x1="8" y1="32" x2="56" y2="32" />
    </>
  ),
  square: <rect x="10" y="10" width="44" height="44" rx="2" />,
  // Two parallel strokes: the child is copying the diagonal movement in both
  // directions, which is why this is separate from the X.
  diagonal: (
    <>
      <line x1="14" y1="54" x2="34" y2="10" />
      <line x1="34" y1="54" x2="54" y2="10" />
    </>
  ),
  x: (
    <>
      <line x1="12" y1="12" x2="52" y2="52" />
      <line x1="52" y1="12" x2="12" y2="52" />
    </>
  ),
  triangle: <polygon points="32,9 56,55 8,55" />,
  diamond: <polygon points="32,7 55,32 32,57 9,32" />,
};

export default function ShapeGlyph({
  shape,
  className = "",
}: {
  shape: string;
  className?: string;
}) {
  const glyph = glyphs[shape];
  if (!glyph) return null;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-hidden // the shape's name is always shown as text beside it
      {...strokeProps}
    >
      {glyph}
    </svg>
  );
}
