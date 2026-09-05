/*
  BrandBackdrop — faint, playful Making Sense Together confetti tucked into the page
  edges, echoing the shapes in the brand logo (rings, triangles, squares, dots).
  It sits behind all content and never intercepts clicks (`pointer-events-none`),
  so it's purely decorative. Kept low-opacity so it adds personality without
  competing with the text.
*/
export default function BrandBackdrop() {
  const triangle = { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* ---- top band ---- */}
      <div className="absolute left-[8%] top-[6%] h-10 w-10 rotate-12 rounded-md bg-msot-yellow/40" />
      <div
        className="absolute left-[26%] top-[4%] h-8 w-8 bg-msot-orange/40"
        style={triangle}
      />
      <div className="absolute right-[22%] top-[7%] h-9 w-9 rounded-full border-[7px] border-msot-cyan/40" />
      <div className="absolute -right-14 top-[10%] h-44 w-44 rounded-full bg-msot-cyan/10" />

      {/* ---- left edge ---- */}
      <div className="absolute -left-6 top-[34%] h-20 w-20 rounded-full border-[14px] border-msot-pink/40" />
      <div className="absolute left-[5%] top-[52%] h-6 w-6 rounded-full bg-msot-red/35" />
      <div className="absolute left-4 top-[74%] h-14 w-14 rotate-[18deg] rounded-lg bg-msot-teal/20" />

      {/* ---- right edge ---- */}
      <div className="absolute right-[7%] top-[40%] h-7 w-7 rounded-full bg-msot-blue/30" />
      <div className="absolute right-[10%] top-[60%] h-10 w-10 rotate-6 rounded-md bg-msot-red/25" />

      {/* ---- bottom band ---- */}
      <div
        className="absolute right-8 top-[86%] h-16 w-16 -rotate-12 bg-msot-yellow/35"
        style={triangle}
      />
      <div className="absolute left-[30%] top-[90%] h-8 w-8 rounded-full border-[6px] border-msot-teal/40" />
      <div className="absolute left-[62%] top-[93%] h-7 w-7 rounded-md bg-msot-orange/30" />
    </div>
  );
}
