import {
  BRANCHES,
  PHASES,
  PILLAR_LABELS,
  STEMS,
  tenGodOf,
  type FourPillars,
  type Phase,
} from "@contracts/bazi";

export interface PillarView {
  key: string;
  hanzi: string;
  english: string;
  domain: string;
  stem: (typeof STEMS)[number];
  branch: (typeof BRANCHES)[number];
  god: { key: string; hanzi: string; pinyin: string; english: string; reading: string } | null;
}

export function pillarViews(p: FourPillars): PillarView[] {
  const day = STEMS[p.dayStem];
  const stems = [p.yearStem, p.monthStem, p.dayStem, p.hourStem];
  const branches = [p.yearBranch, p.monthBranch, p.dayBranch, p.hourBranch];
  return PILLAR_LABELS.map((label, i) => {
    const stem = STEMS[stems[i]];
    return {
      key: label.key,
      hanzi: label.hanzi,
      english: label.english,
      domain: label.domain,
      stem,
      branch: BRANCHES[branches[i]],
      god: label.key === "day" ? null : tenGodOf(day, stem),
    };
  });
}

export function dayMasterOf(p: FourPillars) {
  return STEMS[p.dayStem];
}

/** Count the five phases across all eight characters. */
export function phaseCensus(p: FourPillars): Record<Phase, number> {
  const census: Record<Phase, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const stems = [p.yearStem, p.monthStem, p.dayStem, p.hourStem];
  const branches = [p.yearBranch, p.monthBranch, p.dayBranch, p.hourBranch];
  stems.forEach((s) => census[STEMS[s].phase]++);
  branches.forEach((b) => census[BRANCHES[b].phase]++);
  return census;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The gloss keeper. In its bilingual posture a symbol carries its English
 * beside it at first showing, （甲）, and stays in English only at every
 * showing after. In the plain posture, kept for the Translate to English
 * control, the characters rest and the reading speaks English alone.
 */
export class ReadingGloss {
  private seen = new Set<string>();
  private readonly plain: boolean;
  constructor(plain = false) {
    this.plain = plain;
  }
  mark(hanzi: string, english: string): string {
    if (this.plain || this.seen.has(hanzi)) return english;
    this.seen.add(hanzi);
    return `${english} （${hanzi}）`;
  }
}

/** Declarative census lines, heaviest first. Honest: no verdicts, only weight. */
export function censusLines(p: FourPillars, gloss: ReadingGloss = new ReadingGloss()): string[] {
  const census = phaseCensus(p);
  const entries = (Object.entries(census) as [Phase, number][]).sort((a, b) => b[1] - a[1]);
  const lines: string[] = [];
  const [topPhase, topCount] = entries[0];
  const [lowPhase, lowCount] = entries[entries.length - 1];
  const top = PHASES[topPhase];
  lines.push(
    `${gloss.mark(top.hanzi, top.english)} stands heaviest in this chart, present ${topCount} ${
      topCount === 1 ? "time" : "times"
    } among the eight characters.`
  );
  if (lowCount === 0) {
    const low = PHASES[lowPhase];
    lines.push(
      `${gloss.mark(low.hanzi, low.english)} does not appear at all among the eight. The tradition does not call this a lack to be mourned. It calls it a room the life furnishes by choice, through the phases it walks toward in the decades and the company it keeps.`
    );
  } else if (lowCount === 1 && lowPhase !== topPhase) {
    const low = PHASES[lowPhase];
    lines.push(`${gloss.mark(low.hanzi, low.english)} appears but once, a single note the other seven lean upon.`);
  }
  const spread = entries.filter(([, n]) => n > 0).length;
  if (spread === 5) {
    lines.push("All five phases are present. The tradition reads a full census as a house with every tool somewhere upon its walls, and asks which tool the hand reaches for first.");
  }
  return lines;
}

/**
 * The season of one's strength: the month branch, the month's decree （月令）,
 * weighs most in the tradition's judgement of whether the Day Master stands supported.
 */
export function seasonLines(p: FourPillars, gloss: ReadingGloss = new ReadingGloss()): string[] {
  const dm = dayMasterOf(p);
  const month = BRANCHES[p.monthBranch];
  const decree = () => gloss.mark("月令", "the month's decree");
  const ph = (phase: Phase) => gloss.mark(PHASES[phase].hanzi, PHASES[phase].english.toLowerCase());
  const lines: string[] = [];
  lines.push(
    `The Day Master is ${gloss.mark(dm.hanzi, dm.english)}, ${dm.yinyang} ${PHASES[dm.phase].english.toLowerCase()}: ${dm.quality}.`
  );
  if (month.phase === dm.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, the month of ${ph(month.phase)}, the Day Master stands in its own season. The tradition calls this command of ${decree()}, and reads the self as rooted, drawing strength from the ground it was planted in.`
    );
  } else if (PHASES[month.phase].generates === dm.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the season feeds ${ph(dm.phase)} directly, for ${ph(month.phase)} generates ${ph(dm.phase)}. The tradition reads this as a Day Master nourished at the root, supported before it has done anything at all.`
    );
  } else if (PHASES[dm.phase].generates === month.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the Day Master pours into the season, for ${ph(dm.phase)} generates ${ph(month.phase)}. The tradition reads this as a self that spends its strength upon its time, expressive by necessity, and counsels that such a chart rests where it can.`
    );
  } else if (PHASES[month.phase].overcomes === dm.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the season presses upon the Day Master, for ${ph(month.phase)} overcomes ${ph(dm.phase)}. The tradition does not call this misfortune. It calls it a forge, and reads the self as shaped early by weight it did not choose.`
    );
  } else {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the Day Master masters its season, for ${ph(dm.phase)} overcomes ${ph(month.phase)}. The tradition reads this as a self set against its time from the first breath, which spends a life turning resistance into livelihood.`
    );
  }
  return lines;
}

/** The gods that gather around the Day Master, pillar by pillar. */
export function godLines(p: FourPillars, gloss: ReadingGloss = new ReadingGloss()): string[] {
  const views = pillarViews(p);
  const lines: string[] = [];
  for (const v of views) {
    if (!v.god) continue;
    lines.push(
      `Above the ${gloss.mark(v.hanzi, v.english.toLowerCase())} sits ${gloss.mark(v.god.hanzi, v.god.english)}, ${v.god.reading}. Its ground is ${v.domain}.`
    );
  }
  const keys = views.filter((v) => v.god).map((v) => v.god!.key);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dup.length > 0) {
    const first = views.find((v) => v.god && v.god.key === dup[0])!;
    lines.push(
      `${gloss.mark(first.god!.hanzi, first.god!.english)} appears more than once among the pillars. A repeated god speaks twice in a life. The tradition listens for where, not whether, it will be heard.`
    );
  }
  return lines;
}

/** Pillar-by-pillar reading, each grounded in its traditional domain. */
export function domainLines(p: FourPillars, gloss: ReadingGloss = new ReadingGloss()): string[] {
  return pillarViews(p).map((v) => {
    const branchNote = `beneath it the ${gloss.mark(v.branch.animalHanzi, v.branch.animal)}, ${gloss.mark(v.branch.hanzi, v.branch.english)}, ${v.branch.quality}`;
    if (v.key === "day") {
      return `The ${gloss.mark(v.hanzi, v.english.toLowerCase())} holds the self: ${gloss.mark(v.stem.hanzi, v.stem.english)} above, and ${branchNote}. This pillar also holds the spouse's palace. The tradition reads the branch beneath the self as the ground one's closest companion stands upon.`;
    }
    return `The ${gloss.mark(v.hanzi, v.english.toLowerCase())} carries ${gloss.mark(v.stem.hanzi, v.stem.english)} above, ${v.stem.quality}, and ${branchNote}. Its ground is ${v.domain}.`;
  });
}

export function animalOf(branchIndex: number) {
  return BRANCHES[branchIndex].animal;
}

export function phaseLabel(phase: Phase) {
  return `${PHASES[phase].english} （${PHASES[phase].hanzi}）`;
}

export { cap };
