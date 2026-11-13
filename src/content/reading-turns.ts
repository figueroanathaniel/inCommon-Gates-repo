/**
 * The Destiny Chart's reading, said a different way each time it is opened.
 *
 * Every phrase that used to repeat word for word is a small tree, in the
 * shape the owner asked for on 13 November 2026: the phrase gets three
 * variations of its opening (a), each of those four of its middle (b), each
 * of those three of its close (c), and each close is written twice, once in
 * a Yang voice and once in a Yin voice. That is 3 x 4 x 3 x 2 = 72 ways to
 * say each phrase. Variation 0 of a and b opens closest to the wording that shipped first.
 *
 * The facts never move between variations: the sign, the phase, the count,
 * the relation, the tradition's name for it and the ground are in every leaf.
 * Only the saying changes. The Yang voice is direct and powerful; the Yin
 * voice is receptive and empowering. Which one speaks is decided by the
 * chart, by the Day Master's yin or yang, or the stem of the pillar being read.
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

/** Turns before any one phrase repeats for a chart of one voice. */
export const TURN_CYCLE = 36;

/**
 * Pick one leaf. `turn` moves once per reading opened; `salt` keeps two
 * lines of one kind in the same reading (the three god lines, the three
 * pillar lines) on different branches. Every turn changes a, b and c at
 * once, and all 36 leaves of one voice come before any repeats.
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

/* What each phase is, said for a chart heavy in it, without it, or holding it once. */

type PhaseKey = "wood" | "fire" | "earth" | "metal" | "water";
export const LORE: Record<PhaseKey, { heavy: string[]; absent: string[]; once: string[] }> = {
  wood: {
    heavy: [
      "Wood is spring in the old reckoning, the green push from root toward light, and its virtue is benevolence. Where it gathers, a life leans toward growing, beginning and making room for whatever is still becoming.",
      "The tradition hears wood as the east wind at dawn and the sap rising in the stem. A chart full of it is drawn to reach, to branch out and to keep living things in view.",
      "Wood bends and returns, and it grows toward what it needs. So much of it gives a life the patience of a tree and its stubborn hunger for height.",
      "In wood the year is young and everything is still possible. A chart weighted with it carries that youth a long way, the urge to start, to shelter and to grow.",
    ],
    absent: [
      "Wood is the spring of things, the push to begin and the benevolence that makes room for others to grow. A chart without it often finds that green urge in the people and the years around it.",
      "Without wood, the chart has no east wind of its own, no sap rising in early spring. Beginnings may be borrowed from a friend, a teacher or a decade that carries them.",
      "Wood is what grows toward light and keeps reaching. Where it is absent, the reaching is learned, and a life that learns it often grows with real care.",
      "The tradition sets benevolence beside wood, the kindness that lets living things flourish. A chart that lacks the phase may come to that kindness by walking toward it.",
    ],
    once: [
      "That one character carries all of the chart's spring, its will to begin and its kindness toward what is growing.",
      "A single green shoot holds the whole of wood here, so every new start draws on the same small root.",
      "Wood is reaching and renewal, and here it lives in one place. That place becomes the chart's doorway to beginnings.",
      "Benevolence, the virtue of wood, rests on one character in this chart, and it is the more precious for being alone.",
    ],
  },
  fire: {
    heavy: [
      "Fire is summer in the old reckoning, the noon of the year, and its virtue is propriety, the grace of giving each thing its place in the light. Where it gathers, a life burns bright, warms whatever it touches and is hard to overlook.",
      "The tradition hears fire as the south at midday, everything in flower and in full view. A chart heavy with it moves toward expression, presence and the warmth of being among others.",
      "Fire rises and spreads, and it shows what was hidden. So much of it gives a life brilliance, a quick heat and an instinct for the ceremony that makes a gathering feel whole.",
      "In fire the year stands at its height and holds nothing back. A chart weighted with it carries that fullness, the urge to shine, to celebrate and to light the way for others.",
    ],
    absent: [
      "Fire is summer and the bloom, the warmth that draws people close and the propriety that honours them once they come. A chart without it often finds that warmth in the people and the seasons around it.",
      "Without fire, the chart has no noon of its own, no high sun to show itself by. Brightness may arrive through company, through a calling or through a decade that burns warm.",
      "Fire is what lights and gathers. Where it is absent, a life learns to strike its own light, and light struck on purpose tends to be steady.",
      "The tradition sets propriety beside fire, the courtesy that gives every guest a place at the table. A chart that lacks the phase may come to that courtesy by choosing it.",
    ],
    once: [
      "That one character holds all of the chart's summer, its warmth, its brightness and its sense of occasion.",
      "A single flame carries the whole of fire here, so every moment of being seen draws on the same small light.",
      "Fire is radiance and gathering, and here it lives in one place. That place becomes the chart's hearth.",
      "Propriety, the virtue of fire, rests on one character in this chart, and its light is the more precious for being alone.",
    ],
  },
  earth: {
    heavy: [
      "Earth is the turning between the seasons in the old reckoning, the centre every other phase passes through, and its virtue is trust. Where it gathers, a life becomes ground for others, steady, receiving and slow to be moved.",
      "The tradition places earth at the centre of the compass, holding the four directions together. A chart heavy with it tends toward keeping, carrying and being the one others come back to.",
      "Earth receives the seed and the rain alike and turns them into harvest. So much of it gives a life deep patience and a gift for making things last.",
      "In earth each season rests before the next begins. A chart weighted with it carries that rest inside it, the urge to hold, to keep faith and to tend.",
    ],
    absent: [
      "Earth is the centre and the turning of the seasons, the trust that lets anything be built at all. A chart without it often finds its steady ground in the people and the places it comes to belong to.",
      "Without earth, the chart has no centre of its own to stand on. Steadiness may be borrowed from a home, a practice or a decade that settles.",
      "Earth is what holds and keeps. Where it is absent, a life learns to make its own ground, and ground made by hand is known in every corner.",
      "The tradition sets trust beside earth, the faith kept between people over time. A chart that lacks the phase may come to that faith by building it, promise by promise.",
    ],
    once: [
      "That one character holds all of the chart's centre, its patience and its power to keep faith.",
      "A single stretch of ground carries the whole of earth here, so every need for steadiness returns to the same small field.",
      "Earth is holding and harvest, and here it lives in one place. That place becomes the chart's still point.",
      "Trust, the virtue of earth, rests on one character in this chart, and it is the more precious for being alone.",
    ],
  },
  metal: {
    heavy: [
      "Metal is autumn in the old reckoning, the season of harvest and of the blade, and its virtue is righteousness, the sense of what is owed and what is just. Where it gathers, a life cuts clean, holds a line and knows what to keep and what to let fall.",
      "The tradition hears metal as the west wind at dusk and a bell struck once in clear air. A chart heavy with it is drawn to precision, to principle and to finishing what was begun.",
      "Metal is refined in the fire and keeps its edge. So much of it gives a life resolve, a love of what is true and a courage for endings.",
      "In metal the year gathers its harvest and lets the leaves go. A chart weighted with it carries that discernment, the urge to judge well, to release and to stand by its word.",
    ],
    absent: [
      "Metal is autumn and the clean cut, the righteousness that knows what is just. A chart without it often finds its edge in the people and the seasons that ask it to choose.",
      "Without metal, the chart has no blade of its own, no west wind to strip the branch. Decisiveness may arrive through a mentor, a hard season or a decade that sharpens.",
      "Metal is what refines and ends. Where it is absent, a life learns to draw its own lines, and lines drawn with care tend to hold.",
      "The tradition sets righteousness beside metal, the courage to do what is owed. A chart that lacks the phase may come to that courage by choosing it in small things first.",
    ],
    once: [
      "That one character holds all of the chart's autumn, its edge, its principle and its gift for letting go.",
      "A single blade carries the whole of metal here, so every hard choice draws on the same small edge.",
      "Metal is clarity and harvest, and here it lives in one place. That place becomes the chart's conscience.",
      "Righteousness, the virtue of metal, rests on one character in this chart, and it is the more precious for being alone.",
    ],
  },
  water: {
    heavy: [
      "Water is winter in the old reckoning, the deep stillness where the year keeps its seed, and its virtue is wisdom. Where it gathers, a life runs deep, listens long and finds its way around whatever stands in it.",
      "The tradition hears water as the north at midnight, dark, quiet and full of what has not yet surfaced. A chart heavy with it is drawn to thought, to feeling and to the hidden currents under things.",
      "Water takes the shape of any vessel and wears down stone in its own time. So much of it gives a life adaptability, memory and a patience that outlasts force.",
      "In water the year rests and gathers itself for spring. A chart weighted with it carries that inwardness, the urge to understand, to store and to move when the current is right.",
    ],
    absent: [
      "Water is winter and the deep, the wisdom that waits and listens. A chart without it often finds its depth in the people and the seasons that slow it down.",
      "Without water, the chart has no midnight of its own, no still pool to look into. Reflection may arrive through a teacher, a long winter or a decade that turns inward.",
      "Water is what flows and remembers. Where it is absent, a life learns to sit with what it cannot yet see, and stillness that is learned runs deep.",
      "The tradition sets wisdom beside water, the knowing that comes from patience. A chart that lacks the phase may come to that knowing by giving it time.",
    ],
    once: [
      "That one character holds all of the chart's winter, its depth, its memory and its quiet wisdom.",
      "A single spring carries the whole of water here, so every need for stillness returns to the same small well.",
      "Water is depth and flow, and here it lives in one place. That place becomes the chart's well.",
      "Wisdom, the virtue of water, rests on one character in this chart, and it is the more precious for being alone.",
    ],
  },
};

const lore = (k: string) => LORE[k as PhaseKey];
const loreB = (kind: "heavy" | "absent" | "once") => {
  const at = (j: number) => ({ k }: { k: string }) => lore(k)[kind][j];
  return [at(0), at(1), at(2), at(3)] as [Seg<{ k: string }>, Seg<{ k: string }>, Seg<{ k: string }>, Seg<{ k: string }>];
};
const share = (n: number) => (n >= 8 ? "all eight" : `${WORD[n]} of the eight`);

/* The five phases. */

export const HEAVY: Tree<{ P: string; n: number; k: string }> = {
  a: [
    ({ P, n }) => `${P} is the heaviest phase in this chart, holding ${share(n)} characters.`,
    ({ P, n }) => `Of the five phases, ${P.toLowerCase()} carries the most weight here, with ${share(n)} characters its own.`,
    ({ P, n }) => `More of this chart belongs to ${P.toLowerCase()} than to any other phase, ${share(n)} characters in all.`,
  ],
  b: loreB("heavy"),
  c: [
    {
      yang: () => "The heaviest phase is the chart's native tongue, and it speaks best when it is spoken on purpose.",
      yin: () => "The heaviest phase is the chart's native tongue, and there is ease in speaking it.",
    },
    {
      yang: () => "The tradition also watches for excess, so strength gathered this thickly is best aimed and used with measure.",
      yin: () => "The tradition also watches for excess, so strength gathered this thickly is best leaned on gently and shared.",
    },
    {
      yang: () => "A chart is strongest where it is heaviest, and that strength is the first tool to pick up.",
      yin: () => "A chart is strongest where it is heaviest, and that strength is a home to come back to.",
    },
  ],
};

export const ABSENT: Tree<{ L: string; k: string }> = {
  a: [
    ({ L }) => `${L} does not appear among the eight characters.`,
    ({ L }) => `None of the eight characters belongs to ${L.toLowerCase()}.`,
    ({ L }) => `${L} is the phase this chart was born without.`,
  ],
  b: loreB("absent"),
  c: [
    {
      yang: () => "The tradition reads a missing phase as something met from outside, and it can be sought on purpose and held firmly once found.",
      yin: () => "The tradition reads a missing phase as something met from outside, and it can be welcomed in and kept as one's own.",
    },
    {
      yang: () => "What a birth leaves out, the luck pillars and the company along the way can bring, and the life can go looking.",
      yin: () => "What a birth leaves out, the luck pillars and the company along the way can bring, and the life can let them in.",
    },
    {
      yang: () => "An empty room is room to build, and the building can be chosen.",
      yin: () => "An empty room is a space kept open, and what settles there can be cherished.",
    },
  ],
};

export const ONCE: Tree<{ L: string; k: string }> = {
  a: [
    ({ L }) => `${L} appears only once.`,
    ({ L }) => `${L} is written a single time among the eight.`,
    ({ L }) => `Only one of the eight characters belongs to ${L.toLowerCase()}.`,
  ],
  b: loreB("once"),
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
    () => "Wood feeds fire, fire leaves earth behind it, earth bears metal, metal carries water and water feeds wood again, and in this chart that whole round can turn.",
    () => "Wood, Fire, Earth, Metal and Water each have a place to stand, and each can hand its strength to the next.",
    () => "The round of generating and overcoming can turn here without a gap, every phase fed by one and checked by another.",
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
    ({ dm, yy, p }) => `The Day Master is ${dm}, the ${yy} face of ${p}, and it stands for the self.`,
    ({ dm, yy, p }) => `At the centre of the chart stands ${dm}, ${yy} ${p}, the character the tradition reads as the self.`,
    ({ dm, yy, p }) => `${dm} is this chart's Day Master, ${yy} ${p}, the self around which the other seven characters gather.`,
  ],
  b: [
    ({ q }) => `Its image is ${q}.`,
    ({ q }) => `The tradition draws it as ${q}, and the picture holds a whole temperament.`,
    ({ q }) => `Picture ${q}, and the nature of this self comes into view.`,
    ({ q }) => `The tradition sees it as ${q}, an image worth returning to.`,
  ],
  c: [
    {
      yang: () => "A yang stem meets the world outward and in the open, so this self is known by what it does.",
      yin: () => "A yin stem meets the world inward and with care, so this self is known by what it tends.",
    },
    {
      yang: () => "Yang is the breath out, and this self tends to lead, to move first and to put its force where it can be seen.",
      yin: () => "Yin is the breath in, and this self tends to gather, to absorb and to move when it is ready.",
    },
    {
      yang: () => "Its yang nature keeps its strength in plain view, and that strength is its first instrument.",
      yin: () => "Its yin nature keeps its strength close, and that closeness is its first gift.",
    },
  ],
};

type SeasonCtx = { m: string; mph: string; dph: string; decree: string };

export const SEASON: Record<"same" | "fed" | "pours" | "pressed" | "masters", Tree<SeasonCtx>> = {
  same: {
    a: [
      ({ m, mph }) => `Born in ${m}, the month of ${mph}, the Day Master stands in its own season.`,
      ({ m, mph }) => `The month branch is ${m}, a month of ${mph}, and the month is the climate a chart is born into. Here that climate is the Day Master's own phase.`,
      ({ m, mph }) => `${m} gives this chart its season, and the season weighs most when the tradition asks how strongly a self stands. Its phase is ${mph}, the same as the Day Master's.`,
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
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and the month is the climate a chart is born into. Since ${mph} generates ${dph}, that climate feeds the Day Master.`,
      ({ m, mph, dph }) => `${cap(mph)} rules the month of ${m}, and the month weighs most when the tradition asks how strongly a self stands. ${cap(mph)} generates ${dph}, so the Day Master is fed by its season.`,
    ],
    b: [
      () => "This is a self nourished at the root and supported before it has done anything at all.",
      () => "The tradition reads it as a self supported at the root from the start, the way a mother phase feeds its child.",
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
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and the month is the climate a chart is born into. Since ${dph} generates ${mph}, the Day Master gives itself to that climate.`,
      ({ m, mph, dph }) => `${cap(dph)} generates ${mph}, and ${mph} rules the month of ${m}, the season the tradition weighs first. So the Day Master spends itself on its season.`,
    ],
    b: [
      () => "This is a self that spends its strength on its time and has to express itself. The counsel for such a chart is to rest where it can.",
      () => "The tradition reads a self that must express itself, the way a parent phase feeds its child, and counsels rest wherever rest is offered.",
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
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and the month is the climate a chart is born into. Since ${mph} overcomes ${dph}, that climate presses on the Day Master.`,
      ({ m, mph, dph }) => `${cap(mph)} rules the month of ${m}, the season the tradition weighs first, and ${mph} overcomes ${dph}. So the Day Master meets its season under pressure.`,
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
      ({ m, mph, dph }) => `The month is ${m}, a month of ${mph}, and the month is the climate a chart is born into. Since ${dph} overcomes ${mph}, the Day Master holds the upper hand over that climate.`,
      ({ m, mph, dph }) => `${cap(dph)} overcomes ${mph}, and ${mph} rules the month of ${m}, the season the tradition weighs first. So the Day Master works against its season and masters it.`,
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
    ({ pl, G, reading }) => `Set beside the Day Master, the stem of the ${pl} becomes ${G}, ${reading}.`,
  ],
  b: [
    ({ pl, domain }) => `The ${pl} speaks for ${domain}, and that is where this god does its work.`,
    ({ domain }) => `Its ground is ${domain}, and there its influence gathers.`,
    ({ domain }) => `Look for it in ${domain}, the part of a life this pillar keeps.`,
    ({ domain }) => `This pillar holds ${domain}, so the god colours that part of the story.`,
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
    () => "A god that repeats becomes a theme, and the reading follows it through each ground it touches.",
    () => "What the chart says twice, it means to be heard.",
    () => "Said twice, a god gathers weight across more than one part of a life.",
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
    ({ pl, S, sq }) => `${S} crowns the ${pl}, ${sq}, the face this pillar turns toward the world.`,
    ({ pl, S, sq }) => `At the top of the ${pl} stands ${S}, ${sq}.`,
  ],
  b: [
    ({ A, B, bq, domain }) => `Beneath it is the ${A}, ${B}, ${bq}. Its ground is ${domain}.`,
    ({ A, B, bq, domain }) => `Below lies ${B}, the ${A}, ${bq}, the root the pillar stands on. This pillar speaks for ${domain}.`,
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
