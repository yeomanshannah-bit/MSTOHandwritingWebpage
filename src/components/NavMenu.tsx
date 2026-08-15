"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  The "Learn" drop-down in the site header.

  A Client Component because it opens and closes. SiteHeader stays a Server
  Component and just renders this — the menu is the only interactive part.

  Three things close it, and all three matter: Escape, a click anywhere
  outside, and a change of page. That last one is easy to miss — the header
  lives in the root layout, so it does not remount when you navigate. Without
  the pathname effect the menu would still be hanging open over the new page
  after you picked something from it.
*/
export type NavMenuItem = { href: string; label: string; blurb: string };

export default function NavMenu({
  label,
  items,
  className,
}: {
  label: string;
  items: NavMenuItem[];
  className?: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /*
    Rather than a boolean plus an effect that closes the menu on navigation,
    the state is *which page the menu was opened on*. It counts as open only
    while that still matches the current page, so navigating closes it for
    free — no effect, and no extra render after the route changes.
  */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedOn(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpenedOn(null);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Any of the menu's pages being the current one lights up the trigger, so
  // the bar still shows where you are once the pages are hidden behind it.
  const active = items.some((item) => pathname.startsWith(item.href));

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${className ?? ""} flex items-center gap-1.5 ${
          active || open ? "bg-msot-blue/[.08]" : ""
        }`}
      >
        {label}
        <svg
          viewBox="0 0 12 8"
          aria-hidden
          className={`h-2 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1.5 6 6.5 11 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-black/[.08] bg-white p-2 shadow-xl"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block rounded-xl px-4 py-3 transition-colors hover:bg-msot-blue/[.07]"
            >
              <span className="block font-semibold text-msot-navy">
                {item.label}
              </span>
              <span className="mt-0.5 block text-[13px] font-normal leading-5 text-foreground/60">
                {item.blurb}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
