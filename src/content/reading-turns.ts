/**
 * The Destiny Chart's reading, said a different way each time it is opened.
 *
 * Every phrase that used to repeat word for word is a small tree, in the
 * shape the owner asked for on 13 November 2026: the phrase gets three
 * variations of its opening (a), each of those four of its middle (b), each
 * of those three of its close (c), and each close is written twice, once in
 * a Yang voice and once in a Yin voice. That is 3 x 4 x 3 x 2 = 72 ways to
 * say each phrase.
 *
 * The first middle (b1) is never said the same way twice in a cycle (the
 * owner, 13 November 2026: "B1 is beautiful, but I'll never want to see it
 * twice"). It is two halves, three of each, and every time b1 comes round
 * it takes the next of the nine pairs, so both halves move almost every time.
 *
 * The reading speaks to the reader, warmly and in the second person, and
 * wherever it names a phase it tends that phase (TEND). It never cites a
 * tradition, never hedges with "tends to" and never says "this chart".
 *
 * The facts never move between variations: the sign, the phase, the count,
 * the relation and the ground are in every leaf. Only the saying changes.
 * Nothing here foretells a particular event.
 */

export type YinYang = "yin" | "yang";
type Seg<C> = (c: C) => string;
/** b1, said as one of nine pairs of halves. */
export interface Pool<C> {
  x: [Seg<C>, Seg<C>, Seg<C>];
  y: [Seg<C>, Seg<C>, Seg<C>];
}
export interface Tree<C> {
  a: [Seg<C>, Seg<C>, Seg<C>];
  b: [Pool<C>, Seg<C>, Seg<C>, Seg<C>];
  c: [{ yang: Seg<C>; yin: Seg<C> }, { yang: Seg<C>; yin: Seg<C> }, { yang: Seg<C>; yin: Seg<C> }];
}

/** Turns before any one phrase repeats for a chart of one voice. */
export const TURN_CYCLE = 36;

/** The j-th of b1's nine pairs. Consecutive j never share a half, except at the wrap. */
function b1At<C>(p: Pool<C>, ctx: C, j: number): string {
  const n = ((j % 9) + 9) % 9;
  return `${p.x[n % 3](ctx)} ${p.y[(n + Math.floor(n / 3)) % 3](ctx)}`;
}

/** All nine ways b1 is said, for tests and the review file. */
export function b1Forms<C>(t: Tree<C>, ctx: C): string[] {
  return Array.from({ length: 9 }, (_, j) => b1At(t.b[0], ctx, j));
}

function middle<C>(t: Tree<C>, ctx: C, i: number): string {
  const k = ((i % 4) + 4) % 4;
  return k === 0 ? b1At(t.b[0], ctx, Math.floor(i / 4)) : (t.b[k] as Seg<C>)(ctx);
}

/**
 * Pick one leaf. `turn` moves once per reading opened; `salt` keeps two
 * lines of one kind in the same reading (the three god lines, the three
 * pillar lines) on different branches. Every turn changes a, b and c at
 * once, and all 36 leaves of one voice come before any repeats.
 */
export function say<C>(t: Tree<C>, ctx: C, yy: YinYang, turn = 0, salt = 0): string {
  const i = turn + salt;
  const a = t.a[((i % 3) + 3) % 3];
  const c = t.c[(((i + Math.floor(turn / 12)) % 3) + 3) % 3][yy];
  return `${a(ctx)} ${middle(t, ctx, i)} ${c(ctx)}`;
}

/** Every leaf of a tree, for tests and the review file (b1 in its first form). */
export function leaves<C>(t: Tree<C>, ctx: C): string[] {
  const out: string[] = [];
  for (const a of t.a) for (let k = 0; k < 4; k++) for (const c of t.c) for (const yy of ["yang", "yin"] as const) {
    const b = k === 0 ? b1At(t.b[0], ctx, 0) : (t.b[k] as Seg<C>)(ctx);
    out.push(`${a(ctx)} ${b} ${c[yy](ctx)}`);
  }
  return out;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lc = (s: string) => s.toLowerCase();
const WORD = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight"];

type PhaseKey = "wood" | "fire" | "earth" | "metal" | "water";

/** A small act of care for each phase, said to the reader. */
export const TEND: Record<PhaseKey, [string, string, string]> = {
  wood: ["water your wood and give its branches room", "keep your green things in the sun", "let your wood grow a ring a year and call that progress"],
  fire: ["keep your fire fed and your door open", "guard your flame from every draft", "let your fire be seen and let it warm someone"],
  earth: ["keep your earth turned and your pantry stocked", "plant your earth slowly and trust the harvest", "let your ground settle before you build on it"],
  metal: ["keep your metal oiled and your bell polished", "hone your edge until it rings true", "let your metal shine on what you finish"],
  water: ["keep your water clean and moving", "give your water a quiet basin to rest in", "let your river find its own way to the sea"],
};
const tend = (k: string, j: number) => TEND[k as PhaseKey][j];

/* What each phase is, said for a chart heavy in it, without it, or holding it once. */

type Lore = { x: [string, string, string]; y: [string, string, string]; b: [string, string, string] };
export const LORE: Record<PhaseKey, { heavy: Lore; absent: Lore; once: Lore }> = {
  wood: {
    heavy: {
      x: [
        "Wood is spring itself, the green push from root toward light, and its virtue is benevolence.",
        "Wood is the season of sap and first leaves, a kindness that keeps reaching for the sun.",
        "Wood is spring with its sleeves rolled up, benevolence in a hurry to bloom.",
      ],
      y: [
        "Where it gathers in you, your life leans toward growing, beginning and making room for whatever is still becoming.",
        "With this much of it in your roots, you were built to start things, shelter things and grow them tall, so give your branches room.",
        "All that green makes you a gardener of beginnings, and every seed you plant deserves your watering can.",
      ],
      b: [
        "Picture the east wind at dawn whistling through new leaves, and you have your temperament in one breeze. Reach, branch out and keep living things in view.",
        "Wood bends and comes back, and it grows toward what it needs. So much of it gives you the patience of a tree and its stubborn hunger for height, so keep your roots watered.",
        "In wood the year is young and everything is still possible. You carry that youth a long way, the urge to start, to shelter and to grow, and it is yours to keep green.",
      ],
    },
    absent: {
      x: [
        "Wood is the spring of things, the push to begin and the benevolence that makes room for others to grow.",
        "Wood is the green shoot that breaks the frost, kindness with a taproot.",
        "Wood is the season that says yes before it knows how, generous and growing.",
      ],
      y: [
        "You may find that green urge in the people and the years around you, and you can plant a little of it on purpose.",
        "Your spring may come from a friend, a teacher or a decade that carries it, so keep a window open and a pot of soil on the sill.",
        "When it arrives, water it like a seedling you waited all winter for.",
      ],
      b: [
        "Your chart has no east wind of its own, no sap rising in early spring. Borrow the breeze from good company, and tend whatever starts to sprout.",
        "Wood grows toward light and keeps reaching. Learn the reach, and you will grow with a gardener's care.",
        "Benevolence is the virtue of wood, the kindness that lets living things flourish. Walk toward that kindness on purpose and you grow your own spring.",
      ],
    },
    once: {
      x: [
        "That one character carries all of your spring, its will to begin and its kindness toward what is growing.",
        "One green shoot holds the whole of wood for you.",
        "Your wood lives in a single seedling, small, stubborn and full of spring.",
      ],
      y: [
        "Every new start draws on that same small root, so water it often.",
        "Treat it like the last tomato plant on the balcony and it will feed you all summer.",
        "Give it sun and room, and it becomes your doorway to beginnings.",
      ],
      b: [
        "Wood is reaching and renewal, and for you it lives in one place. That place is your doorway to beginnings, so keep it propped open.",
        "Benevolence, the virtue of wood, rests on one character for you, and it is the more precious for being alone. Shelter it like a sapling in a windy yard.",
        "Like a lone sprout pushing through pavement, your wood is small and unstoppable. Give it a little water and watch it work.",
      ],
    },
  },
  fire: {
    heavy: {
      x: [
        "Fire is summer, the noon of the year, and its virtue is propriety, the grace of giving each thing its place in the light.",
        "Fire is high summer with the music turned up, warmth with impeccable manners.",
        "Fire is the sun at noon setting the table, bright, gracious and impossible to ignore.",
      ],
      y: [
        "Where it gathers in you, your life burns bright, warms whatever it touches and is hard to overlook.",
        "With this much flame in your chart you light up rooms without trying, so keep the hearth fed and let someone warm their hands.",
        "So much fire makes you the host the party orbits, and the kindest thing you can do for that flame is give it something worth celebrating.",
      ],
      b: [
        "Picture the south at midday, everything in flower and in full view, and that is your weather. Let yourself be seen, and keep good company close to the heat.",
        "Fire rises, spreads and shows what was hidden. So much of it gives you brilliance, a quick heat and a knack for the ceremony that makes a gathering whole, so guard the flame from every draft.",
        "In fire the year stands at its height and holds nothing back. You carry that fullness, the urge to shine, to celebrate and to light the way, and your light grows when you share it.",
      ],
    },
    absent: {
      x: [
        "Fire is summer and the bloom, the warmth that draws people close and the propriety that honours them once they come.",
        "Fire is the porch light left on, the welcome that knows every guest by name.",
        "Fire is noon in a bottle, bright and courteous and warm to the touch.",
      ],
      y: [
        "You may find that warmth in the people and seasons around you, and you can strike a match of your own.",
        "Brightness may arrive through company, a calling or a warm decade, so keep the kindling dry.",
        "When someone brings the spark, cup your hands around it.",
      ],
      b: [
        "Your chart has no high sun of its own to show itself by. Borrow the noon from the people who light you up, and tend that glow like a candle in a window.",
        "A light you strike yourself is a light you know how to keep. Strike it on purpose, then guard it from every draft.",
        "Propriety is the virtue of fire, the courtesy that gives every guest a place at the table. Set that table yourself, and the warmth comes to sit with you.",
      ],
    },
    once: {
      x: [
        "That one character holds all of your summer, its warmth, its brightness and its sense of occasion.",
        "One flame carries the whole of fire for you.",
        "Your fire burns in a single lantern, small, golden and very much alive.",
      ],
      y: [
        "Every moment of being seen draws on that same small light, so keep it fed.",
        "Think of it as the only candle on the cake, the one everyone leans in to see, and make a wish worth it.",
        "Shield it from the wind and it will light your whole house.",
      ],
      b: [
        "Fire is radiance and gathering, and for you it lives in one place. That place is your hearth, so keep it swept and the kettle on.",
        "Propriety, the virtue of fire, rests on one character for you, and its light is the more precious for being alone. Cup your hands around it.",
        "Like the last match in a cold cabin, your fire matters more than its size. Strike it when it counts.",
      ],
    },
  },
  earth: {
    heavy: {
      x: [
        "Earth is the turning between the seasons, the centre every other phase passes through, and its virtue is trust.",
        "Earth is the ground everyone else stands on, trust you can build a house on.",
        "Earth is the hearth of the compass, holding north, south, east and west at one table.",
      ],
      y: [
        "Where it gathers in you, your life becomes ground for others, steady, receiving and slow to be moved.",
        "With this much soil in your chart, people come home to you, so keep the pantry stocked and the kettle warm.",
        "So much earth gives you a gift for making things last, and the best way to honour it is to plant slowly and trust the harvest.",
      ],
      b: [
        "Picture the centre of the compass holding the four directions together, and you have your gravity. Keep, carry and be the place others return to, and let yourself be returned to as well.",
        "Earth receives the seed and the rain alike and turns them into harvest. So much of it gives you deep patience, so keep the soil turned and fed.",
        "In earth each season rests before the next begins. You carry that rest inside you, the urge to hold, to keep faith and to tend, and the first field to tend is your own.",
      ],
    },
    absent: {
      x: [
        "Earth is the centre and the turning of the seasons, the trust that lets anything be built at all.",
        "Earth is the floor under the dance, the promise that holds weight.",
        "Earth is the kitchen table of the five phases, where everything sits down together.",
      ],
      y: [
        "You may find your steady ground in the people and places you come to belong to, so put down roots where the soil is kind.",
        "Steadiness may be borrowed from a home, a practice or a decade that settles, so make your bed somewhere you can trust.",
        "When good ground finds you, plant something in it.",
      ],
      b: [
        "Your chart has no centre of its own to stand on, which leaves you free to choose your floor. Pick ground that holds and tend it like a garden bed.",
        "Ground you make by hand is ground you know in every corner. Lay it stone by stone and it will hold you.",
        "Trust is the virtue of earth, the faith kept between people over time. Build it promise by promise and you will have a field of your own.",
      ],
    },
    once: {
      x: [
        "That one character holds all of your centre, its patience and its power to keep faith.",
        "One patch of ground carries the whole of earth for you.",
        "Your earth sits in a single clay pot, humble, sturdy and holding everything.",
      ],
      y: [
        "Every need for steadiness returns to that same small field, so keep it tilled.",
        "Treat it like the one good chair in the house and sit there when the world spins.",
        "Keep it watered and it becomes your still point.",
      ],
      b: [
        "Earth is holding and harvest, and for you it lives in one place. That place is your still point, so give it a quiet hour.",
        "Trust, the virtue of earth, rests on one character for you, and it is the more precious for being alone. Keep it like a seed saved for spring.",
        "Like a single stepping stone across a river, your earth carries more than it looks. Step on it with confidence.",
      ],
    },
  },
  metal: {
    heavy: {
      x: [
        "Metal is autumn, the season of harvest and of the blade, and its virtue is righteousness, the sense of what is owed and what is just.",
        "Metal is autumn sharpening its knives, justice with a polish on it.",
        "Metal is the bell, the blade and the harvest moon, clean, clear and fair.",
      ],
      y: [
        "Where it gathers in you, your life cuts clean, holds a line and knows what to keep and what to let fall.",
        "With this much metal in your chart you can tell gold from gilt at a glance, so keep the edge honed and the conscience clear.",
        "So much metal makes you a finisher, and the finest care for a blade is to use it on something that deserves it.",
      ],
      b: [
        "Picture the west wind at dusk and a bell struck once in clear air, and that is your music. Let it ring, and keep it polished.",
        "Metal is refined in the fire and keeps its edge. So much of it gives you resolve, a love of what is true and a courage for endings, so oil the blade and let it gleam.",
        "In metal the year gathers its harvest and lets the leaves go. You carry that discernment, the urge to judge well, to release and to stand by your word, and your word grows brighter with use.",
      ],
    },
    absent: {
      x: [
        "Metal is autumn and the clean cut, the righteousness that knows what is just.",
        "Metal is the scissors in the sewing kit, the one tool that finishes the dress.",
        "Metal is a bell that rings true and a blade that knows when to stop.",
      ],
      y: [
        "You may find your edge in the people and seasons that ask you to choose, so keep a whetstone handy.",
        "Decisiveness may arrive through a mentor, a hard season or a decade that sharpens, so welcome the grindstone.",
        "When the edge arrives, keep it bright.",
      ],
      b: [
        "Your chart has no blade of its own, no west wind to strip the branch. Borrow a clean cut from someone you trust, then hone it into your own.",
        "A line drawn with care is a fence the wind respects. Draw yours slowly and polish it.",
        "Righteousness is the virtue of metal, the courage to do what is owed. Practise it in small things first, like tuning a bell one note at a time.",
      ],
    },
    once: {
      x: [
        "That one character holds all of your autumn, its edge, its principle and its gift for letting go.",
        "One blade carries the whole of metal for you.",
        "Your metal rings from a single bell, small, bright and true.",
      ],
      y: [
        "Every hard choice draws on that same small edge, so keep it honed.",
        "Treat it like a good pocketknife and it will cut the knot every time.",
        "Polish it and it becomes your conscience.",
      ],
      b: [
        "Metal is clarity and harvest, and for you it lives in one place. That place is your conscience, so keep it polished.",
        "Righteousness, the virtue of metal, rests on one character for you, and it is the more precious for being alone. Keep it like your grandmother's silver.",
        "Like a lone tuning fork in a noisy room, your metal sets the note for everything else. Strike it clean.",
      ],
    },
  },
  water: {
    heavy: {
      x: [
        "Water is winter, the deep stillness where the year keeps its seed, and its virtue is wisdom.",
        "Water is midnight with its eyes open, wisdom that can hold its breath a long time.",
        "Water is the deep well of the five, cool, dark and full of stars.",
      ],
      y: [
        "Where it gathers in you, your life runs deep, listens long and finds its way around whatever stands in it.",
        "With this much water in your chart you read the room before you walk in, so keep the well clean and the current moving.",
        "So much water makes you a river with a long memory, and the kindest thing you can do for it is let it rest in a quiet basin.",
      ],
      b: [
        "Picture the north at midnight, dark, quiet and full of what has not yet surfaced, and that is your weather. Dive for what is hidden and come back with pearls.",
        "Water takes the shape of any vessel and wears down stone in its own time. So much of it gives you adaptability, memory and a patience that outlasts force, so let the river find its own way to the sea.",
        "In water the year rests and gathers itself for spring. You carry that inwardness, the urge to understand, to store and to move when the current is right, so keep the reservoir full.",
      ],
    },
    absent: {
      x: [
        "Water is winter and the deep, the wisdom that waits and listens.",
        "Water is the still pond that holds the moon.",
        "Water is a long, slow river of knowing.",
      ],
      y: [
        "You may find your depth in the people and seasons that slow you down, so let them.",
        "Reflection may arrive through a teacher, a long winter or a decade that turns inward, so set out a bowl to catch the rain.",
        "When the rain comes, drink it slowly.",
      ],
      b: [
        "Your chart has no midnight of its own, no still pool to look into. Borrow the quiet from a friend who listens, and keep a cup of it by the bed.",
        "Stillness that is learned runs as deep as stillness that is born. Sit with what you cannot yet see, and let the water clear.",
        "Wisdom is the virtue of water, the knowing that comes from patience. Give it time, like a spring filling a well drop by drop.",
      ],
    },
    once: {
      x: [
        "That one character holds all of your winter, its depth, its memory and its quiet wisdom.",
        "One spring carries the whole of water for you.",
        "Your water rises from a single spring, cool, clear and patient.",
      ],
      y: [
        "Every need for stillness returns to that same small well, so keep it clean.",
        "Treat it like a canteen on a long hike and sip with gratitude.",
        "Cover it from the dust and it becomes your well of wisdom.",
      ],
      b: [
        "Water is depth and flow, and for you it lives in one place. That place is your well, so lower the bucket gently.",
        "Wisdom, the virtue of water, rests on one character for you, and it is the more precious for being alone. Keep it like a single pearl in a quiet shell.",
        "Like the one spring in a dry valley, your water draws every traveller. Keep it running clear.",
      ],
    },
  },
};

const loreOf = (k: string) => LORE[k as PhaseKey];
type K = { k: string };
const loreB = (kind: "heavy" | "absent" | "once"): Tree<K>["b"] => {
  const x = (j: number) => ({ k }: K) => loreOf(k)[kind].x[j];
  const y = (j: number) => ({ k }: K) => loreOf(k)[kind].y[j];
  const b = (j: number) => ({ k }: K) => loreOf(k)[kind].b[j];
  return [{ x: [x(0), x(1), x(2)], y: [y(0), y(1), y(2)] }, b(0), b(1), b(2)];
};
const share = (n: number) => (n >= 8 ? "all eight" : `${WORD[n]} of the eight`);

/* The five phases. */

export const HEAVY: Tree<{ P: string; n: number; k: string }> = {
  a: [
    ({ P, n }) => `${P} is the heaviest phase in your chart, holding ${share(n)} characters.`,
    ({ P, n }) => `Of the five phases, ${lc(P)} pulls the most weight for you, with ${share(n)} characters its own.`,
    ({ P, n }) => `${P} walked into your chart, counted the eight seats and kept ${share(n)} for itself.`,
  ],
  b: loreB("heavy"),
  c: [
    {
      yang: ({ k }) => `Your heaviest phase is your native tongue, so speak it loud and on purpose, and ${tend(k, 0)}.`,
      yin: ({ k }) => `Your heaviest phase is your native tongue, and there is ease in speaking it softly, so ${tend(k, 0)}.`,
    },
    {
      yang: ({ k }) => `A full quiver is a gift once you aim it, so pick your targets and ${tend(k, 1)}.`,
      yin: ({ k }) => `A full harvest feeds more people when it is shared, so set the table wide and ${tend(k, 1)}.`,
    },
    {
      yang: ({ k }) => `Your strength lives where your chart is heaviest, so make it the first tool you reach for and ${tend(k, 2)}.`,
      yin: ({ k }) => `Your strength lives where your chart is heaviest, so make it a home to come back to and ${tend(k, 2)}.`,
    },
  ],
};

export const ABSENT: Tree<{ L: string; k: string }> = {
  a: [
    ({ L }) => `${L} skipped the party when your eight characters gathered.`,
    ({ L }) => `None of your eight characters belongs to ${lc(L)}.`,
    ({ L }) => `Your eight characters sat down without ${lc(L)}, and its chair at the table waits for you to fill it.`,
  ],
  b: loreB("absent"),
  c: [
    {
      yang: ({ L, k }) => `Think of ${lc(L)} as a guest you go out and invite, and once it comes, ${tend(k, 0)}.`,
      yin: ({ L, k }) => `Think of ${lc(L)} as a guest you welcome in, and once it settles, ${tend(k, 0)}.`,
    },
    {
      yang: ({ k }) => `What your birth left out, your luck pillars and your company can bring, so go looking and ${tend(k, 1)}.`,
      yin: ({ k }) => `What your birth left out, your luck pillars and your company can bring, so let them in and ${tend(k, 1)}.`,
    },
    {
      yang: ({ k }) => `An empty room is room to build, so pick up the hammer and ${tend(k, 2)}.`,
      yin: ({ k }) => `An empty room is a space kept open, so dust the shelf and ${tend(k, 2)}.`,
    },
  ],
};

export const ONCE: Tree<{ L: string; k: string }> = {
  a: [
    ({ L }) => `${L} shows up only once in your chart.`,
    ({ L }) => `${L} is written a single time among your eight.`,
    ({ L }) => `${L} came to your chart as a soloist, one voice and no backup singers.`,
  ],
  b: loreB("once"),
  c: [
    {
      yang: ({ k }) => `A single note rings clearest when you strike it with intent, so ${tend(k, 0)}.`,
      yin: ({ k }) => `A single note is easy to protect and worth protecting, so ${tend(k, 0)}.`,
    },
    {
      yang: ({ k }) => `Where a thing is scarce, each use of it counts double, so spend it well and ${tend(k, 1)}.`,
      yin: ({ k }) => `Scarcity makes a thing precious, so keep it close and ${tend(k, 1)}.`,
    },
    {
      yang: ({ k }) => `Lean on it knowingly and it will hold its line, so ${tend(k, 2)}.`,
      yin: ({ k }) => `Care for it and it will carry more than its size suggests, so ${tend(k, 2)}.`,
    },
  ],
};

export const ALL_FIVE: Tree<Record<string, never>> = {
  a: [
    () => "All five phases showed up for you.",
    () => "Every one of the five phases is written somewhere in your chart.",
    () => "Your chart was dealt a full hand, wood, fire, earth, metal and water, every suit in the deck.",
  ],
  b: [
    {
      x: [
        () => "Your chart is a house with every tool hanging somewhere on its walls.",
        () => "Your chart is a kitchen with every spice on the rack.",
        () => "Your chart is a band with every instrument in the room.",
      ],
      y: [
        () => "Keep each one oiled, because any season may knock.",
        () => "Love them all a little, the green, the flame, the soil, the blade and the deep.",
        () => "Give each a turn in your hands and they will all learn your grip.",
      ],
    },
    () => "Wood feeds fire, fire leaves earth behind it, earth bears metal, metal carries water and water feeds wood again, and in your chart that whole round can turn. Keep the wheel greased.",
    () => "Wood, Fire, Earth, Metal and Water each have a place to stand in you, and each can hand its strength to the next like a relay baton.",
    () => "The round of generating and overcoming can turn in you without a gap, every phase fed by one and checked by another, a dinner party where nobody goes hungry.",
  ],
  c: [
    {
      yang: () => "The question is which tool your hand reaches for first, and the hand is yours to steer.",
      yin: () => "The question is which tool your hand reaches for first, and there is time to learn the weight of each.",
    },
    {
      yang: () => "Range like this is a superpower once you aim it.",
      yin: () => "Range like this lets you meet any season with something already in your hands.",
    },
    {
      yang: () => "Balance is ground to leap from.",
      yin: () => "Balance is ground to rest on, and to come home to.",
    },
  ],
};

/* The self and its season. */

export const DAY_MASTER: Tree<{ dm: string; yy: string; p: string; q: string }> = {
  a: [
    ({ dm, yy, p }) => `Your Day Master is ${dm}, the ${yy} face of ${p}, and it stands for you.`,
    ({ dm, yy, p }) => `At the centre of your chart stands ${dm}, ${yy} ${p}, the character that holds your name.`,
    ({ dm, yy, p }) => `Out of all eight characters, one is cast as you, and it is ${dm}, ${yy} ${p}, with the other seven as your entourage.`,
  ],
  b: [
    {
      x: [({ q }) => `Its image is ${q}.`, ({ q }) => `Picture ${q}.`, ({ q }) => `Your emblem is ${q}.`],
      y: [
        () => "Hold that picture and your whole temperament comes into view.",
        () => "Paint it on your coat of arms and wear it well.",
        () => "Come back to that image whenever you forget who is holding the brush.",
      ],
    },
    ({ q }) => `Imagine ${q} with your name carved into it, and the picture holds your whole temperament.`,
    ({ q }) => `Picture ${q}, and the nature of your self walks into the room.`,
    ({ q }) => `Keep ${q} in your mind's eye, an image worth returning to like an old friend.`,
  ],
  c: [
    {
      yang: ({ p }) => `A yang stem meets the world outward and in the open, so the world knows you by what you do, and the best fuel for that is to ${tend(p, 0)}.`,
      yin: ({ p }) => `A yin stem meets the world inward and with care, so the world knows you by what you tend, and the first thing to tend is you, so ${tend(p, 0)}.`,
    },
    {
      yang: ({ p }) => `Yang is the breath out, and you lead, move first and put your force where it can be seen, so ${tend(p, 1)}.`,
      yin: ({ p }) => `Yin is the breath in, and you gather, absorb and move when the moment ripens, so ${tend(p, 1)}.`,
    },
    {
      yang: ({ p }) => `Your yang nature keeps your strength in plain view as your first instrument, so ${tend(p, 2)}.`,
      yin: ({ p }) => `Your yin nature keeps your strength close as your first gift, so ${tend(p, 2)}.`,
    },
  ],
};

type SeasonCtx = { m: string; mph: string; dph: string; decree: string; dk: string };

export const SEASON: Record<"same" | "fed" | "pours" | "pressed" | "masters", Tree<SeasonCtx>> = {
  same: {
    a: [
      ({ m, mph }) => `Born in ${m}, the month of ${mph}, your Day Master stands in its own season.`,
      ({ m, mph }) => `Your month branch is ${m}, a month of ${mph}, and the month is the climate you were born into. Here that climate is your Day Master's own phase.`,
      ({ m, mph }) => `${m} gives your chart its season, and that season is ${mph}, the same phase as your Day Master. You were born on home turf.`,
    ],
    b: [
      {
        x: [
          ({ decree }) => `This is called command of ${decree}.`,
          ({ decree }) => `Its name is command of ${decree}.`,
          ({ decree }) => `You were handed command of ${decree}.`,
        ],
        y: [
          () => "Your self is rooted and drinks from the very ground it was planted in.",
          () => "Your roots reach straight into your own soil, and the soil is glad to have you.",
          () => "Think of a fish born in the right river, swimming with every current at its back.",
        ],
      },
      ({ decree }) => `Command of ${decree} is the fullest support a season gives, and your roots run deep in it.`,
      ({ decree }) => `To be born in your own season is command of ${decree}, a home field advantage written into the calendar.`,
      ({ decree }) => `Command of ${decree} means the month itself lends you its strength, like a tailwind you never had to ask for.`,
    ],
    c: [
      { yang: ({ dk }) => `A rooted self can afford to push, so ${tend(dk, 0)}.`, yin: ({ dk }) => `A rooted self can afford to be still, so ${tend(dk, 0)}.` },
      { yang: ({ dk }) => `Strength at the root is strength to spend, so ${tend(dk, 1)}.`, yin: ({ dk }) => `Strength at the root is strength to share, so ${tend(dk, 1)}.` },
      { yang: ({ dk }) => `Stand on that ground and move, and ${tend(dk, 2)}.`, yin: ({ dk }) => `Trust that ground, and ${tend(dk, 2)}.` },
    ],
  },
  fed: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master is fed by its season, because ${mph} generates ${dph}.`,
      ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${mph} generates ${dph}, that climate feeds your Day Master.`,
      ({ m, mph, dph }) => `${cap(mph)} runs the kitchen in the month of ${m}, and ${mph} generates ${dph}, so your Day Master was born to a full plate.`,
    ],
    b: [
      {
        x: [
          () => "You were nourished at the root and supported before you had done anything at all.",
          () => "Your season fed you the way a mother phase feeds its child.",
          () => "The month poured you a cup before you were even thirsty.",
        ],
        y: [
          () => "Receive it without apology.",
          () => "That support is the soil under every step you take.",
          () => "Let it soak all the way down to your roots.",
        ],
      },
      () => "Your time nourished you before you lifted a hand, like breakfast in bed on the day you were born.",
      () => "The season gives first, and you receive before anything is asked of you.",
      () => "You came into a household that was already cooking for you.",
    ],
    c: [
      {
        yang: ({ dk }) => `Support like this is fuel, and fuel is for burning toward something, so ${tend(dk, 0)}.`,
        yin: ({ dk }) => `Support like this can be received without proving anything first, so ${tend(dk, 0)}.`,
      },
      { yang: ({ dk }) => `What was given freely can be put to bold use, so ${tend(dk, 1)}.`, yin: ({ dk }) => `What was given freely can simply be accepted, so ${tend(dk, 1)}.` },
      { yang: ({ dk }) => `Build on that support and build high, and ${tend(dk, 2)}.`, yin: ({ dk }) => `Let that support steady the rest of you, and ${tend(dk, 2)}.` },
    ],
  },
  pours: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master pours itself into the season, because ${dph} generates ${mph}.`,
      ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${dph} generates ${mph}, your Day Master gives itself to that climate.`,
      ({ m, mph, dph }) => `${cap(dph)} generates ${mph}, and ${mph} rules the month of ${m}, so your Day Master is the host of the party, refilling every glass but its own.`,
    ],
    b: [
      {
        x: [
          () => "You spend your strength on your time, and you have to express yourself.",
          () => "You give outward by nature, a fountain with no off switch.",
          () => "Your strength runs outward into what you make.",
        ],
        y: [
          () => "Rest wherever rest is offered.",
          () => "Sit down sometimes, and let someone else pour.",
          () => "Rest is what keeps the well from running dry.",
        ],
      },
      () => "Like a parent phase feeding its child, you pour, and the wise move is to rest wherever rest is offered.",
      () => "Your gift flows out like a river to the sea, and every river needs its rain, so rest where you can.",
      () => "A candle that lights the room still needs its wick trimmed, so rest when the room is bright.",
    ],
    c: [
      {
        yang: ({ dk }) => `Giving is your power, so choose where it goes and ${tend(dk, 0)}.`,
        yin: ({ dk }) => `Giving is your gift, and some of it is yours to keep, so ${tend(dk, 0)}.`,
      },
      {
        yang: ({ dk }) => `Expression is the work, and the work deserves your full force, so ${tend(dk, 1)}.`,
        yin: ({ dk }) => `Expression is the work, and rest is part of the work, so ${tend(dk, 1)}.`,
      },
      { yang: ({ dk }) => `Pour with aim, and ${tend(dk, 2)}.`, yin: ({ dk }) => `Pour, let yourself be refilled, and ${tend(dk, 2)}.` },
    ],
  },
  pressed: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master is pressed by its season, because ${mph} overcomes ${dph}.`,
      ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${mph} overcomes ${dph}, that climate presses on your Day Master.`,
      ({ m, mph, dph }) => `${cap(mph)} rules the month of ${m} and overcomes ${dph}, so your Day Master was born under a heavy hand and grew muscles to match.`,
    ],
    b: [
      {
        x: [() => "This is called a forge.", () => "Your season was a forge.", () => "Call it the blacksmith's month."],
        y: [
          () => "You were shaped early by a weight you did not choose.",
          () => "The hammer fell before you could pick your shape, and the shape it gave you holds.",
          () => "Heat and hammer did their work early, and what they made has an edge.",
        ],
      },
      () => "You learned your shape on the anvil, under a weight you did not pick.",
      () => "What pressed on you early also gave you your edge.",
      () => "You and a diamond share a story of pressure and time.",
    ],
    c: [
      { yang: ({ dk }) => `Pressure met squarely becomes temper, so ${tend(dk, 0)}.`, yin: ({ dk }) => `Pressure you never chose need not be carried alone, so ${tend(dk, 0)}.` },
      { yang: ({ dk }) => `What was forged can now cut, so ${tend(dk, 1)}.`, yin: ({ dk }) => `What was forged can now rest in its shape, so ${tend(dk, 1)}.` },
      {
        yang: ({ dk }) => `That weight built the strength now in your hand, so ${tend(dk, 2)}.`,
        yin: ({ dk }) => `That weight was never your doing, and what it shaped is steady, so ${tend(dk, 2)}.`,
      },
    ],
  },
  masters: {
    a: [
      ({ m, mph, dph }) => `Born in ${m}, a month of ${mph}, your Day Master masters its season, because ${dph} overcomes ${mph}.`,
      ({ m, mph, dph }) => `Your month is ${m}, a month of ${mph}, the climate you were born into, and since ${dph} overcomes ${mph}, your Day Master holds the upper hand.`,
      ({ m, mph, dph }) => `${cap(dph)} overcomes ${mph}, and ${mph} rules the month of ${m}, so your Day Master rolled up its sleeves and took the wheel of its season.`,
    ],
    b: [
      {
        x: [
          () => "You were set against your time from your first breath.",
          () => "You came out arguing with the weather.",
          () => "Your season is a field you work by hand.",
        ],
        y: [
          () => "Your life turns resistance into a living.",
          () => "Most days you win the argument.",
          () => "What resists you becomes what sustains you.",
        ],
      },
      () => "You work your season like a field, turning what resists you into what feeds you.",
      () => "From the first breath you were set against your time, and your craft is turning friction into a living.",
      () => "Hand a sculptor stubborn marble and you get a masterpiece, and the marble here is your month.",
    ],
    c: [
      { yang: ({ dk }) => `Friction is where your force shows, so ${tend(dk, 0)}.`, yin: ({ dk }) => `Friction is tiring, and pauses are earned, so ${tend(dk, 0)}.` },
      { yang: ({ dk }) => `You were made to take hold of your time, so ${tend(dk, 1)}.`, yin: ({ dk }) => `You can take hold of your time a little at a time, so ${tend(dk, 1)}.` },
      { yang: ({ dk }) => `Resistance is your material, so ${tend(dk, 2)}.`, yin: ({ dk }) => `Resistance is your material and patience is your tool, so ${tend(dk, 2)}.` },
    ],
  },
};

/* The court. */

export const GOD: Tree<{ pl: string; G: string; reading: string; domain: string; ph: string }> = {
  a: [
    ({ pl, G, reading }) => `Above your ${pl} sits ${G}, ${reading}.`,
    ({ pl, G, reading }) => `${G} stands over your ${pl}, ${reading}.`,
    ({ pl, G, reading }) => `Your ${pl} wears ${G} like a crown, ${reading}.`,
  ],
  b: [
    {
      x: [
        ({ pl, domain }) => `Your ${pl} speaks for ${domain}.`,
        ({ domain }) => `This pillar keeps ${domain}.`,
        ({ domain }) => `${cap(domain)} is where this pillar walks its rounds.`,
      ],
      y: [
        () => "That is where this god rolls up its sleeves.",
        () => "Look for its fingerprints there.",
        () => "That is the stage where it does its best work.",
      ],
    },
    ({ domain }) => `Its ground is ${domain}, and there its influence gathers like weather over a valley.`,
    ({ domain }) => `Look for it in ${domain}, the part of your life this pillar keeps.`,
    ({ domain }) => `This pillar holds ${domain}, so the god paints that chapter of your story.`,
  ],
  c: [
    {
      yang: ({ ph }) => `Its stem is yang, so it shows its hand openly. Meet it in kind and ${tend(ph, 0)}.`,
      yin: ({ ph }) => `Its stem is yin, so it works quietly from within. Meet it gently and ${tend(ph, 0)}.`,
    },
    {
      yang: ({ ph }) => `Being yang, it moves outward and is easy to catch at work, so ${tend(ph, 1)}.`,
      yin: ({ ph }) => `Being yin, it gathers inward and is felt before it is seen, so ${tend(ph, 1)}.`,
    },
    {
      yang: ({ ph }) => `A yang stem puts its strength out front, so ${tend(ph, 2)}.`,
      yin: ({ ph }) => `A yin stem keeps its strength close and gives it with care, so ${tend(ph, 2)}.`,
    },
  ],
};

export const GOD_TWICE: Tree<{ G: string }> = {
  a: [
    ({ G }) => `${G} shows up more than once among your pillars.`,
    ({ G }) => `${G} is written in more than one of your pillars.`,
    ({ G }) => `${G} liked your chart so much it moved in twice.`,
  ],
  b: [
    {
      x: [
        () => "A god that repeats speaks twice in your life.",
        () => "When a god says it twice, it means it.",
        () => "Repetition is how your chart underlines things.",
      ],
      y: [() => "Listen for where it will be heard.", () => "Lean in, because this one is a theme.", () => "Follow it from room to room."],
    },
    () => "A god that repeats becomes a theme, and you can follow it through each ground it touches.",
    () => "What your chart says twice, it wants you to hear.",
    () => "Said twice, a god gathers weight across more than one part of your life, like a chorus coming back around.",
  ],
  c: [
    { yang: () => "Name the theme and work with it.", yin: () => "Notice the theme and let it teach at its own pace." },
    { yang: () => "A theme can become your craft.", yin: () => "A theme can become your companion." },
    { yang: () => "Where it sounds again, answer it.", yin: () => "Where it sounds again, listen." },
  ],
};

/* The pillars in their grounds. */

type GroundCtx = { pl: string; S: string; sq: string; A: string; B: string; bq: string; domain: string; ph: string };

export const GROUND: Tree<GroundCtx> = {
  a: [
    ({ pl, S, sq }) => `Your ${pl} carries ${S} above, ${sq}.`,
    ({ pl, S, sq }) => `${S} crowns your ${pl}, ${sq}, the face this pillar turns toward the world.`,
    ({ pl, S, sq }) => `Up top in your ${pl}, ${S} holds court, ${sq}.`,
  ],
  b: [
    {
      x: [
        ({ A, B, bq }) => `Beneath it is the ${A}, ${B}, ${bq}.`,
        ({ A, B, bq }) => `Below lies ${B}, the ${A}, ${bq}, the root the pillar stands on.`,
        ({ A, B, bq }) => `Under it waits ${B}, the ${A}, ${bq}.`,
      ],
      y: [
        ({ domain }) => `Its ground is ${domain}.`,
        ({ domain }) => `This pillar keeps watch over ${domain}.`,
        ({ domain }) => `Here is where ${domain} takes root in you.`,
      ],
    },
    ({ A, B, bq, domain }) => `Its root is the ${A}, ${B}, ${bq}, and its ground is ${domain}.`,
    ({ A, B, bq, domain }) => `Dig down and you find ${B}, the ${A}, ${bq}, and the soil there is ${domain}.`,
    ({ A, B, bq, domain }) => `The ${A} sleeps beneath it, ${B}, ${bq}, keeping the lamps lit over ${domain}.`,
  ],
  c: [
    { yang: ({ ph }) => `This is ground to act in, so ${tend(ph, 0)}.`, yin: ({ ph }) => `This is ground to grow in, so ${tend(ph, 0)}.` },
    {
      yang: ({ ph }) => `What happens here takes the shape of the hand that reaches in, so ${tend(ph, 1)}.`,
      yin: ({ ph }) => `What happens here takes the shape of the care you give it over time, so ${tend(ph, 1)}.`,
    },
    { yang: ({ ph }) => `Here your life builds outward, so ${tend(ph, 2)}.`, yin: ({ ph }) => `Here your life roots inward, so ${tend(ph, 2)}.` },
  ],
};

export const DAY_GROUND: Tree<GroundCtx> = {
  a: [
    ({ pl, S }) => `Your ${pl} holds you, with ${S} standing above.`,
    ({ pl, S }) => `You live in your ${pl}, and ${S} is your stem.`,
    ({ pl, S }) => `${S} sits at the top of your ${pl}, the pillar with your name on the door.`,
  ],
  b: [
    {
      x: [
        ({ A, B, bq }) => `Beneath it is the ${A}, ${B}, ${bq}.`,
        ({ A, B, bq }) => `Your branch is ${B}, the ${A}, ${bq}.`,
        ({ A, B, bq }) => `Under you lies the ${A}, ${B}, ${bq}.`,
      ],
      y: [
        () => "This seat is also the spouse's palace, the ground your closest companion stands on.",
        () => "This branch doubles as the spouse's palace, the room your nearest love walks into.",
        () => "Here is the spouse's palace, the porch where your closest companion takes off their shoes.",
      ],
    },
    ({ A, B, bq }) => `Below your Day Master is ${B}, the ${A}, ${bq}, and here stands the spouse's palace, the ground you share with your nearest companion.`,
    ({ A, B, bq }) => `Its branch is ${B}, the ${A}, ${bq}, and this branch is the spouse's palace, where love keeps a spare key.`,
    ({ A, B, bq }) => `The ${A} rests beneath you, ${B}, ${bq}, and the spouse's palace sits right here, a guest room kept warm.`,
  ],
  c: [
    {
      yang: ({ ph }) => `Closeness here is yours to choose and claim, so ${tend(ph, 0)}.`,
      yin: ({ ph }) => `Closeness here is yours to welcome and tend, so ${tend(ph, 0)}.`,
    },
    {
      yang: ({ ph }) => `This is the nearest ground in your chart, and you can build on it with intent, so ${tend(ph, 1)}.`,
      yin: ({ ph }) => `This is the nearest ground in your chart, kept open enough to share, so ${tend(ph, 1)}.`,
    },
    {
      yang: ({ ph }) => `You meet your companion here as one strength meets another, so ${tend(ph, 2)}.`,
      yin: ({ ph }) => `You meet your companion here as one root meets another under the same soil, so ${tend(ph, 2)}.`,
    },
  ],
};

/* The frame of the reading and of the room. */

export const READ_FROM: Tree<{ dm: string }> = {
  a: [
    ({ dm }) => `Your Day Master is ${dm}.`,
    ({ dm }) => `${dm} is your Day Master.`,
    ({ dm }) => `${dm} takes the centre seat, your Day Master and the star of this show.`,
  ],
  b: [
    {
      x: [
        () => "Everything after this is said in relation to it.",
        () => "Every line that follows is measured from it.",
        () => "The rest of your reading orbits it.",
      ],
      y: [
        () => "Think of it as the sun of your little solar system.",
        () => "It is the north star you steer by.",
        () => "Keep it in view like a lighthouse.",
      ],
    },
    () => "The rest of the reading turns around it like a record on a spindle.",
    () => "What follows is heard from where it stands.",
    () => "Everything below is sung in its key.",
  ],
  c: [
    { yang: () => "Begin from there.", yin: () => "Rest there first." },
    { yang: () => "Hold that centre.", yin: () => "That centre is steady enough to lean on." },
    { yang: () => "It is your place to stand.", yin: () => "It is your place to come home to." },
  ],
};

export const RESTS: Tree<Record<string, never>> = {
  a: [
    () => "Here your reading rests.",
    () => "Your reading stops here.",
    () => "Here your reading sets down its brush and pours itself a cup of tea.",
  ],
  b: [
    {
      x: [
        () => "The ground is named, the season is named and the court is named.",
        () => "Ground, season and court each have their names now.",
        () => "Your pillars have their grounds, your self has its season and your gods have their places.",
      ],
      y: [() => "The ink is drying.", () => "Every lantern on the path is lit.", () => "The scroll is full and the ink is still warm."],
    },
    () => "The pillars have their grounds, the self has its season and the gods have their places, every guest seated.",
    () => "Ground, season and court have each been given their names, like children at a naming feast.",
    () => "Everything nameable has been named, and the scroll is full.",
  ],
  c: [
    {
      yang: () => "What you make of them belongs to you, and the making is your own.",
      yin: () => "What you make of them belongs to you, in your own time.",
    },
    {
      yang: () => "The rest is lived, so it is left unwritten.",
      yin: () => "The rest is unwritten, and it is yours to write.",
    },
    { yang: () => "From here you take the brush.", yin: () => "From here the brush passes gently to you." },
  ],
};

export const STONE_INTRO: Tree<Record<string, never>> = {
  a: [
    () => "One true chart, set at the centre of the house for you.",
    () => "Here is the house's true chart, kept at its centre and kept for you.",
    () => "At the centre of the house, a true chart sits like a lantern on the table.",
  ],
  b: [
    {
      x: [
        () => "It is the same life read in every script the hall keeps.",
        () => "Every scroll in the hall reads the same life here.",
        () => "Each script the hall keeps is read against it.",
      ],
      y: [
        () => "In the end the scripts become one reading.",
        () => "Like streams meeting a river, the scrolls run into one reading.",
        () => "The voices harmonise until you hear one song.",
      ],
    },
    () => "All the hall's scripts point at this one life, and here they braid into one rope.",
    () => "Each script the hall keeps is laid beside it, and the scripts meet like old friends at one table.",
    () => "Every scroll in the hall leans in to read this one life, and the readings become one.",
  ],
  c: [
    {
      yang: () => "Come back to it whenever you have something to ask.",
      yin: () => "Come back to it whenever you have something to sit with.",
    },
    { yang: () => "Each return reads it from a new angle.", yin: () => "Each return finds it in a new light." },
    { yang: () => "It is the place to start, and the place to come back to.", yin: () => "It is a place to rest your eyes, and to come back to." },
  ],
};

/** The room's opening lines, a and b only, for the moment before the chart is known. */
export function sayOpening<C>(t: Tree<C>, ctx: C, turn = 0): string {
  return `${t.a[turn % 3](ctx)} ${middle(t, ctx, turn)}`;
}
