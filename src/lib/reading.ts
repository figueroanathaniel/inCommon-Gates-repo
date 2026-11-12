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
  god: { key: string; hanzi: string; pinyin: string; english: string; reading: string; readingZh: string } | null;
  domainZh: string;
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
      domainZh: label.domainZh,
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
 * The English reading names every sign by its English name alone. The
 * Chinese reading, below, names it by its character alone. The two are
 * never mixed on one page.
 */
export class ReadingGloss {
  mark(_hanzi: string, english: string): string {
    return english;
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
    `${gloss.mark(top.hanzi, top.english)} is the heaviest phase in this chart. It appears ${topCount} ${
      topCount === 1 ? "time" : "times"
    } among the eight characters.`
  );
  if (lowCount === 0) {
    const low = PHASES[lowPhase];
    lines.push(
      `${gloss.mark(low.hanzi, low.english)} does not appear among the eight at all. It is a room the life furnishes for itself, with the phases it walks toward in the decades and the company it keeps.`
    );
  } else if (lowCount === 1 && lowPhase !== topPhase) {
    const low = PHASES[lowPhase];
    lines.push(`${gloss.mark(low.hanzi, low.english)} appears only once, and the other seven lean on that single note.`);
  }
  const spread = entries.filter(([, n]) => n > 0).length;
  if (spread === 5) {
    lines.push("All five phases are present. It is a house with every tool hanging somewhere on its walls, and the question is which one the hand reaches for first.");
  }
  return lines;
}

/**
 * The season of one's strength: the month branch, the month's decree,
 * weighs most in the tradition's judgement of whether the Day Master stands supported.
 */
export function seasonLines(p: FourPillars, gloss: ReadingGloss = new ReadingGloss()): string[] {
  const dm = dayMasterOf(p);
  const month = BRANCHES[p.monthBranch];
  const decree = () => gloss.mark("月令", "the month's decree");
  const ph = (phase: Phase) => gloss.mark(PHASES[phase].hanzi, PHASES[phase].english.toLowerCase());
  const lines: string[] = [];
  lines.push(
    `The Day Master is ${gloss.mark(dm.hanzi, dm.english)}, which is ${dm.yinyang} ${PHASES[dm.phase].english.toLowerCase()}. It is ${dm.quality}.`
  );
  if (month.phase === dm.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, the month of ${ph(month.phase)}, the Day Master stands in its own season. This is called command of ${decree()}. The self is read as rooted, and as drawing strength from the ground it was planted in.`
    );
  } else if (PHASES[month.phase].generates === dm.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the Day Master is fed by its season, because ${ph(month.phase)} generates ${ph(dm.phase)}. This is a self nourished at the root and supported before it has done anything at all.`
    );
  } else if (PHASES[dm.phase].generates === month.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the Day Master pours itself into the season, because ${ph(dm.phase)} generates ${ph(month.phase)}. This is a self that spends its strength on its time and has to express itself. The counsel for such a chart is to rest where it can.`
    );
  } else if (PHASES[month.phase].overcomes === dm.phase) {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the Day Master is pressed by its season, because ${ph(month.phase)} overcomes ${ph(dm.phase)}. This is called a forge. The self is read as shaped early by a weight it did not choose.`
    );
  } else {
    lines.push(
      `Born in ${gloss.mark(month.hanzi, month.english)}, a month of ${ph(month.phase)}, the Day Master masters its season, because ${ph(dm.phase)} overcomes ${ph(month.phase)}. This is a self set against its time from the first breath, and as a life spent turning resistance into a living.`
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
      `${gloss.mark(first.god!.hanzi, first.god!.english)} appears more than once among the pillars. A god that repeats speaks twice in a life, and the reading listens for where it will be heard.`
    );
  }
  return lines;
}

/** Pillar-by-pillar reading, each grounded in its traditional domain. */
export function domainLines(p: FourPillars, gloss: ReadingGloss = new ReadingGloss()): string[] {
  return pillarViews(p).map((v) => {
    const branchNote = `eneath it is the ${gloss.mark(v.branch.animalHanzi, v.branch.animal)}, ${gloss.mark(v.branch.hanzi, v.branch.english)}, ${v.branch.quality}`;
    if (v.key === "day") {
      return `The ${gloss.mark(v.hanzi, v.english.toLowerCase())} holds the self. ${gloss.mark(v.stem.hanzi, v.stem.english)} stands above, and b${branchNote}. This pillar is also the spouse's palace. The branch under the self is read as the ground one's closest companion stands on.`;
    }
    return `The ${gloss.mark(v.hanzi, v.english.toLowerCase())} carries ${gloss.mark(v.stem.hanzi, v.stem.english)} above, ${v.stem.quality}. B${branchNote}. Its ground is ${v.domain}.`;
  });
}

/* 中文的讀法：同一份讀盤，以繁體中文寫成，只用漢字名。 */

const NUM_ZH = ["零", "一", "二", "三", "四", "五", "六", "七", "八"];
const YY_ZH = { yin: "陰", yang: "陽" } as const;
const ZH_PILLAR = PILLAR_LABELS.reduce<Record<string, string>>((a, l) => ((a[l.key] = l.domainZh), a), {});

export function censusLinesZh(p: FourPillars): string[] {
  const census = phaseCensus(p);
  const entries = (Object.entries(census) as [Phase, number][]).sort((a, b) => b[1] - a[1]);
  const lines: string[] = [];
  const [topPhase, topCount] = entries[0];
  const [lowPhase, lowCount] = entries[entries.length - 1];
  lines.push(`此命${PHASES[topPhase].hanzi}最重，八字之中見${NUM_ZH[topCount]}次。`);
  if (lowCount === 0) {
    lines.push(
      `八字之中全不見${PHASES[lowPhase].hanzi}。傳統視之為一間由一生自行布置的空室，在所行的大運之中，在所交的人之間。`
    );
  } else if (lowCount === 1 && lowPhase !== topPhase) {
    lines.push(`${PHASES[lowPhase].hanzi}僅見一次，是其餘七字所倚的一個音。`);
  }
  if (entries.filter(([, n]) => n > 0).length === 5) {
    lines.push("五行俱全。傳統視之如一屋四壁各掛器具，而問手先伸向哪一件。");
  }
  return lines;
}

export function seasonLinesZh(p: FourPillars): string[] {
  const dm = dayMasterOf(p);
  const month = BRANCHES[p.monthBranch];
  const m = PHASES[month.phase].hanzi;
  const d = PHASES[dm.phase].hanzi;
  const lines = [`日主為${dm.hanzi}，${YY_ZH[dm.yinyang]}${d}：${dm.qualityZh}。`];
  const born = `生於${month.hanzi}月，${m}之月，`;
  if (month.phase === dm.phase) {
    lines.push(`${born}日主立於本季。傳統稱之為得月令，視自身有根，得力於所植之地。`);
  } else if (PHASES[month.phase].generates === dm.phase) {
    lines.push(`${born}季令直生其${d}，因${m}生${d}。傳統視之為日主根受滋養，未作一事，已得扶持。`);
  } else if (PHASES[dm.phase].generates === month.phase) {
    lines.push(`${born}日主泄氣於季令，因${d}生${m}。傳統視之為以己力奉其時，不得不發露，並勸此命隨處可息則息。`);
  } else if (PHASES[month.phase].overcomes === dm.phase) {
    lines.push(`${born}季令壓於日主，因${m}剋${d}。傳統稱之為爐，視自身早為未曾選擇之重量所鍛。`);
  } else {
    lines.push(`${born}日主制其季令，因${d}剋${m}。傳統視之為自初生即與其時相抗，一生化阻力為生計。`);
  }
  return lines;
}

export function godLinesZh(p: FourPillars): string[] {
  const views = pillarViews(p);
  const lines: string[] = [];
  for (const v of views) {
    if (!v.god) continue;
    lines.push(`${v.hanzi}之上坐${v.god.hanzi}，${v.god.readingZh}。其所主為${ZH_PILLAR[v.key]}。`);
  }
  const keys = views.filter((v) => v.god).map((v) => v.god!.key);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dup.length > 0) {
    const first = views.find((v) => v.god && v.god.key === dup[0])!;
    lines.push(`${first.god!.hanzi}於四柱之中重見。神重見，則一生之中兩度發聲，傳統留意其聲落於何處。`);
  }
  return lines;
}

export function domainLinesZh(p: FourPillars): string[] {
  return pillarViews(p).map((v) => {
    const below = `下為${v.branch.hanzi}，屬${v.branch.animalHanzi}，${v.branch.qualityZh}`;
    if (v.key === "day") {
      return `${v.hanzi}主自身：上為${v.stem.hanzi}，${below}。此柱亦為配偶之宮，傳統視自身之下的地支為至親之人所立之地。`;
    }
    return `${v.hanzi}上承${v.stem.hanzi}，${v.stem.qualityZh}；${below}。其所主為${ZH_PILLAR[v.key]}。`;
  });
}

export function animalOf(branchIndex: number) {
  return BRANCHES[branchIndex].animal;
}

export function phaseLabel(phase: Phase) {
  return PHASES[phase].english;
}

export { cap };
