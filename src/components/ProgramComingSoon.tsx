import Link from "next/link";
import PaperPencilMark from "@/components/PaperPencilMark";

/*
  Stands where the Two Term program will go while it is still being written.

  Deliberately not a button. During the beta there is nothing behind it, and
  a control that looks pressable but refuses to work reads as a bug rather
  than a promise. So this is a panel that says what is coming and stops.
*/
export default function ProgramComingSoon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-msot-blue/35 bg-msot-blue/[.05] p-6 ${className}`}
    >
      <span className="inline-flex items-center rounded-full bg-msot-blue px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Coming soon
      </span>
      <p className="mt-3 text-lg font-semibold text-msot-navy">
        The Two Term program
      </p>
      <p className="mt-1.5 max-w-lg text-sm leading-6 text-foreground/70">
        Every screening you complete is saved. When the program opens, a
        tailored two-term plan — short sessions a few times a week, built from
        the foundations this screening flagged — will be waiting for each
        student you have already screened.
      </p>

      {/* One public page explains the program; everything points at it. */}
      <Link
        href="/programs"
        className="mt-4 inline-flex text-sm font-semibold text-msot-blue hover:underline"
      >
        See what&apos;s coming →
      </Link>

      <PaperPencilMark
        className="pointer-events-none absolute -bottom-2 right-4 h-14 w-14 opacity-40"
      />
    </div>
  );
}
