/*
  Turns a screening result into a 20-week program.

  The tailoring is the SELECTION, not the content: we take the domains the
  screener flagged (worst first), keep the top few, then lay their sessions out
  across twenty weeks. The session wording itself comes from lib/programContent.ts
  and is identical for every child.

  How the weeks are laid out: we rotate through the chosen domains, and each
  time a domain comes round it advances to its next session. So with four
  domains the order is A1 B1 C1 D1 A2 B2 C2 D2 A3 B3.

  Two properties that matter clinically:
    - Each domain keeps its own progression, in order (its week 1 is always
      delivered before its week 2). The source document's weeks build on each
      other, so shuffling them would break the design.
    - The worst-scoring domain comes round most often, so the child gets the
      most practice where they need it most.

  With a single domain this degrades exactly to the source document: that
  domain's weeks 1-10, in order — and STOPS there, because ten sessions is all
  the content a domain has. A one-domain program is therefore ten weeks long,
  not twenty. Two or more domains fill all twenty weeks.
*/

import {
  programDomainById,
  type ProgramDomain,
  type Session,
} from "./programContent";

/** A program runs for twenty weekly sessions. */
export const PROGRAM_WEEKS = 20;

/** Most domains one program will draw on. More than this and the child is
    being asked to work on too much at once. */
export const MAX_DOMAINS = 4;

export type PlannedWeek = {
  /** Week 1-20 of the program itself. */
  week: number;
  domain: ProgramDomain;
  /** The session from that domain — note session.week is the week within the
      domain's own progression, which is NOT the program week. */
  session: Session;
};

export type Program = {
  /** The domains this program draws on, most-affected first. */
  domains: ProgramDomain[];
  weeks: PlannedWeek[];
  /** Flagged domains that didn't make the cut — worth revisiting later. */
  deferred: ProgramDomain[];
};

/**
 * Build a program from flagged domain ids, ordered worst-first.
 * Unknown ids are ignored, so a screening that references a retired domain
 * still produces a usable program rather than throwing.
 */
export function buildProgram(
  flaggedDomainIds: string[],
  maxDomains: number = MAX_DOMAINS,
): Program {
  const all = flaggedDomainIds
    .map((id) => programDomainById[id])
    .filter((d): d is ProgramDomain => Boolean(d));

  const domains = all.slice(0, maxDomains);
  const deferred = all.slice(maxDomains);

  const weeks: PlannedWeek[] = [];
  if (domains.length > 0) {
    for (let i = 0; i < PROGRAM_WEEKS; i++) {
      const domain = domains[i % domains.length];
      const sessionIndex = Math.floor(i / domains.length);
      const session = domain.sessions[sessionIndex];
      // Ran out of sessions: a domain has ten, so a single-domain program
      // ends at week ten rather than inventing content it does not have.
      if (!session) break;
      weeks.push({ week: i + 1, domain, session });
    }
  }

  return { domains, weeks, deferred };
}

/** How many sessions each domain gets in a built program — used to show the
    balance of the program at a glance. */
export function sessionCounts(program: Program): { domain: ProgramDomain; count: number }[] {
  return program.domains.map((domain) => ({
    domain,
    count: program.weeks.filter((w) => w.domain.id === domain.id).length,
  }));
}
