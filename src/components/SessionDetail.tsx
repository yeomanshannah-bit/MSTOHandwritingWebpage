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
