import type { Session } from "@/lib/programContent";

/*
  The body of one weekly session, in the order the source document uses:
  materials, steps, the words to say, the mandatory handwriting practice, then
  what to watch for. Presentational only — used by the timeline for both real
  student programs and the public example.
*/
export default function SessionDetail({ session }: { session: Session }) {
  return (
    <div className="space-y-4">
      <Field label="You need">
        <p className="text-[15px] leading-7 text-foreground/80">
          {session.youNeed}
        </p>
      </Field>

      <Field label="What to do">
        <ol className="space-y-1.5">
          {session.whatToDo.map((step, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[15px] leading-7 text-foreground/80"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-msot-cyan" />
              {step}
            </li>
          ))}
        </ol>
      </Field>

      <div className="rounded-xl bg-msot-yellow/15 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-msot-navy/70">
          Adult prompt
        </p>
        <p className="mt-1 text-[15px] font-medium leading-7 text-msot-navy">
          {session.adultPrompt}
        </p>
      </div>

      <div className="rounded-xl bg-msot-blue/[.07] px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-msot-blue">
          Handwriting link — always finish here
        </p>
        <p className="mt-1 text-[15px] leading-7 text-foreground/80">
          {session.handwritingLink}
        </p>
      </div>

      <Field label="Observe">
        <p className="text-[15px] leading-7 text-foreground/80">
          {session.observe}
        </p>
      </Field>

      {/*
        PLACEHOLDERS — no real assets yet.

        Both are deliberately inert rather than linked to a "coming soon" page:
        a teacher mid-session should be able to see at a glance that there is
        nothing to fetch, not click and be disappointed. Replace the diagram
        box with the illustration and turn the worksheet panel into a real
        download link once the files exist.
      */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Activity diagram */}
        <div className="grid min-h-[9rem] place-items-center rounded-xl border border-dashed border-black/15 bg-black/[.02] p-4 text-center">
          <div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto h-8 w-8 text-foreground/25"
              aria-hidden
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M3 16.5l4.5-4 3.5 3 3-2.5 7 6" />
            </svg>
            <p className="mt-2 text-sm font-medium text-foreground/50">
              Activity diagram
            </p>
            <p className="mt-0.5 text-xs text-foreground/40">Coming soon</p>
          </div>
        </div>

        {/* Worksheet download */}
        <div className="grid min-h-[9rem] place-items-center rounded-xl border border-dashed border-msot-blue/30 bg-msot-blue/[.03] p-4 text-center">
          <div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="mx-auto h-8 w-8 text-msot-blue/40"
              aria-hidden
            >
              <path d="M12 3v11" />
              <path d="M8 11l4 4 4-4" />
              <path d="M4 18h16" />
            </svg>
            <p className="mt-2 text-sm font-medium text-msot-blue/70">
              Download the worksheet
            </p>
            <p className="mt-0.5 text-xs text-foreground/40">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-foreground/45">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
