/**
 * The Destiny Chart's reading, said a different way each time it is opened.
 *
 * Every phrase that used to repeat word for word is a small tree, in the
 * shape the owner asked for on 13 November 2026: three openings (a), four
 * middles (b) and three closes (c), each close written in a Yang voice and a
 * Yin voice. That is 3 x 4 x 3 x 2 = 72 ways to say each phrase.
 *
 * And every one of those parts is itself said nine ways (the owner, 13
 * November 2026: "Everything should have as many options as b1"). A part is
 * a pool of three openings and three endings, and each time the part comes
 * round it takes the next of its nine pairings, so both halves move almost
 * every time and no part is said the same way twice in a cycle.
 *
 * The reading speaks to the reader, warmly and in the second person, and
 * wherever it names a phase it tends that phase (TEND). It never cites a
 * tradition, never hedges with "tends to" and never says "this chart".
 *
 * The facts never move between variations: the sign, the phase, the count,
 * the relation and the ground are in every form. Only the saying changes.
 * Nothing here foretells a particular event.
 */
import { LORE, TEND, type PhaseKey } from "./reading-lore";
export { LORE, TEND };

export type YinYang = "yin" | "yang";
export type Txt<C> = string | ((c: C) => string);
type Trio<C> = [Txt<C>, Txt<C>, Txt<C>];
/** One part, said as any of three openings with any of three endings. */
export interface Pool<C> {
  x: Trio<C>;
  y: Trio<C>;
}
export interface Close<C> {
  yang: Pool<C>;
  yin: Pool<C>;
}
export interface Tree<C> {
  a: [Pool<C>, Pool<C>, Pool<C>];
  b: [Pool<C>, Pool<C>, Pool<C>, Pool<C>];
  c: [Close<C>, Close<C>, Close<C>];
}

/** Turns before any one phrase repeats for a chart of one voice. */
export const TURN_CYCLE = 36;

const txt = <C>(v: Txt<C>, ctx: C) => (typeof v === "string" ? v : v(ctx));
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** The j-th of a part's nine pairings. Consecutive j never share a half, except at the wrap. */
function form<C>(p: Pool<C>, ctx: C, j: number): string {
  const n = mod(j, 9);
  return `${txt(p.x[n % 3], ctx)} ${txt(p.y[(n + Math.floor(n / 3)) % 3], ctx)}`;
}

/** All nine ways a part is said. */
export function forms<C>(p: Pool<C>, ctx: C): string[] {
  return Array.from({ length: 9 }, (_, j) => form(p, ctx, j));
}

/** All nine ways b1 is said, for tests and the review file. */
export function b1Forms<C>(t: Tree<C>, ctx: C): string[] {
  return forms(t.b[0], ctx);
}

/**
 * Pick one line. `turn` moves once per reading opened; `salt` keeps two
 * lines of one kind in the same reading (the three god lines, the three
 * pillar lines) on different branches. Every turn changes a, b and c at
 * once, all 36 branches of one voice come before any repeats, and each part
 * steps to its next form every time it comes round.
 */
export function say<C>(t: Tree<C>, ctx: C, yy: YinYang, turn = 0, salt = 0): string {
  const i = turn + salt;
  const a = form(t.a[mod(i, 3)], ctx, Math.floor(i / 3));
  const b = form(t.b[mod(i, 4)], ctx, Math.floor(i / 4));
  const c = form(t.c[mod(i + Math.floor(turn / 12), 3)][yy], ctx, Math.floor(i / 3));
  return `${a} ${b} ${c}`;
}

/** Every branch of a tree, each part in its first form, for tests and the review file. */
export function leaves<C>(t: Tree<C>, ctx: C): string[] {
  const out: string[] = [];
  for (const a of t.a) for (const b of t.b) for (const c of t.c) for (const yy of ["yang", "yin"] as const) {
    out.push(`${form(a, ctx, 0)} ${form(b, ctx, 0)} ${form(c[yy], ctx, 0)}`);
  }
  return out;
}

/** Every part of a tree: three openings, four middles, three closes in two voices. */
export function pools<C>(t: Tree<C>): Pool<C>[] {
  return [...t.a, ...t.b, ...t.c.flatMap((c) => [c.yang, c.yin])];
}

/** Every form of every part, for tests and the prose sweep. */
export function allForms<C>(t: Tree<C>, ctx: C): string[] {
  return pools(t).flatMap((p) => forms(p, ctx));
}

/** The room's opening lines, a and b only, for the moment before the chart is known. */
export function sayOpening<C>(t: Tree<C>, ctx: C, turn = 0): string {
  return `${form(t.a[mod(turn, 3)], ctx, Math.floor(turn / 3))} ${form(t.b[mod(turn, 4)], ctx, Math.floor(turn / 4))}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lc = (s: string) => s.toLowerCase();
const WORD = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight"];
const share = (n: number) => (n >= 8 ? "all eight" : `${WORD[n]} of the eight`);

const P = <C>(x: Trio<C>, y: Trio<C>): Pool<C> => ({ x, y });
/** A close whose endings are three of the phase's own acts of care. */
function TC<C>(get: (c: C) => string, s: number, yang: Trio<C>, yin: Trio<C>): Close<C> {
  const tails = [0, 1, 2].map((j) => (c: C) => `${cap(TEND[get(c) as PhaseKey][3 * s + j])}.`) as Trio<C>;
  return { yang: { x: yang, y: tails }, yin: { x: yin, y: tails } };
}
/** A close for a phrase with no phase, both voices sharing three endings. */
const PC = <C>(yang: Trio<C>, yin: Trio<C>, tails: Trio<C>): Close<C> => ({ yang: { x: yang, y: tails }, yin: { x: yin, y: tails } });

type K = { k: string };
const loreB = (kind: "heavy" | "absent" | "once"): Tree<K>["b"] => {
  const lo = (c: K) => LORE[c.k as PhaseKey][kind];
  const tri = (f: (c: K, j: number) => string): Trio<K> => [(c) => f(c, 0), (c) => f(c, 1), (c) => f(c, 2)];
  const half = (s: number) => P(tri((c, j) => lo(c).b[s].x[j]), tri((c, j) => lo(c).b[s].y[j]));
  return [P(tri((c, j) => lo(c).x[j]), tri((c, j) => lo(c).y[j])), half(0), half(1), half(2)];
};

/* The five phases. */

type HeavyCtx = { P: string; n: number; k: string };
type LackCtx = { L: string; k: string };

export const HEAVY: Tree<HeavyCtx> = {
  a: [
    {
      x: [
        ({ P, n }) => `${P} is the heaviest phase in your chart, holding ${share(n)} characters.`,
        ({ P, n }) => `${P} carries the most weight in your chart, with ${share(n)} characters to its name.`,
        ({ P, n }) => `${P} leads your chart, ${share(n)} characters strong.`,
      ],
      y: ["Count them and you can feel the weight.", "That is a lot of one colour in your paint box.", "It sets the tone for everything else."],
    },
    {
      x: [
        ({ P, n }) => `Of the five phases, ${lc(P)} pulls the most weight for you, with ${share(n)} characters its own.`,
        ({ P, n }) => `Among the five phases, ${lc(P)} holds the most ground in you, ${share(n)} characters deep.`,
        ({ P, n }) => `Line up the five phases and ${lc(P)} stands tallest, with ${share(n)} characters.`,
      ],
      y: ["The scale tips its way.", "It is the loudest voice in your choir.", "Every other phase plays in its key."],
    },
    {
      x: [
        ({ P, n }) => `${P} walked into your chart, counted the eight seats and kept ${share(n)} for itself.`,
        ({ P, n }) => `${P} arrived early and claimed ${share(n)} seats in your chart.`,
        ({ P, n }) => `${P} sat down in ${share(n)} chairs at your table and made itself at home.`,
      ],
      y: ["It knows it is welcome.", "It plans to stay a while.", "Pour it a cup of tea."],
    },
  ],
  b: loreB("heavy") as Tree<HeavyCtx>["b"],
  c: [
    TC<HeavyCtx>((c) => c.k, 0,
      ["Your heaviest phase is your native tongue, so speak it loud and on purpose.", "That phase is your home key, so play it with both hands.", "Plenty like this wants a direction, so give your strongest phase a job."],
      ["Your heaviest phase is your native tongue, and there is ease in speaking it softly.", "That phase is your home key, and it sounds lovely played quietly.", "Plenty like this can simply be enjoyed, so let your strongest phase hum in the background."]),
    TC<HeavyCtx>((c) => c.k, 1,
      ["A full quiver is a gift once you aim it, so pick your targets.", "So much of one thing becomes power when you point it somewhere.", "A deep well is meant for drawing, so lower the bucket and pull."],
      ["A full harvest feeds more people when it is shared, so set the table wide.", "So much of one thing becomes comfort when you share it around.", "A deep well is a blessing to the whole village, so let others drink."]),
    TC<HeavyCtx>((c) => c.k, 2,
      ["Your strength lives where your chart is heaviest, so make it the first tool you reach for.", "Lead with what you have most of and let the rest follow.", "Your richest phase is your sharpest tool, so pick it up first."],
      ["Your strength lives where your chart is heaviest, so make it a home to come back to.", "Rest in what you have most of and let it hold you.", "Your richest phase is your softest pillow, so lean back into it."]),
  ],
};

export const ABSENT: Tree<LackCtx> = {
  a: [
    {
      x: [
        ({ L }) => `${L} skipped the party when your eight characters gathered.`,
        ({ L }) => `${L} sent its regrets when your eight characters gathered.`,
        ({ L }) => `${L} never made it to the gathering of your eight characters.`,
      ],
      y: ["Its plate is still warm.", "The invitation stands.", "You can still call it in."],
    },
    {
      x: [
        ({ L }) => `None of your eight characters belongs to ${lc(L)}.`,
        ({ L }) => `Not one of your eight characters is ${lc(L)}.`,
        ({ L }) => `Your eight characters hold no ${lc(L)} at all.`,
      ],
      y: ["That absence is a space you get to fill.", "Think of it as an open door.", "The room is kept ready for it."],
    },
    {
      x: [
        ({ L }) => `Your eight characters sat down without ${lc(L)}, and its chair at the table is still empty.`,
        ({ L }) => `Your eight characters started dinner without ${lc(L)}.`,
        ({ L }) => `Your eight characters lit the lamps while ${lc(L)} was still on the road.`,
      ],
      y: ["Its chair is yours to fill.", "Set a place for it anyway.", "Leave a light on for it."],
    },
  ],
  b: loreB("absent") as Tree<LackCtx>["b"],
  c: [
    TC<LackCtx>((c) => c.k, 0,
      [({ L }) => `Think of ${lc(L)} as a guest you go out and invite.`, ({ L }) => `Go and find ${lc(L)} where it lives and bring it home.`, ({ L }) => `Send ${lc(L)} a bold invitation and mean it.`],
      [({ L }) => `Think of ${lc(L)} as a guest you welcome in.`, ({ L }) => `Leave the door open and let ${lc(L)} find its own way to you.`, ({ L }) => `Make a soft place for ${lc(L)} to land when it arrives.`]),
    TC<LackCtx>((c) => c.k, 1,
      ["What your birth left out, your luck pillars and your company can bring, so go looking.", "Your decades and your friends carry what your birth missed, so seek them out.", "What was missing at the start can be gathered on the road, so walk it."],
      ["What your birth left out, your luck pillars and your company can bring, so let them in.", "Your decades and your friends carry what your birth missed, so let them bring it.", "What was missing at the start can arrive as a gift, so keep your hands open."]),
    TC<LackCtx>((c) => c.k, 2,
      ["An empty room is room to build, so pick up the hammer.", "An empty lot is a building site, so draw the plans.", "A blank page is an invitation, so start writing."],
      ["An empty room is a space kept open, so dust the shelf.", "An empty lot is a meadow waiting for seeds, so scatter a few.", "A blank page is a quiet place, so sit with it awhile."]),
  ],
};

export const ONCE: Tree<LackCtx> = {
  a: [
    {
      x: [({ L }) => `${L} shows up only once in your chart.`, ({ L }) => `${L} turns up just once among your eight characters.`, ({ L }) => `${L} makes one single entrance in your chart.`],
      y: ["One is enough to matter.", "Once is plenty when it counts.", "A single visit can change a house."],
    },
    {
      x: [({ L }) => `${L} is written a single time among your eight.`, ({ L }) => `Only one of your eight characters belongs to ${lc(L)}.`, ({ L }) => `Your eight characters hold just one ${lc(L)}.`],
      y: ["Notice where it sits.", "That one spot is worth finding.", "Learn its address."],
    },
    {
      x: [
        ({ L }) => `${L} came to your chart as a soloist, one voice and no backup singers.`,
        ({ L }) => `${L} plays your chart as a solo act.`,
        ({ L }) => `${L} took the stage in your chart alone, one spotlight and one voice.`,
      ],
      y: ["Listen closely to its song.", "Give it the whole stage.", "Applaud when it sings."],
    },
  ],
  b: loreB("once") as Tree<LackCtx>["b"],
  c: [
    TC<LackCtx>((c) => c.k, 0,
      ["A single note rings clearest when you strike it with intent.", "One note played boldly fills the hall.", "Strike your one note hard and let it echo."],
      ["A single note is easy to protect and worth protecting.", "One note held softly can carry a whole song.", "Hum your one note gently and let it linger."]),
    TC<LackCtx>((c) => c.k, 1,
      ["Where a thing is scarce, each use of it counts double, so spend it well.", "Scarce things are strong things when you use them on purpose.", "One coin spent wisely buys more than a purse spent carelessly."],
      ["Scarcity makes a thing precious, so keep it close.", "Scarce things deserve a velvet box and a gentle hand.", "One coin saved with love is a small treasure."]),
    TC<LackCtx>((c) => c.k, 2,
      ["Lean on it knowingly and it will hold its line.", "Put your weight on it with confidence and it will hold.", "Call on it at the right moment and it will answer."],
      ["Care for it and it will carry more than its size suggests.", "Look after it and it will grow stronger than it looks.", "Keep it close and it will keep you company."]),
  ],
};

type None = Record<string, never>;

export const ALL_FIVE: Tree<None> = {
  a: [
    { x: ["All five phases showed up for you.", "All five phases came to your party.", "All five phases signed your guest book."], y: ["Every seat at the table is filled.", "Nobody missed the gathering.", "The house is full."] },
    {
      x: ["Every one of the five phases is written somewhere in your chart.", "Each of the five phases has a home in your chart.", "Every phase of the five holds at least one character for you."],
      y: ["The whole wheel is present.", "None of them goes missing.", "The circle closes in you."],
    },
    {
      x: [
        "Your chart was dealt a full hand, wood, fire, earth, metal and water, every suit in the deck.",
        "Your chart holds a full set, wood, fire, earth, metal and water.",
        "You were handed the whole paint box, wood, fire, earth, metal and water.",
      ],
      y: ["Play every card.", "Use every colour.", "Lucky you."],
    },
  ],
  b: [
    {
      x: ["Your chart is a house with every tool hanging somewhere on its walls.", "Your chart is a kitchen with every spice on the rack.", "Your chart is a band with every instrument in the room."],
      y: [
        "Keep each one oiled, because any season may knock.",
        "Love them all a little, the green, the flame, the soil, the blade and the deep.",
        "Give each a turn in your hands and they will all learn your grip.",
      ],
    },
    {
      x: [
        "Wood feeds fire, fire leaves earth behind it, earth bears metal, metal carries water and water feeds wood again, and in your chart that whole round can turn.",
        "Wood to fire, fire to earth, earth to metal, metal to water and water back to wood, the whole round lives in you.",
        "In you the generating round runs all the way around, wood feeding fire and water feeding wood again.",
      ],
      y: ["Keep the wheel greased.", "Let it spin.", "Give it a push now and then."],
    },
    {
      x: ["Wood, Fire, Earth, Metal and Water each have a place to stand in you.", "All five phases have a foothold in your chart.", "Each of the five has its own room in your house."],
      y: ["Each can hand its strength to the next like a relay baton.", "They pass their strength along like friends sharing a meal.", "They take turns carrying the load."],
    },
    {
      x: [
        "The round of generating and overcoming can turn in you without a gap, every phase fed by one and checked by another.",
        "Every phase in you is fed by one and checked by another, a full circle with no gaps.",
        "Feeding and checking run the whole way round in you.",
      ],
      y: ["It is a dinner party where nobody goes hungry.", "It is a well tuned orchestra.", "Everyone gets a turn at the microphone."],
    },
  ],
  c: [
    PC<None>(
      ["The question is which tool your hand reaches for first, and the hand is yours to steer.", "Choose your first tool with intent.", "Your hand gets to pick which tool leads."],
      ["The question is which tool your hand reaches for first, and there is time to learn the weight of each.", "Learn the weight of each tool slowly.", "Your hand can take its time with each tool."],
      ["Every tool is waiting.", "Each one fits your grip.", "The workbench is yours."]),
    PC<None>(
      ["Range like this is a superpower once you aim it.", "With range like this you can take on any season.", "This much range is a toolbox for every job."],
      ["Range like this lets you meet any season with something already in your hands.", "With range like this, every season finds you ready.", "This much range is a pantry stocked for every weather."],
      ["Use it with joy.", "Enjoy the variety.", "Savour the whole menu."]),
    PC<None>(
      ["Balance is ground to leap from.", "A full circle makes a strong springboard.", "Balance gives your jump a solid floor."],
      ["Balance is ground to rest on, and to come home to.", "A full circle makes a soft place to land.", "Balance gives you a floor to rest on."],
      ["Stand on it.", "Trust it.", "Call it home."]),
  ],
};

/* The self and its season. */

type DmCtx = { dm: string; yy: string; p: string; q: string };

export const DAY_MASTER: Tree<DmCtx> = {
  a: [
    {
      x: [
        ({ dm, yy, p }) => `Your Day Master is ${dm}, the ${yy} face of ${p}, and it stands for you.`,
        ({ dm, yy, p }) => `Your Day Master is ${dm}, ${p} in its ${yy} form.`,
        ({ dm, yy, p }) => `Your Day Master is ${dm}, the ${yy} side of ${p}, and it carries your name.`,
      ],
      y: ["Everything else in your chart circles it.", "It is the you in your chart.", "Get to know it well."],
    },
    {
      x: [
        ({ dm, yy, p }) => `At the centre of your chart stands ${dm}, ${yy} ${p}, the character that holds your name.`,
        ({ dm, yy, p }) => `At the heart of your chart sits ${dm}, ${yy} ${p}.`,
        ({ dm, yy, p }) => `In the middle of your chart, ${dm} keeps your seat, ${yy} ${p} through and through.`,
      ],
      y: ["The other seven gather round.", "It is your anchor.", "That seat is yours."],
    },
    {
      x: [
        ({ dm, yy, p }) => `Out of all eight characters, one is cast as you, and it is ${dm}, ${yy} ${p}.`,
        ({ dm, yy, p }) => `Of your eight characters, ${dm} plays the lead, ${yy} ${p}.`,
        ({ dm, yy, p }) => `Eight characters auditioned for the role of you, and ${dm}, ${yy} ${p}, got the part.`,
      ],
      y: ["The rest are your supporting cast.", "Take a bow.", "The spotlight is yours."],
    },
  ],
  b: [
    {
      x: [({ q }) => `Its image is ${q}.`, ({ q }) => `Picture ${q}.`, ({ q }) => `Your emblem is ${q}.`],
      y: [
        "Hold that picture and your whole temperament comes into view.",
        "Paint it on your coat of arms and wear it well.",
        "Come back to that image whenever you forget who is holding the brush.",
      ],
    },
    {
      x: [({ q }) => `Imagine ${q} with your name carved into it.`, ({ q }) => `See ${q} with your initials on it.`, ({ q }) => `Think of ${q} and sign your name beneath it.`],
      y: ["The picture holds your whole temperament.", "That image carries your nature.", "There is your character in one picture."],
    },
    {
      x: [({ q }) => `Bring ${q} to mind.`, ({ q }) => `Call up ${q}.`, ({ q }) => `Hold ${q} before your eyes.`],
      y: ["The nature of your self walks into the room.", "Your self steps forward.", "Your temperament comes into focus."],
    },
    {
      x: [({ q }) => `Keep ${q} in your mind's eye.`, ({ q }) => `Carry ${q} with you.`, ({ q }) => `Keep ${q} close.`],
      y: ["It is an image worth returning to like an old friend.", "Return to it like a favourite song.", "Visit it the way you visit an old friend."],
    },
  ],
  c: [
    TC<DmCtx>((c) => c.p, 0,
      ["A yang stem meets the world outward and in the open, so the world knows you by what you do.", "Your yang stem steps out first and says hello.", "Your yang stem works in plain sight."],
      ["A yin stem meets the world inward and with care, so the world knows you by what you nurture.", "Your yin stem listens first and speaks second.", "Your yin stem works behind the curtain with care."]),
    TC<DmCtx>((c) => c.p, 1,
      ["Yang is the breath out, and you lead, move first and put your force where it can be seen.", "Like the breath out, you push forward and fill the room.", "Yours is the outward breath, quick to move and quick to lead."],
      ["Yin is the breath in, and you gather, absorb and move when the moment ripens.", "Like the breath in, you gather before you move.", "Yours is the inward breath, patient and absorbing."]),
    TC<DmCtx>((c) => c.p, 2,
      ["Your yang nature keeps your strength in plain view as your first instrument.", "Your yang nature wears its strength on its sleeve.", "Your yang nature leads with its strength."],
      ["Your yin nature keeps your strength close as your first gift.", "Your yin nature holds its strength in reserve.", "Your yin nature offers its strength quietly."]),
  ],
};

/* The self and its season. */

type SeasonCtx = { m: string; mph: string; dph: string; decree: string; dk: string };
const DK = (c: SeasonCtx) => c.dk;

export const SEASON: Record<"same" | "fed" | "pours" | "pressed" | "masters", Tree<SeasonCtx>> = {
  same: {
    a: [
      {
        x: [
          ({ m, mph }) => `Born in ${m}, the month of ${mph}, your Day Master stands in its own season.`,
          ({ m, mph }) => `You arrived in ${m}, a month of ${mph}, and your Day Master woke up in its own season.`,
          ({ m, mph }) => `Your birth month is ${m}, a month of ${mph}, the very season your Day Master calls its own.`,
        ],
        y: ["You were born on home turf.", "The weather knew your name.", "The door was already open."],
      },
      {
        x: [
          ({ m, mph }) => `Your month branch is ${m}, a month of ${mph}, and the month is the climate you were born into. Here that climate is your Day Master's own phase.`,
          ({ m, mph }) => `The month is the climate you were born into, and yours is ${m}, a month of ${mph}, your Day Master's own phase.`,
          ({ m, mph }) => `Month by month the air changes, and in ${m}, a month of ${mph}, it smelled exactly like your Day Master.`,
        ],
        y: ["Breathe it in.", "It fits you like your own skin.", "Home air, all the way down."],
      },
      {
        x: [
          ({ m, mph }) => `${m} gives your chart its season, and that season is ${mph}, the same phase as your Day Master.`,
          ({ m, mph }) => `${m} sets your season to ${mph}, and ${mph} is your Day Master's own colour.`,
          ({ m, mph }) => `${m} paints your season in ${mph}, the same paint your Day Master is mixed from.`,
        ],
        y: ["Self and season sing in unison.", "Like matches like.", "Two of a kind, and both of them yours."],
      },
    ],
    b: [
      {
        x: [({ decree }) => `This is called command of ${decree}.`, ({ decree }) => `Its name is command of ${decree}.`, ({ decree }) => `You were handed command of ${decree}.`],
        y: [
          "Your self is rooted and drinks from the very ground it was planted in.",
          "Your roots reach straight into your own soil, and the soil is glad to have you.",
          "Think of a fish born in the right river, swimming with every current at its back.",
        ],
      },
      {
        x: [
          ({ decree }) => `Command of ${decree} is the fullest support a season gives.`,
          ({ decree }) => `No season gives more than command of ${decree}.`,
          ({ decree }) => `Command of ${decree} is the season giving everything it has.`,
        ],
        y: ["Your roots run deep in it.", "Your roots drink their fill.", "You sink into it like a tree into good loam."],
      },
      {
        x: [
          ({ decree }) => `To be born in your own season is command of ${decree}.`,
          ({ decree }) => `Being born in your own season earns you command of ${decree}.`,
          ({ decree }) => `Your own season at your birth means command of ${decree}.`,
        ],
        y: ["It is a home field advantage written into the calendar.", "The crowd was cheering before you took the field.", "Call it the calendar's welcome mat."],
      },
      {
        x: [
          ({ decree }) => `Command of ${decree} means the month itself lends you its strength.`,
          ({ decree }) => `With command of ${decree} the month carries your bags.`,
          ({ decree }) => `Command of ${decree} puts the month's own muscle behind you.`,
        ],
        y: ["It is a tailwind you never had to ask for.", "Nobody had to ask it twice.", "It is the gentlest kind of push."],
      },
    ],
    c: [
      TC<SeasonCtx>(DK, 0,
        ["A rooted self can afford to push.", "Roots this deep let you lean into the wind.", "With ground like this under you, push hard."],
        ["A rooted self can afford to be still.", "Roots this deep let you stand quietly in any wind.", "With ground like this under you, stillness is strength."]),
      TC<SeasonCtx>(DK, 1,
        ["Strength at the root is strength to spend.", "What the root holds, the branch can spend.", "Spend the strength your root keeps stocked."],
        ["Strength at the root is strength to share.", "What the root holds, the branch can share.", "Share the strength your root keeps stocked."]),
      TC<SeasonCtx>(DK, 2,
        ["Stand on that ground and move.", "Plant your feet and go.", "Push off from home ground."],
        ["Trust that ground.", "Settle into home ground.", "Let that ground hold you."]),
    ],
  },
  fed: {
    a: [
      {
        x: [
          ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master is fed by its season, because ${mph} generates ${dph}.`,
          ({ m, mph, dph }) => `You arrived in ${m}, a month of ${mph}, and since ${mph} generates ${dph}, your season fed your Day Master from the start.`,
          ({ m, mph, dph }) => `In ${m}, a month of ${mph}, the season feeds your Day Master, because ${mph} generates ${dph}.`,
        ],
        y: ["You came into the world well fed.", "Your plate was full from the first day.", "Mother season had supper waiting."],
      },
      {
        x: [
          ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${mph} generates ${dph}, that climate feeds your Day Master.`,
          ({ m, mph, dph }) => `The climate you were born into is ${m}, a month of ${mph}, and ${mph} generates ${dph}, so the air itself nourishes your Day Master.`,
          ({ m, mph, dph }) => `Month by month the air changes, and ${m}, a month of ${mph}, blew in nourishing, because ${mph} generates ${dph}.`,
        ],
        y: ["Breathe deep.", "It is good air.", "Every breath feeds you."],
      },
      {
        x: [
          ({ m, mph }) => `${cap(mph)} runs the kitchen in the month of ${m}, and ${mph} generates your Day Master's phase.`,
          ({ m, mph, dph }) => `${cap(mph)} rules ${m} and spends the month cooking for ${dph}.`,
          ({ m, mph, dph }) => `${cap(mph)} keeps the hearth in ${m}, and the soup it stirs is for ${dph}.`,
        ],
        y: ["Your Day Master was born to a full plate.", "Pull up a chair.", "Seconds are always on offer."],
      },
    ],
    b: [
      {
        x: [
          "You were nourished at the root and supported before you had done anything at all.",
          "Your season fed you the way a mother phase feeds its child.",
          "The month poured you a cup before you were even thirsty.",
        ],
        y: ["Receive it without apology.", "That support is the soil under every step you take.", "Let it soak all the way down to your roots."],
      },
      {
        x: ["Your time nourished you before you lifted a hand.", "The month fed you before you could ask.", "Your season cooked for you before you could hold a spoon."],
        y: ["Think of it as breakfast in bed on the day you were born.", "That is love in its plainest form.", "Eat well."],
      },
      {
        x: ["The season gives first.", "Your season is the one who gives first.", "In your chart the giving runs toward you."],
        y: ["You receive before anything is asked of you.", "Nothing is owed for it.", "Take it as the gift it is."],
      },
      {
        x: ["You came into a household that was already cooking for you.", "You were born into a warm kitchen.", "The pot was on the fire when you arrived."],
        y: ["The smell of it never quite leaves you.", "You can come back to that warmth any time.", "Some part of you is always welcome at that table."],
      },
    ],
    c: [
      TC<SeasonCtx>(DK, 0,
        ["Support like this is fuel, and fuel is for burning toward something.", "Fuel like this wants a destination.", "All that nourishment is energy waiting for a direction."],
        ["Support like this can be received without proving anything first.", "Nourishment like this asks nothing back.", "All that nourishment is simply yours to take in."]),
      TC<SeasonCtx>(DK, 1,
        ["What was given freely can be put to bold use.", "A free gift makes a fine first investment.", "Spend what you were given on something brave."],
        ["What was given freely can simply be accepted.", "A free gift needs only a thank you.", "Let what you were given settle in."]),
      TC<SeasonCtx>(DK, 2,
        ["Build on that support and build high.", "Stack your plans on that footing.", "Raise something tall on ground this good."],
        ["Let that support steady the rest of you.", "Lean back into that support.", "Rest your weight on what holds you."]),
    ],
  },
  pours: {
    a: [
      {
        x: [
          ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master pours itself into the season, because ${dph} generates ${mph}.`,
          ({ m, mph, dph }) => `You arrived in ${m}, a month of ${mph}, and since ${dph} generates ${mph}, your Day Master gives itself to the season.`,
          ({ m, mph, dph }) => `In ${m}, a month of ${mph}, your Day Master feeds the season, because ${dph} generates ${mph}.`,
        ],
        y: ["You were born giving.", "Generosity came with the birth certificate.", "Your hands were open from the start."],
      },
      {
        x: [
          ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${dph} generates ${mph}, your Day Master gives itself to that climate.`,
          ({ m, mph, dph }) => `The climate you were born into is ${m}, a month of ${mph}, and ${dph} generates ${mph}, so your Day Master feeds the very air around it.`,
          ({ m, mph, dph }) => `Month by month the air changes, and ${m}, a month of ${mph}, drank from your Day Master, because ${dph} generates ${mph}.`,
        ],
        y: ["You give the room its warmth.", "The season grows on what you give.", "The world around you is fuller for it."],
      },
      {
        x: [
          ({ m, mph, dph }) => `${cap(dph)} generates ${mph}, and ${mph} rules the month of ${m}.`,
          ({ m, mph, dph }) => `${cap(dph)} feeds ${mph}, and ${mph} holds the month of ${m}.`,
          ({ m, mph, dph }) => `${cap(dph)} pours into ${mph}, the phase that runs ${m}.`,
        ],
        y: ["Your Day Master is the host of the party, refilling every glass but its own.", "You keep the party going and forget your own glass.", "Your hands pass every plate around the table."],
      },
    ],
    b: [
      {
        x: ["You spend your strength on your time, and you have to express yourself.", "You give outward by nature, a fountain with no off switch.", "Your strength runs outward into what you make."],
        y: ["Rest wherever rest is offered.", "Sit down sometimes, and let someone else pour.", "Rest is what keeps the well from running dry."],
      },
      {
        x: ["Like a parent phase feeding its child, you pour.", "You feed your season the way a parent feeds a child.", "Your phase is the mother here, and the season is the child at the table."],
        y: ["The wise move is to rest wherever rest is offered.", "Parents need their naps too.", "Save a bite for yourself."],
      },
      {
        x: ["Your gift flows out like a river to the sea.", "What you have runs outward like water downhill.", "Your gift travels out the way a river travels to the sea."],
        y: ["Every river needs its rain, so rest where you can.", "Let the rain find you too.", "Even rivers need a rainy season."],
      },
      {
        x: ["A candle that lights the room still needs its wick trimmed.", "The lamp that lights the house still needs its oil.", "Every bright lantern needs refilling."],
        y: ["Rest when the room is bright.", "Refill while the light is good.", "Look after the flame that looks after everyone."],
      },
    ],
    c: [
      TC<SeasonCtx>(DK, 0,
        ["Giving is your power, so choose where it goes.", "Your generosity is a force, so aim it.", "Point your giving where it builds the most."],
        ["Giving is your gift, and some of it is yours to keep.", "Your generosity is precious, so keep a share at home.", "Save some of your giving for yourself."]),
      TC<SeasonCtx>(DK, 1,
        ["Expression is the work, and the work deserves your full force.", "Make things, and make them loud.", "Your voice is your craft, so use all of it."],
        ["Expression is the work, and rest is part of the work.", "Make things, and nap between them.", "Your voice is your craft, and quiet is part of the song."]),
      TC<SeasonCtx>(DK, 2,
        ["Pour with aim.", "Pour on purpose.", "Pour where it counts."],
        ["Pour, and let yourself be refilled.", "Pour, then hold out your own cup.", "Pour, and let the pitcher come back to you."]),
    ],
  },
  pressed: {
    a: [
      {
        x: [
          ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master is pressed by its season, because ${mph} overcomes ${dph}.`,
          ({ m, mph, dph }) => `You arrived in ${m}, a month of ${mph}, and since ${mph} overcomes ${dph}, your season leaned its weight on your Day Master.`,
          ({ m, mph, dph }) => `In ${m}, a month of ${mph}, the season presses on your Day Master, because ${mph} overcomes ${dph}.`,
        ],
        y: ["You started life with your shoulders set.", "You learned your strength early.", "The weight came first and the muscle followed."],
      },
      {
        x: [
          ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${mph} overcomes ${dph}, that climate presses on your Day Master.`,
          ({ m, mph, dph }) => `The climate you were born into is ${m}, a month of ${mph}, and ${mph} overcomes ${dph}, so the very air leaned on your Day Master.`,
          ({ m, mph, dph }) => `Month by month the air changes, and ${m}, a month of ${mph}, came in heavy, because ${mph} overcomes ${dph}.`,
        ],
        y: ["You learned to breathe under pressure.", "Your lungs are stronger for it.", "Thin air makes strong climbers."],
      },
      {
        x: [
          ({ m, mph, dph }) => `${cap(mph)} rules the month of ${m} and overcomes ${dph}.`,
          ({ m, mph, dph }) => `${cap(mph)} holds ${m} and keeps a firm hand on ${dph}.`,
          ({ m, mph, dph }) => `${cap(mph)} sits on the throne of ${m} and tests ${dph}.`,
        ],
        y: ["Your Day Master was born under a heavy hand and grew muscles to match.", "You were raised by a strict coach.", "Your early lessons came with homework."],
      },
    ],
    b: [
      {
        x: ["This is called a forge.", "Your season was a forge.", "Call it the blacksmith's month."],
        y: [
          "You were shaped early by a weight you did not choose.",
          "The hammer fell before you could pick your shape, and the shape it gave you holds.",
          "Heat and hammer did their work early, and what they made has an edge.",
        ],
      },
      {
        x: ["You learned your shape on the anvil.", "The anvil taught you your outline.", "Your first teacher was an anvil."],
        y: ["The weight was not your pick.", "Nobody asked your permission.", "The lesson came before the choosing."],
      },
      {
        x: ["What pressed on you early also gave you your edge.", "The early pressure honed you.", "Your sharpest edge came from your hardest season."],
        y: ["Keep it bright.", "Use it well.", "It cuts clean."],
      },
      {
        x: ["You and a diamond share a story of pressure and time.", "Coal under pressure becomes a diamond, and you know that story firsthand.", "Pressure and patience make diamonds, and your month supplied both."],
        y: ["Let yourself sparkle.", "You catch the light now.", "Hold yourself up to the sun."],
      },
    ],
    c: [
      TC<SeasonCtx>(DK, 0,
        ["Pressure met squarely becomes temper.", "Face the weight head on and it turns to steel.", "Meet the pressure and you harden in the best way."],
        ["Pressure you never chose need not be carried alone.", "Weight you did not pick can be shared.", "You may set some of that pressure down."]),
      TC<SeasonCtx>(DK, 1,
        ["What was forged can now cut.", "The blade is ready for work.", "A tempered edge wants a task."],
        ["What was forged can now rest in its shape.", "The blade can lie still in its sheath.", "A tempered edge can rest between tasks."]),
      TC<SeasonCtx>(DK, 2,
        ["That weight built the strength now in your hand.", "The heavy years left you strong arms.", "Your grip was built under load."],
        ["That weight was never your doing, and what it shaped is steady.", "The heavy years were not your fault, and they left you steady.", "None of that weight was yours to earn, and you stand firm anyway."]),
    ],
  },
  masters: {
    a: [
      {
        x: [
          ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master masters its season, because ${dph} overcomes ${mph}.`,
          ({ m, mph, dph }) => `You arrived in ${m}, a month of ${mph}, and since ${dph} overcomes ${mph}, your Day Master took charge of its season.`,
          ({ m, mph, dph }) => `In ${m}, a month of ${mph}, your Day Master holds the reins, because ${dph} overcomes ${mph}.`,
        ],
        y: ["You were born with your sleeves rolled up.", "You came in ready to work.", "The season met its match."],
      },
      {
        x: [
          ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${dph} overcomes ${mph}, your Day Master holds the upper hand.`,
          ({ m, mph, dph }) => `The climate you were born into is ${m}, a month of ${mph}, and ${dph} overcomes ${mph}, so your Day Master bends the weather to its will.`,
          ({ m, mph, dph }) => `Month by month the air changes, and ${m}, a month of ${mph}, answered to your Day Master, because ${dph} overcomes ${mph}.`,
        ],
        y: ["You set the thermostat.", "The weather listens to you.", "The climate takes your lead."],
      },
      {
        x: [
          ({ m, mph, dph }) => `${cap(dph)} overcomes ${mph}, and ${mph} rules the month of ${m}.`,
          ({ m, mph, dph }) => `${cap(dph)} checks ${mph}, the phase that holds ${m}.`,
          ({ m, mph, dph }) => `${cap(dph)} keeps ${mph} in line, and ${mph} runs ${m}.`,
        ],
        y: ["Your Day Master rolled up its sleeves and took the wheel of its season.", "You took the wheel early.", "You drive, and the season rides along."],
      },
    ],
    b: [
      {
        x: ["You were set against your time from your first breath.", "You came out arguing with the weather.", "Your season is a field you work by hand."],
        y: ["Your life turns resistance into a living.", "Most days you win the argument.", "What resists you becomes what sustains you."],
      },
      {
        x: ["You work your season like a field.", "You plough your season the way a farmer ploughs stony ground.", "Your month is a field, and you hold the plough."],
        y: ["What resists you becomes what feeds you.", "The stones become your walls.", "The harvest comes from hard ground."],
      },
      {
        x: ["Your craft is turning friction into a living.", "Friction is your trade.", "You make your living from what pushes back."],
        y: ["Every rub sharpens you.", "Sparks fly and you warm your hands by them.", "Resistance pays your wages."],
      },
      {
        x: ["Hand a sculptor stubborn marble and you get a masterpiece.", "Stubborn stone in good hands becomes a statue.", "Give a carver hard wood and watch the grain come alive."],
        y: ["The marble here is your month.", "Your month is that stone.", "Your season is the block, and you hold the chisel."],
      },
    ],
    c: [
      TC<SeasonCtx>(DK, 0,
        ["Friction is where your force shows.", "Resistance is your stage.", "Push back and the world sees your strength."],
        ["Friction is tiring, and pauses are earned.", "Resistance wears on anyone, so take your breaks.", "Every pushback earns you a rest."]),
      TC<SeasonCtx>(DK, 1,
        ["You were made to take hold of your time.", "Grab your season by the collar.", "Your time is yours to steer."],
        ["You can take hold of your time a little at a time.", "Steer your season with small turns of the wheel.", "Your time bends to patience as well."]),
      TC<SeasonCtx>(DK, 2,
        ["Resistance is your material.", "Hard ground is your workshop.", "Every obstacle is lumber to build with."],
        ["Resistance is your material and patience is your tool.", "Hard ground yields to steady hands.", "Every obstacle softens under patience."]),
    ],
  },
};

/* The court. */

type GodCtx = { pl: string; G: string; reading: string; domain: string; ph: string };
const PH = <C extends { ph: string }>(c: C) => c.ph;

export const GOD: Tree<GodCtx> = {
  a: [
    {
      x: [
        ({ pl, G, reading }) => `Above your ${pl} sits ${G}, ${reading}.`,
        ({ pl, G, reading }) => `Over your ${pl} rides ${G}, ${reading}.`,
        ({ pl, G, reading }) => `Perched on your ${pl} is ${G}, ${reading}.`,
      ],
      y: ["Say hello.", "Give it a nod.", "It has been waiting to meet you."],
    },
    {
      x: [
        ({ pl, G, reading }) => `${G} stands over your ${pl}, ${reading}.`,
        ({ pl, G, reading }) => `${G} keeps watch on your ${pl}, ${reading}.`,
        ({ pl, G, reading }) => `${G} presides over your ${pl}, ${reading}.`,
      ],
      y: ["It takes the job seriously.", "It knows the place well.", "It has made itself at home there."],
    },
    {
      x: [
        ({ pl, G, reading }) => `Your ${pl} wears ${G} like a crown, ${reading}.`,
        ({ pl, G, reading }) => `Your ${pl} flies ${G} like a banner, ${reading}.`,
        ({ pl, G, reading }) => `Your ${pl} carries ${G} like a lantern, ${reading}.`,
      ],
      y: ["It suits you.", "It catches the eye.", "You can spot it from far away."],
    },
  ],
  b: [
    {
      x: [({ pl, domain }) => `Your ${pl} speaks for ${domain}.`, ({ domain }) => `This pillar keeps ${domain}.`, ({ domain }) => `${cap(domain)} is where this pillar walks its rounds.`],
      y: ["That is where this god rolls up its sleeves.", "Look for its fingerprints there.", "That is the stage where it does its best work."],
    },
    {
      x: [({ domain }) => `Its ground is ${domain}.`, ({ domain }) => `It does its work in ${domain}.`, ({ domain }) => `Its home field is ${domain}.`],
      y: ["There its influence gathers like weather over a valley.", "Clouds of it drift over that whole valley.", "Its weather settles there."],
    },
    {
      x: [({ domain }) => `Look for it in ${domain}.`, ({ domain }) => `Search for it in ${domain}.`, ({ domain }) => `You will find it in ${domain}.`],
      y: ["That is the part of your life this pillar keeps.", "That corner of your life is its to guard.", "That room of your house has its name on the door."],
    },
    {
      x: [({ domain }) => `This pillar holds ${domain}.`, ({ domain }) => `${cap(domain)} sits in this pillar's keeping.`, ({ domain }) => `This pillar was handed ${domain}.`],
      y: ["So the god paints that chapter of your story.", "The god holds the brush for those pages.", "That chapter carries the god's colours."],
    },
  ],
  c: [
    TC<GodCtx>(PH, 0,
      ["Its stem is yang, so it shows its hand openly. Meet it in kind.", "Its stem is yang and plays its cards face up. Play yours the same way.", "Its stem is yang, loud and plain. Answer it out loud."],
      ["Its stem is yin, so it works quietly from within. Meet it gently.", "Its stem is yin and keeps its cards close. Meet it softly.", "Its stem is yin, quiet and inward. Listen closely."]),
    TC<GodCtx>(PH, 1,
      ["Being yang, it moves outward and is easy to catch at work.", "Being yang, it works in daylight where you can watch.", "Being yang, it makes its moves in the open."],
      ["Being yin, it gathers inward and is felt before it is seen.", "Being yin, it works by lamplight, felt more than watched.", "Being yin, it moves under the surface like a slow current."]),
    TC<GodCtx>(PH, 2,
      ["A yang stem puts its strength out front.", "A yang stem leads with its strength.", "A yang stem shows its strength first."],
      ["A yin stem keeps its strength close and gives it with care.", "A yin stem holds its strength and hands it over gently.", "A yin stem saves its strength for the moment that needs it."]),
  ],
};

export const GOD_TWICE: Tree<{ G: string }> = {
  a: [
    {
      x: [({ G }) => `${G} shows up more than once among your pillars.`, ({ G }) => `${G} turns up in more than one of your pillars.`, ({ G }) => `${G} keeps coming back across your pillars.`],
      y: ["Notice that.", "That is no accident of the ink.", "It wants your attention."],
    },
    {
      x: [({ G }) => `${G} is written in more than one of your pillars.`, ({ G }) => `${G} is inked into your chart more than once.`, ({ G }) => `${G} signs its name in two places on your chart.`],
      y: ["Read it as a refrain.", "Your chart is repeating itself on purpose.", "Double ink means double weight."],
    },
    {
      x: [({ G }) => `${G} liked your chart so much it moved in twice.`, ({ G }) => `${G} rented two rooms in your house.`, ({ G }) => `${G} brought a second suitcase to your chart.`],
      y: ["Make it comfortable.", "It plans on staying.", "It is part of the family now."],
    },
  ],
  b: [
    {
      x: ["A god that repeats speaks twice in your life.", "When a god says it twice, it means it.", "Repetition is how your chart underlines things."],
      y: ["Listen for where it will be heard.", "Lean in, because this one is a theme.", "Follow it from room to room."],
    },
    {
      x: ["A god that repeats becomes a theme.", "Twice said is a theme.", "One god in two places makes a thread."],
      y: ["You can follow it through each ground it touches.", "Trace it through every room it enters.", "Pull the thread and see where it leads."],
    },
    {
      x: ["What your chart says twice, it wants you to hear.", "Your chart repeats only what matters.", "A chart that says something twice is raising its voice a little."],
      y: ["Turn your ear toward it.", "Give it a hearing.", "Hear it out."],
    },
    {
      x: ["Said twice, a god gathers weight across more than one part of your life.", "A doubled god spreads its weight across your life.", "Twice over, a god leans on more than one corner of your world."],
      y: ["It comes back around like a chorus.", "It returns like a favourite verse.", "It hums like a song stuck in your head, the good kind."],
    },
  ],
  c: [
    PC<{ G: string }>(
      ["Name the theme and work with it.", "Call the theme by name and put it to work.", "Give the theme a job."],
      ["Notice the theme and let it teach at its own pace.", "Watch the theme and let it teach you slowly.", "Let the theme school you gently."],
      ["It is on your side.", "It knows the way.", "It has been here before."]),
    PC<{ G: string }>(
      ["A theme can become your craft.", "Turn the theme into a trade.", "A refrain can become a signature."],
      ["A theme can become your companion.", "Let the theme walk beside you.", "A refrain can keep you company."],
      ["Keep it close.", "Make room for it.", "Welcome it in."]),
    PC<{ G: string }>(
      ["Where it sounds again, answer it.", "When it calls again, reply.", "Each time it shows up, meet it."],
      ["Where it sounds again, listen.", "When it calls again, hear it out.", "Each time it shows up, take note."],
      ["You will know it when you hear it.", "It is a familiar voice.", "You have heard it before."]),
  ],
};

/* The pillars in their grounds. */

type GroundCtx = { pl: string; S: string; sq: string; A: string; B: string; bq: string; domain: string; ph: string };

export const GROUND: Tree<GroundCtx> = {
  a: [
    {
      x: [
        ({ pl, S, sq }) => `Your ${pl} carries ${S} above, ${sq}.`,
        ({ pl, S, sq }) => `Your ${pl} lifts ${S} overhead, ${sq}.`,
        ({ pl, S, sq }) => `Your ${pl} holds ${S} up high, ${sq}.`,
      ],
      y: ["It is the first thing anyone sees.", "Wear it proudly.", "It catches the light."],
    },
    {
      x: [
        ({ pl, S, sq }) => `${S} crowns your ${pl}, ${sq}.`,
        ({ pl, S, sq }) => `${S} rides atop your ${pl}, ${sq}.`,
        ({ pl, S, sq }) => `${S} heads your ${pl}, ${sq}.`,
      ],
      y: ["That is the face this pillar turns toward the world.", "It greets the world first.", "It is the pillar's handshake."],
    },
    {
      x: [
        ({ pl, S, sq }) => `Up top in your ${pl}, ${S} holds court, ${sq}.`,
        ({ pl, S, sq }) => `High in your ${pl}, ${S} keeps the view, ${sq}.`,
        ({ pl, S, sq }) => `At the summit of your ${pl}, ${S} plants its flag, ${sq}.`,
      ],
      y: ["The view is good from there.", "It sees a long way.", "It enjoys the height."],
    },
  ],
  b: [
    {
      x: [
        ({ A, B, bq }) => `Beneath it is the ${A}, ${B}, ${bq}.`,
        ({ A, B, bq }) => `Below lies ${B}, the ${A}, ${bq}, the root the pillar stands on.`,
        ({ A, B, bq }) => `Under it waits ${B}, the ${A}, ${bq}.`,
      ],
      y: [({ domain }) => `Its ground is ${domain}.`, ({ domain }) => `This pillar keeps watch over ${domain}.`, ({ domain }) => `Here is where ${domain} takes root in you.`],
    },
    {
      x: [
        ({ A, B, bq }) => `Its root is the ${A}, ${B}, ${bq}.`,
        ({ A, B, bq }) => `The ${A} anchors it from below, ${B}, ${bq}.`,
        ({ A, B, bq }) => `Its footing is ${B}, the ${A}, ${bq}.`,
      ],
      y: [({ domain }) => `Its ground is ${domain}.`, ({ domain }) => `It tills the soil of ${domain}.`, ({ domain }) => `It stands guard over ${domain}.`],
    },
    {
      x: [
        ({ A, B, bq }) => `Dig down and you find ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `Lift the floorboards and there is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `Below the surface lives ${B}, the ${A}, ${bq}.`,
      ],
      y: [({ domain }) => `The soil there is ${domain}.`, ({ domain }) => `That soil grows ${domain}.`, ({ domain }) => `That earth belongs to ${domain}.`],
    },
    {
      x: [
        ({ A, B, bq }) => `The ${A} sleeps beneath it, ${B}, ${bq}.`,
        ({ A, B, bq }) => `The ${A} curls up underneath, ${B}, ${bq}.`,
        ({ A, B, bq }) => `The ${A} makes its den below, ${B}, ${bq}.`,
      ],
      y: [({ domain }) => `It keeps the lamps lit over ${domain}.`, ({ domain }) => `It keeps one eye open over ${domain}.`, ({ domain }) => `It guards the hearth of ${domain}.`],
    },
  ],
  c: [
    TC<GroundCtx>(PH, 0,
      ["This is ground to act in.", "This is a field for doing.", "This ground wants your boots on it."],
      ["This is ground to grow in.", "This is a field for slow growing.", "This ground wants your roots in it."]),
    TC<GroundCtx>(PH, 1,
      ["What happens here takes the shape of the hand that reaches in.", "This ground answers the hand that works it.", "Here the bold hand shapes the clay."],
      ["What happens here takes the shape of the care you give it over time.", "This ground answers patient care.", "Here the gentle hand shapes the clay."]),
    TC<GroundCtx>(PH, 2,
      ["Here your life builds outward.", "Here you raise walls and open doors.", "Here your life stretches its arms wide."],
      ["Here your life roots inward.", "Here you dig deep and settle.", "Here your life curls its roots around what matters."]),
  ],
};

export const DAY_GROUND: Tree<GroundCtx> = {
  a: [
    {
      x: [
        ({ pl, S }) => `Your ${pl} holds you, with ${S} standing above.`,
        ({ pl, S }) => `Your ${pl} is your own, and ${S} stands at its head.`,
        ({ pl, S }) => `Your ${pl} cradles you, with ${S} overhead.`,
      ],
      y: ["This is your seat.", "Make yourself comfortable.", "Welcome home."],
    },
    {
      x: [
        ({ pl, S }) => `You live in your ${pl}, and ${S} is your stem.`,
        ({ pl, S }) => `You make your home in your ${pl}, and ${S} is the stem you stand under.`,
        ({ pl, S }) => `You keep house in your ${pl}, with ${S} for a roof.`,
      ],
      y: ["The lights are on.", "The kettle is warm.", "The key fits your hand."],
    },
    {
      x: [
        ({ pl, S }) => `${S} sits at the top of your ${pl}.`,
        ({ pl, S }) => `${S} heads your ${pl}.`,
        ({ pl, S }) => `${S} caps your ${pl}.`,
      ],
      y: ["That is the pillar with your name on the door.", "Your name is on the mailbox.", "This pillar has your initials carved in it."],
    },
  ],
  b: [
    {
      x: [
        ({ A, B, bq }) => `Beneath it is the ${A}, ${B}, ${bq}.`,
        ({ A, B, bq }) => `Your branch is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `Under you lies the ${A}, ${B}, ${bq}.`,
      ],
      y: [
        "This seat is also the spouse's palace, the ground your closest companion stands on.",
        "This branch doubles as the spouse's palace, the room your nearest love walks into.",
        "Here is the spouse's palace, the porch where your closest companion takes off their shoes.",
      ],
    },
    {
      x: [
        ({ A, B, bq }) => `Below your Day Master is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `Underfoot is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `Just below you rests ${B}, the ${A}, ${bq}.`,
      ],
      y: [
        "Here stands the spouse's palace, the ground you share with your nearest companion.",
        "This is the spouse's palace, where two pairs of shoes sit by one door.",
        "The spouse's palace is here, a room built for two.",
      ],
    },
    {
      x: [
        ({ A, B, bq }) => `Its branch is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `The branch here is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `This pillar stands on ${B}, the ${A}, ${bq}.`,
      ],
      y: [
        "This branch is the spouse's palace, where love keeps a spare key.",
        "That branch is the spouse's palace, with a second cup by the kettle.",
        "That ground is the spouse's palace, with room on the bench for two.",
      ],
    },
    {
      x: [
        ({ A, B, bq }) => `The ${A} rests beneath you, ${B}, ${bq}.`,
        ({ A, B, bq }) => `The ${A} lies curled beneath you, ${B}, ${bq}.`,
        ({ A, B, bq }) => `The ${A} keeps your floor warm, ${B}, ${bq}.`,
      ],
      y: [
        "The spouse's palace sits right here, a guest room kept warm.",
        "Right here is the spouse's palace, the lamp left on in the window.",
        "Here waits the spouse's palace, a pillow fluffed for someone dear.",
      ],
    },
  ],
  c: [
    TC<GroundCtx>(PH, 0,
      ["Closeness here is yours to choose and claim.", "Love here is yours to reach for.", "Here you choose who comes close."],
      ["Closeness here is yours to welcome and keep warm.", "Love here is yours to receive.", "Here you open the door to who comes close."]),
    TC<GroundCtx>(PH, 1,
      ["This is the nearest ground in your chart, and you can build on it with intent.", "Nothing in your chart sits closer, so build on it boldly.", "This is your nearest ground, a good place to lay a foundation."],
      ["This is the nearest ground in your chart, kept open enough to share.", "Nothing in your chart sits closer, so leave room at the table.", "This is your nearest ground, soft enough for two."]),
    TC<GroundCtx>(PH, 2,
      ["You meet your companion here as one strength meets another.", "Here two strong people shake hands as equals.", "Here you meet your match, shoulder to shoulder."],
      ["You meet your companion here as one root meets another under the same soil.", "Here two roots twine under one patch of earth.", "Here you meet your match, roots touching in the dark."]),
  ],
};

/* The frame of the reading and of the room. */

export const READ_FROM: Tree<{ dm: string }> = {
  a: [
    {
      x: [({ dm }) => `Your Day Master is ${dm}.`, ({ dm }) => `Your Day Master goes by ${dm}.`, ({ dm }) => `Your Day Master answers to ${dm}.`],
      y: ["That is you.", "Remember the name.", "Nice to meet you."],
    },
    {
      x: [({ dm }) => `${dm} is your Day Master.`, ({ dm }) => `${dm} stands for you.`, ({ dm }) => `${dm} carries your name.`],
      y: ["It speaks in the first person.", "It holds your place.", "It is the heart of your reading."],
    },
    {
      x: [
        ({ dm }) => `${dm} takes the centre seat, your Day Master.`,
        ({ dm }) => `${dm} steps into the spotlight as your Day Master.`,
        ({ dm }) => `${dm} sits at the head of the table, your Day Master.`,
      ],
      y: ["It is the star of the show.", "The applause is yours.", "Everyone else takes their cue from it."],
    },
  ],
  b: [
    {
      x: ["Everything after this is said in relation to it.", "Every line that follows is measured from it.", "The rest of your reading orbits it."],
      y: ["Think of it as the sun of your little solar system.", "It is the north star you steer by.", "Keep it in view like a lighthouse."],
    },
    {
      x: ["The rest of the reading turns around it.", "What follows spins around it.", "Every line below circles it."],
      y: ["It turns like a record on a spindle.", "Picture a carousel with you as the pole.", "It is the axle of the wheel."],
    },
    {
      x: ["What follows is heard from where it stands.", "Everything below is spoken from its seat.", "The lines ahead take its point of view."],
      y: ["Stand there and listen.", "Pull up a chair beside it.", "It has the best seat in the house."],
    },
    {
      x: ["Everything below is sung in its key.", "The rest of your reading is tuned to it.", "Every line ahead takes its pitch."],
      y: ["Hum along.", "It is your tuning fork.", "Sing it in your own voice."],
    },
  ],
  c: [
    PC<{ dm: string }>(["Begin from there.", "Start there.", "Set out from there."], ["Rest there first.", "Settle there before anything else.", "Breathe there first."], ["It is home base.", "It is where your story starts.", "It is your first step."]),
    PC<{ dm: string }>(["Hold that centre.", "Keep that centre strong.", "Stand firm in that centre."], ["That centre is steady enough to lean on.", "That centre will hold you.", "That centre bears your weight."], ["It is solid.", "It does not wobble.", "It holds."]),
    PC<{ dm: string }>(["It is your place to stand.", "That is your ground.", "That is your stance."], ["It is your place to come home to.", "That is your harbour.", "That is your hearth."], ["Know it well.", "Love it well.", "Return to it often."]),
  ],
};

type None2 = Record<string, never>;

export const RESTS: Tree<None2> = {
  a: [
    { x: ["Here your reading rests.", "Here your reading settles.", "Here your reading takes a breath."], y: ["Stay a moment.", "Sit with it.", "Let it land."] },
    { x: ["Your reading stops here.", "Your reading pauses here.", "Your reading comes to a close here."], y: ["The page is full.", "The last line is written.", "Every word is in place."] },
    {
      x: [
        "Here your reading sets down its brush.",
        "At this point your reading wipes its brush clean.",
        "Now your reading lays the brush across the inkstone.",
      ],
      y: ["It pours itself a cup of tea.", "It stretches its fingers.", "It leans back and admires the page."],
    },
  ],
  b: [
    {
      x: [
        "The ground is named, the season is named and the court is named.",
        "Ground, season and court each have their names now.",
        "Your pillars have their grounds, your self has its season and your gods have their places.",
      ],
      y: ["The ink is drying.", "Every lantern on the path is lit.", "The scroll is full and the ink is still warm."],
    },
    {
      x: ["The pillars have their grounds, the self has its season and the gods have their places.", "Grounds, season and gods are all seated.", "Every pillar, season and god has found its chair."],
      y: ["Every guest is seated.", "Nobody is left standing.", "The table is full."],
    },
    {
      x: ["Ground, season and court have each been given their names.", "Each part of your chart has been named.", "Every piece of your chart has its name now."],
      y: ["It was like a naming feast for children.", "Names are gifts, and these are yours.", "Each name is a small blessing."],
    },
    {
      x: ["Everything nameable has been named.", "All that can be named has its name.", "The naming is done."],
      y: ["The scroll is full.", "The scroll is rolled and tied.", "The last seal is pressed."],
    },
  ],
  c: [
    PC<None2>(
      ["What you make of them belongs to you, and the making is your own.", "What you build from here is your own work.", "The making from here on is yours."],
      ["What you make of them belongs to you, in your own time.", "What you build from here can come slowly.", "The making from here on can wait for you."],
      ["Enjoy it.", "Take your time.", "Make it beautiful."]),
    PC<None2>(
      ["The rest is lived, so it is left unwritten.", "The rest happens off the page.", "The rest is for living."],
      ["The rest is unwritten, and it is yours to write.", "The rest waits on a blank page for you.", "The rest is a page left open for you."],
      ["Go gently.", "Go well.", "Go with joy."]),
    PC<None2>(
      ["From here you take the brush.", "The brush is in your hand now.", "Pick up the brush."],
      ["From here the brush passes gently to you.", "The brush is offered to you now.", "The brush rests within your reach."],
      ["Paint boldly.", "Paint freely.", "Paint your own way."]),
  ],
};

export const STONE_INTRO: Tree<None2> = {
  a: [
    {
      x: ["One true chart, set at the centre of the house for you.", "One true chart, placed at the heart of the house for you.", "One true chart, waiting at the centre of the house for you."],
      y: ["It is yours.", "It has your name on it.", "It has been waiting."],
    },
    {
      x: ["Here is the house's true chart, kept at its centre and kept for you.", "Here lies the house's true chart, held at its centre for you.", "Here rests the house's true chart, guarded at its centre for you."],
      y: ["Come close.", "Lean in.", "Take a look."],
    },
    {
      x: ["At the centre of the house, a true chart sits like a lantern on the table.", "In the middle of the house a true chart glows like a candle.", "At the heart of the house a true chart burns like a hearth fire."],
      y: ["Warm your hands.", "It lights the room.", "Sit beside it."],
    },
  ],
  b: [
    {
      x: ["It is the same life read in every script the hall keeps.", "Every scroll in the hall reads the same life here.", "Each script the hall keeps is read against it."],
      y: ["In the end the scripts become one reading.", "Like streams meeting a river, the scrolls run into one reading.", "The voices harmonise until you hear one song."],
    },
    {
      x: ["All the hall's scripts point at this one life.", "Every script in the hall aims at this one life.", "Each scroll in the hall turns toward this one life."],
      y: ["Here they braid into one rope.", "Here they twist into one strong cord.", "Here they weave into one cloth."],
    },
    {
      x: ["Each script the hall keeps is laid beside it.", "The hall lays every script next to it.", "Every scroll in the hall gets set down beside it."],
      y: ["The scripts meet like old friends at one table.", "They greet each other like cousins at a reunion.", "They pull up chairs and talk late into the night."],
    },
    {
      x: ["Every scroll in the hall leans in to read this one life.", "All the scrolls in the hall bend close over this one life.", "The whole hall's scrolls gather round this one life."],
      y: ["The readings become one.", "Their voices blend.", "They finish each other's sentences."],
    },
  ],
  c: [
    PC<None2>(
      ["Come back to it whenever you have something to ask.", "Return whenever a question tugs at you.", "Bring your questions here."],
      ["Come back to it whenever you have something to sit with.", "Return whenever something needs quiet company.", "Bring what weighs on you here."],
      ["It will be here.", "The door stays open.", "It keeps a seat for you."]),
    PC<None2>(
      ["Each return reads it from a new angle.", "Every visit turns it a little.", "Each time you look, you see a new side."],
      ["Each return finds it in a new light.", "Every visit shows it a new glow.", "Each time you look, the light has shifted."],
      ["That is part of the joy.", "Keep looking.", "It never gets old."]),
    PC<None2>(
      ["It is the place to start, and the place to come back to.", "Start here, and circle back here.", "Here is your starting line and your finish line."],
      ["It is a place to rest your eyes, and to come back to.", "Rest your eyes here, then come back.", "Here is a bench to sit on whenever you return."],
      ["Welcome.", "Welcome back.", "Make yourself at home."]),
  ],
};
