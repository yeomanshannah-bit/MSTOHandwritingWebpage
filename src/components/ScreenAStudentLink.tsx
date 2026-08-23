import Link from "next/link";

/*
  The "Screen a student" call to action.

  There is one of these at the foot of every education page, and they had
  drifted apart — three sizes, two colours and two capitalisations of the same
  button. They live here now so that changing the wording or the styling
  changes every one of them at once.

  The site header is deliberately NOT built from this: it is a navigation item
  pointing at the student roster, not a call to action pointing at sign-in.
*/
export default function ScreenAStudentLink({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link
      href="/login"
      className={`mt-5 inline-flex rounded-full bg-msot-teal px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:brightness-95 ${className}`}
    >
      Screen a student →
    </Link>
  );
}
