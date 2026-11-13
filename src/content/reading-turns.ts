/**
 * The Destiny Chart's reading, said a different way each time it is opened.
 *
 * Every phrase that used to repeat word for word is a small tree, in the
 * shape the owner asked for on 13 November 2026: the phrase gets three
 * variations of its opening (a), each of those four of its middle (b), each
 * of those three of its close (c), and each close is written twice, once in
 * a Yang voice and once in a Yin voice. That is 3 x 4 x 3 x 2 = 72 ways to
 * say each phrase. Variation 0 of a and b is the wording that shipped before.
 *
 * The facts never move between variations: the sign, the phase, the count,
 * the relation, the tradition's name for it and the ground are in every leaf.
 * Only the saying changes. The Yang voice is direct and powerful; the Yin
 * voice is receptive and empowering. Which one speaks is decided by the
 * chart: the Day Master's polarity, or the stem of the pillar being read.
 *
 * Nothing here foretells. No line promises an event.
 */

export type YinYang = "yin" | "yang";
type Seg<C> = (c: C) => string;
export interface Tree<C> {
  a: [Seg<C>, Seg<C>, Seg<C>];
  b: [Seg<C>, Seg<C>, Seg<C>, Seg<C>];
  c: [{ yang: Seg<C>; yin: Seg<C> }, { yang: Seg<C>; yin: Seg<C> }, { yang: Seg<C>; yin: Seg<C> }];
}

/** Turns before any one phrase repeats for a chart of one polarity. */
export const TURN_CYCLE = 36;

/**
 * Pick one leaf. `turn` moves once per reading opened; `salt` keeps two
 * lines of one kind in the same reading (the three god lines, the three
 * pillar lines) on different branches. Every turn changes a, b and c at
 * once, and all 36 leaves of a polarity come before any repeats.
 */
export function say<C>(t: Tree<C>, ctx: C, yy: YinYang, turn = 0, salt = 0): string {
  const i = turn + salt;
  const a = t.a[((i % 3) + 3) % 3];
  const b = t.b[((i % 4) + 4) % 4];
  const c = t.c[(((i + Math.floor(turn / 12)) % 3) + 3) % 3][yy];
  return `${a(ctx)} ${b(ctx)} ${c(ctx)}`;
}

/** Every leaf of a tree, for tests and the review file. */
export function leaves<C>(t: Tree<C>, ctx: C): string[] {
  const out: string[] = [];
  for (const a of t.a) for (const b of t.b) for (const c of t.c) for (const yy of ["yang", "yin"] as const) {
    out.push(`${a(ctx)} ${b(ctx)} ${c[yy](ctx)}`);
  }
  return out;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WORD = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight"];
const times = (n: number) => (n === 1 ? "time" : "times");

/* The census. */

export const HEAVY: Tree<{ P: string; n: number }> = {
  a: [
    ({ P }) => `${P} is the heaviest phase in this chart.`,
    ({ P }) => `Of the five phases, ${P.toLowerCase()} carries the most weight here.`,
    ({ P }) => `${P} leads the census of this chart.`,
  ],
  b: [
    ({ n }) => `It appears ${n} ${times(n)} among the eight characters.`,
    ({ n }) => `It is written ${n} ${times(n)} across the eight characters.`,
    ({ P, n }) => `Count the eight characters and ${P.toLowerCase()} answers ${n} ${times(n)}.`,
    ({ n }) => (n >= 8 ? "All eight characters belong to it." : `${cap(WORD[n])} of the eight characters belong to it.`),
  ],
  c: [
    {
      yang: () => "Where a phase gathers, the chart speaks in its accent, and that voice is there to be used in full.",
      yin: () => "Where a phase gathers, the chart speaks in its accent, and that voice is already there to lean on.",
    },
    {
      yang: () => "Weight is where a chart is strongest, and strength asks to be put to work.",
      yin: () => "Weight is where a chart is strongest, and strength like this can be rested on as much as worked.",
    },
    {
      yang: () => "A heavy phase colours the rest the way a season colours a field, and the field is ready to be worked.",
      yin: () => "A heavy phase colours the rest the way a season colours a field, and what grows there grows in that light.",
    },
  ],
};

export const ABSENT: Tree<{ L: string }> = {
  a: [
    ({ L }) => `${L} does not appear among the eight at all.`,
    ({ L }) => `None of the eight characters belongs to ${L.toLowerCase()}.`,
    ({ L }) => `${L} is missing from the eight characters.`,
  ],
  b: [
    () => "It is a room the life furnishes for itself, with the phases it walks toward in the decades and the company it keeps.",
    () => "What the birth left out, the decades and the people along the way can bring in.",
    () => "The tradition reads an absent phase as something met from outside, in the luck pillars and in the company one keeps.",
    () => "Its place is filled from outside, by the decades a life walks through and by those who walk beside it.",
  ],
  c: [
    {
      yang: () => "A missing phase is room to build in, and the building can be chosen.",
      yin: () => "A missing phase is a space kept open, and what is welcomed into it can settle there.",
    },
    {
      yang: () => "What is sought on purpose is often held more firmly than what was handed over.",
      yin: () => "What arrives through others can be taken in and kept as one's own.",
    },
    {
      yang: () => "The search for it can be made deliberately, and made boldly.",
      yin: () => "It can also be let in slowly, by the people and the seasons that carry it.",
    },
  ],
};

export const ONCE: Tree<{ L: string }> = {
  a: [
    ({ L }) => `${L} appears only once.`,
    ({ L }) => `${L} is written a single time among the eight.`,
    ({ L }) => `Only one of the eight characters belongs to ${L.toLowerCase()}.`,
  ],
  b: [
    () => "The other seven lean on that single note.",
    () => "One character holds the whole of it for the chart.",
    ({ L }) => `A single note carries ${L.toLowerCase()} for all eight.`,
    ({ L }) => `What ${L.toLowerCase()} brings, this chart keeps in one place.`,
  ],
  c: [
    {
      yang: () => "A single note rings clearest when it is struck with intent.",
      yin: () => "A single note is easy to protect, and worth protecting.",
    },
    {
      yang: () => "Where a thing is scarce, each use of it counts double.",
      yin: () => "Scarcity makes a thing precious, and precious things are kept with care.",
    },
    {
      yang: () => "Relied on knowingly, it can hold its line.",
      yin: () => "Tended, it can carry more than its size suggests.",
    },
  ],
};

export const ALL_FIVE: Tree<Record<string, never>> = {
  a: [
    () => "All five phases are present.",
    () => "Every one of the five phases is written somewhere in this chart.",
    () => "No phase is missing from the eight characters.",
  ],
  b: [
    () => "It is a house with every tool hanging somewhere on its walls.",
    () => "Nothing the round of generation needs is absent from it.",
    () => "Wood, Fire, Earth, Metal and Water each have a place to stand.",
    () => "The round of generating and overcoming can turn here without a gap.",
  ],
  c: [
    {
      yang: () => "The question is which tool the hand reaches for first, and the hand can choose.",
      yin: () => "The question is which tool the hand reaches for first, and there is time to learn the weight of each.",
    },
    {
      yang: () => "Range like this is a strength when it is aimed.",
      yin: () => "Range like this lets a life meet many seasons with something already in hand.",
    },
    {
      yang: () => "Balance is a ground to act from.",
      yin: () => "Balance is a ground to rest on, and to return to.",
    },
  ],
};

/* The self and its season. */

export const DAY_MASTER: Tree<{ dm: string; yy: string; p: string; q: string }> = {
  a: [
    ({ dm, yy, p }) => `The Day Master is ${dm}, which is ${yy} ${p}.`,
    ({ dm, yy, p }) => `The self in this chart is ${dm}, ${yy} ${p}.`,
    ({ dm, yy, p }) => `At the centre of the chart stands ${dm}, the ${yy} face of ${p}.`,
  ],
  b: [
    ({ q }) => `It is ${q}.`,
    ({ q }) => `Its image is ${q}.`,
    ({ q }) => `The tradition draws it as ${q}.`,
    ({ q }) => `Picture ${q}.`,
  ],
  c: [
    {
      yang: () => "Every other character is weighed against this one, and this one is where the reading takes its stand.",
      yin: () => "Every other character is weighed against this one, and this one is where the reading comes home.",
    },
    {
      yang: () => "The rest of the chart is what this self meets and moves.",
      yin: () => "The rest of the chart is what this self meets, holds and grows with.",
    },
    {
      yang: () => "Its nature is its first instrument.",
      yin: () => "Its nature is its first shelter and its first gift.",
    },
  ],
};

type SeasonCtx = { m: string; mph: string; dph: string; decree: string };

export const SEASON: Record<"same" | "fed" | "pours" | "pressed" | "masters", Tree<SeasonCtx>> = {
  same: {
    a: [
      ({ m, mph }) => `Born in ${m}, the month of ${mph}, the Day Master stands in its own season.`,
      ({ m, mph }) => `The month branch is ${m}, a month of ${mph}, the Day Master's own phase.`,
      ({ m, mph }) => `${m} gives this chart its month, and its phase is ${mph}, the same as the Day Master's.`,
    ],
    b: [
      ({ decree }) => `This is called command of ${decree}. The self is read as rooted, and as drawing strength from the ground it was planted in.`,
      ({ decree }) => `The tradition calls this command of ${decree}, and reads the self as rooted in its own ground.`,
      ({ decree }) => `To be born in one's own season is called command of ${decree}. The self draws on the very ground it stands in.`,
      ({ decree }) => `This is command of ${decree}, the fullest support a season gives, and the self is read as well rooted.`,
    ],
    c: [
      { yang: () => "A rooted self can afford to push.", yin: () => "A rooted self can afford to be still." },
      { yang: () => "Strength at the root is strength to spend.", yin: () => "Strength at the root is strength to share." },
      { yang: () => "Stand on that ground and move.", yin: () => "That ground is there to be trusted." },
    ],
  },
  fed: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, the Day Master is fed by its season, because ${mph} generates ${dph}.`,
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and since ${mph} generates ${dph}, the season feeds the Day Master.`,
      ({ m, mph, dph }) => `${cap(mph)} rules the month of ${m}, and ${mph} generates ${dph}, so the Day Master is fed by its season.`,
    ],
    b: [
      () => "This is a self nourished at the root and supported before it has done anything at all.",
      () => "The tradition reads it as a self supported at the root from the start.",
      () => "Such a self is nourished by its time before it lifts a hand.",
      () => "The season gives first, and the self receives before anything is asked of it.",
    ],
    c: [
      {
        yang: () => "Support like this is fuel, and fuel is for burning toward something.",
        yin: () => "Support like this can be received without proving anything first.",
      },
      { yang: () => "What was given freely can be put to bold use.", yin: () => "What was given freely can simply be accepted." },
      { yang: () => "Build on that support, and build high.", yin: () => "Let that support be felt, and let it steady the rest." },
    ],
  },
  pours: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, the Day Master pours itself into the season, because ${dph} generates ${mph}.`,
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and since ${dph} generates ${mph}, the Day Master gives itself to its season.`,
      ({ m, mph, dph }) => `${cap(dph)} generates ${mph}, and ${mph} rules the month of ${m}, so the Day Master spends itself on its season.`,
    ],
    b: [
      () => "This is a self that spends its strength on its time and has to express itself. The counsel for such a chart is to rest where it can.",
      () => "The tradition reads a self that must express itself, and counsels rest wherever rest is offered.",
      () => "Such a self gives outward by nature, and the counsel is to rest where it can.",
      () => "Its strength runs outward into what it makes, and rest is the counsel that keeps it whole.",
    ],
    c: [
      {
        yang: () => "Giving is its power, so the choice of where it goes matters.",
        yin: () => "Giving is its gift, and some of it may be kept for itself.",
      },
      {
        yang: () => "Expression is the work, and the work deserves its full force.",
        yin: () => "Expression is the work, and rest is part of the work.",
      },
      { yang: () => "Let it pour with aim.", yin: () => "Let it pour, and let it be refilled." },
    ],
  },
  pressed: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, the Day Master is pressed by its season, because ${mph} overcomes ${dph}.`,
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and since ${mph} overcomes ${dph}, the season presses on the Day Master.`,
      ({ m, mph, dph }) => `${cap(mph)} rules the month of ${m}, and ${mph} overcomes ${dph}, so the Day Master meets its season under pressure.`,
    ],
    b: [
      () => "This is called a forge. The self is read as shaped early by a weight it did not choose.",
      () => "The tradition calls this a forge, where the self is shaped early by a weight it did not choose.",
      () => "Such a season is called a forge, and the self learns its shape under a weight it did not pick.",
      () => "This is a forge. What presses on the self early also gives it its edge.",
    ],
    c: [
      { yang: () => "Pressure met squarely becomes temper.", yin: () => "Pressure that was not chosen need not be carried alone." },
      { yang: () => "What was forged can now cut.", yin: () => "What was forged can now rest in its shape." },
      {
        yang: () => "That weight built the strength now in the hand.",
        yin: () => "That weight was never the self's doing, and what it shaped is steady.",
      },
    ],
  },
  masters: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, the Day Master masters its season, because ${dph} overcomes ${mph}.`,
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and since ${dph} overcomes ${mph}, the Day Master holds the upper hand over its season.`,
      ({ m, mph, dph }) => `${cap(dph)} overcomes ${mph}, and ${mph} rules the month of ${m}, so the Day Master works against its season and masters it.`,
    ],
    b: [
      () => "This is a self set against its time from the first breath, a life read as turning resistance into a living.",
      () => "The tradition reads a self at odds with its time from the start, one that makes a living out of resistance.",
      () => "Such a self works its season like a field, turning what resists it into what sustains it.",
      () => "From the first breath this self is set against its time, and its work is turning that friction into a living.",
    ],
    c: [
      { yang: () => "Friction is where its force shows.", yin: () => "Friction is tiring, and pauses are earned." },
      { yang: () => "It was made to take hold of its time.", yin: () => "It can take hold of its time a little at a time." },
      { yang: () => "Resistance is its material.", yin: () => "Resistance is its material, and patience is its tool." },
    ],
  },
};

/* The court. */

export const GOD: Tree<{ pl: string; G: string; reading: string; domain: string }> = {
  a: [
    ({ pl, G, reading }) => `Above the ${pl} sits ${G}, ${reading}.`,
    ({ pl, G, reading }) => `${G} stands over the ${pl}, ${reading}.`,
    ({ pl, G, reading }) => `To the Day Master, the stem of the ${pl} is ${G}, ${reading}.`,
  ],
  b: [
    ({ domain }) => `Its ground is ${domain}.`,
    ({ domain }) => `It speaks in the ground of ${domain}.`,
    ({ domain }) => `Its work is done in ${domain}.`,
    ({ domain }) => `Look for it in ${domain}.`,
  ],
  c: [
    {
      yang: () => "Its stem is yang, so it shows its hand openly.",
      yin: () => "Its stem is yin, so it works quietly, from within.",
    },
    {
      yang: () => "Being yang, it moves outward and is easy to see at work.",
      yin: () => "Being yin, it gathers inward and is felt before it is seen.",
    },
    {
      yang: () => "A yang stem puts its strength out front.",
      yin: () => "A yin stem keeps its strength close and gives it with care.",
    },
  ],
};

export const GOD_TWICE: Tree<{ G: string }> = {
  a: [
    ({ G }) => `${G} appears more than once among the pillars.`,
    ({ G }) => `${G} is written in more than one pillar.`,
    ({ G }) => `The court holds ${G} more than once.`,
  ],
  b: [
    () => "A god that repeats speaks twice in a life, and the reading listens for where it will be heard.",
    () => "A relation that repeats is a theme, and the reading follows it through each ground it touches.",
    () => "What the chart says twice, it means to be heard.",
    () => "Repetition gives a relation weight across more than one part of a life.",
  ],
  c: [
    { yang: () => "Name the theme and work with it.", yin: () => "Notice the theme, and let it teach at its own pace." },
    { yang: () => "A theme can become a craft.", yin: () => "A theme can become a companion." },
    { yang: () => "Where it sounds again, answer it.", yin: () => "Where it sounds again, listen." },
  ],
};

/* The pillars in their grounds. */

type GroundCtx = { pl: string; S: string; sq: string; A: string; B: string; bq: string; domain: string };

export const GROUND: Tree<GroundCtx> = {
  a: [
    ({ pl, S, sq }) => `The ${pl} carries ${S} above, ${sq}.`,
    ({ pl, S, sq }) => `${S} crowns the ${pl}, ${sq}.`,
    ({ pl, S, sq }) => `At the top of the ${pl} stands ${S}, ${sq}.`,
  ],
  b: [
    ({ A, B, bq, domain }) => `Beneath it is the ${A}, ${B}, ${bq}. Its ground is ${domain}.`,
    ({ A, B, bq, domain }) => `Below lies ${B}, the ${A}, ${bq}. This pillar speaks for ${domain}.`,
    ({ A, B, bq, domain }) => `Its root is the ${A}, ${B}, ${bq}, and its ground is ${domain}.`,
    ({ A, B, bq, domain }) => `Under it waits ${B}, the ${A}, ${bq}. The pillar keeps watch over ${domain}.`,
  ],
  c: [
    { yang: () => "This is a ground to act in.", yin: () => "This is a ground to grow in." },
    {
      yang: () => "What happens here takes the shape of the hand that reaches in.",
      yin: () => "What happens here takes the shape of the care given to it over time.",
    },
    { yang: () => "Here the life builds outward.", yin: () => "Here the life roots inward." },
  ],
};

export const DAY_GROUND: Tree<GroundCtx> = {
  a: [
    ({ pl, S }) => `The ${pl} holds the self, with ${S} standing above.`,
    ({ pl, S }) => `The self lives in the ${pl}, and ${S} is its stem.`,
    ({ pl, S }) => `${S} stands at the top of the ${pl}, the pillar of the self.`,
  ],
  b: [
    ({ A, B, bq }) => `Beneath it is the ${A}, ${B}, ${bq}. This pillar is also the spouse's palace. The branch under the self is read as the ground one's closest companion stands on.`,
    ({ A, B, bq }) => `Its branch is ${B}, the ${A}, ${bq}. The tradition calls this branch the spouse's palace, the ground where one's closest companion stands.`,
    ({ A, B, bq }) => `Under the self lies the ${A}, ${B}, ${bq}. This seat is also the spouse's palace, read as the ground shared with the nearest companion.`,
    ({ A, B, bq }) => `Below the Day Master is ${B}, the ${A}, ${bq}. Here is the spouse's palace, the ground on which one's closest companion is read.`,
  ],
  c: [
    {
      yang: () => "Closeness here is something the self can choose and claim.",
      yin: () => "Closeness here is something the self can welcome and tend.",
    },
    {
      yang: () => "This is the nearest ground in the chart, and it can be built on with intent.",
      yin: () => "This is the nearest ground in the chart, and it can be kept open enough to share.",
    },
    {
      yang: () => "The self meets its companion here as one strength meets another.",
      yin: () => "The self meets its companion here as one root meets another under the same soil.",
    },
  ],
};

/* The frame of the reading and of the room. */

export const READ_FROM: Tree<{ dm: string }> = {
  a: [
    ({ dm }) => `The Day Master is ${dm}.`,
    ({ dm }) => `${dm} is the Day Master here.`,
    ({ dm }) => `This chart is read from ${dm}, its Day Master.`,
  ],
  b: [
    () => "Everything after this is said in relation to it.",
    () => "Every line that follows is measured from it.",
    () => "The rest of the reading turns around it.",
    () => "What follows is heard from where it stands.",
  ],
  c: [
    { yang: () => "Begin from there.", yin: () => "Rest there first." },
    { yang: () => "Hold that centre.", yin: () => "That centre is steady enough to lean on." },
    { yang: () => "It is the place to stand.", yin: () => "It is the place to return to." },
  ],
};

export const RESTS: Tree<Record<string, never>> = {
  a: [
    () => "Here the reading rests.",
    () => "The reading stops here.",
    () => "This is where the reading sets down its brush.",
  ],
  b: [
    () => "The ground is named, the season is named and the court is named.",
    () => "The pillars have their grounds, the self has its season and the gods have their places.",
    () => "Ground, season and court have each been given their names.",
    () => "Everything the tradition can name has been named.",
  ],
  c: [
    {
      yang: () => "What a life makes of them belongs to the life, and the making is its own.",
      yin: () => "What a life makes of them belongs to the life, in its own time.",
    },
    {
      yang: () => "The rest is lived, and so it is left unwritten.",
      yin: () => "The rest is unwritten, and it is the life's to write.",
    },
    { yang: () => "From here the life takes the brush.", yin: () => "From here the brush passes gently to the life." },
  ],
};

export const STONE_INTRO: Tree<Record<string, never>> = {
  a: [
    () => "One true chart, set at the centre of the house.",
    () => "This is the house's true chart, kept at its centre.",
    () => "At the centre of the house lies one true chart.",
  ],
  b: [
    () => "It is the same life read in every script the hall keeps, and in the end the scripts become one reading.",
    () => "Every scroll in the hall reads the same life here, until the scrolls become one reading.",
    () => "Each script the hall keeps is read against it, and the scripts meet in one reading.",
    () => "All the hall's scripts point at this one life, and here they are read as one.",
  ],
  c: [
    {
      yang: () => "Come back to it whenever there is something to ask.",
      yin: () => "Come back to it whenever there is something to sit with.",
    },
    { yang: () => "Each return reads it from a new angle.", yin: () => "Each return finds it in a new light." },
    { yang: () => "It is the place to start, and the place to come back to.", yin: () => "It is a place to rest the eye, and to come back to." },
  ],
};

/** The room's opening lines, a and b only, for the moment before the chart is known. */
export function sayOpening<C>(t: Tree<C>, ctx: C, turn = 0): string {
  const i = turn;
  return `${t.a[i % 3](ctx)} ${t.b[i % 4](ctx)}`;
}
