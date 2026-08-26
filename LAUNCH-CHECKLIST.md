# Before going live

Written 26 August 2026, after the iceberg rebuild and the
Reception/Foundations screener landed. Ordered by what blocks what, not by
effort. Everything here was checked against the code, not assumed.

---

## 0 · Decide where the app is hosted

**Cloudflare almost certainly cannot host this app itself.** The production
build reports every route as `ƒ (Dynamic) server-rendered on demand`: this is
Next 16 App Router with Supabase server-side auth and a middleware/proxy layer.
Cloudflare Pages does not run that natively — it needs the
`@opennextjs/cloudflare` adapter, which is extra work and an extra thing to
debug at the worst possible moment.

**Recommended:** keep the domain at Cloudflare as registrar and DNS, and host
the app on Vercel (who build Next.js, so it is zero-config). Point a Cloudflare
DNS record at Vercel. The domain works exactly as intended and nothing about
the purchase is wasted.

This decision changes the deployment work below, so settle it first.

---

## 1 · Blockers — the app is not trustworthy until these pass

### Prove the baseline photo upload works end to end
**Never once completed successfully.** All five tables exist, but the private
`baselines` storage bucket has never been confirmed, and the Two Term program
is gated behind a baseline existing — so if this is broken, the core flow is
broken.

Cannot be verified except by a human:

1. Confirm a `baselines` bucket appears under Storage in the Supabase dashboard.
2. Upload any image on a student's baseline page.
3. **Reload the page.** Surviving the reload is the real proof — it means the
   bucket, its storage policy, the database row and the signed URL all work.

The page prints the real error in red rather than failing silently, so capture
that message if it fails.

### Harden auth — all three together, or not at all
Auth is deliberately weak for development. Half-doing this leaves a public site
with a known password on it.

- [ ] Enable **Confirm email** in Supabase → Authentication → Providers → Email
- [ ] Raise the password rule at `src/app/login/page.tsx:94` (`minLength={6}`)
- [ ] Migrate or delete the test user `test@school.com` / `123456`

**Deleting that user cascades.** Every table carries
`staff_id ... references auth.users on delete cascade`, so all test students,
screenings, programs and baseline photos go with it. Decide deliberately
whether that data matters before touching it.

### Add the production domain to Supabase
Once email confirmation is on, Supabase must know the real domain
(Authentication → URL Configuration → Site URL and Redirect URLs), or
confirmation links will send people to localhost.

---

## 2 · Users would notice these

- [ ] **Error and not-found pages.** `src/app/` has no `error.tsx` or
      `not-found.tsx`, so any failure shows a raw Next.js error screen.
- [ ] **Favicon.** No app icon exists; the browser tab shows a blank glyph.
- [ ] **Site title says "Making Sense OT"** (`src/app/layout.tsx:13`) while the
      header now reads Making Sense Together. Reconcile before anyone sees it.
- [ ] **Social preview image.** No Open Graph image, so links shared to
      WhatsApp or Facebook will look bare.
- [ ] **`middleware.ts` is deprecated** in Next 16 and warns on every boot.
      Rename to the `proxy` convention.

---

## 3 · Human decisions — not for Claude to quietly implement

- **Privacy and consent.** The app stores children's initials, year levels and
  photographs of their handwriting. In a school context this likely needs a
  privacy policy and an explicit conversation about consent before any real
  student data is entered.
- **Screener wording** needs review by real teachers, not a language model.
- **Part 3 (writing confidence) is still scored on the old count rule** while
  the foundations moved to percentages. Whether emotional distress should be
  weighted as sensitively as participation is a clinical call that has not been
  made.

---

## Already fine — checked, no action needed

- Row-level security enabled on all five tables
- `.env*` and `/Content` are gitignored; no secrets in the repo
- No hardcoded `localhost` or `127.0.0.1` anywhere in `src/`
- `tsc --noEmit`, `npm run lint` and `npm run build` all clean
