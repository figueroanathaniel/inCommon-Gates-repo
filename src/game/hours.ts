import { BRANCHES, PHASES, PILLAR_LABELS, STEMS, tenGodOf, type FourPillars } from "@contracts/bazi";
import { TIE_NAMES, branchMeetings } from "../lib/meet";
import type { Tone } from "./world";
import { KEEPER, OPENING, type Choice, type L, type Tag } from "./script";
import { capWords, signOf, type Beat, type Leg, type Vars } from "./story";
import { HOURS_INVITE_TURNS, PILLAR_TURNS, turnChoice } from "./choices";

/*
  Chapter II, The Hours. Chapter I walked the stems, which stand in the open.
  This one walks the four branches under them, in the order a chart is read:
  year, month, day, hour. Each branch keeps two hours of the day, so each
  stretch is walked at its own hour, and the one who keeps it wears the
  branch's animal name.

  A keeper says only what the Academy's own tables say: which pillar it sits
  under and what that pillar is read for, its hours, its phase and quality,
  the stems hidden in it and the ten god each is to the self, and the NAME of
  its meeting with each branch already walked (lib/meet.ts, arithmetic only).
  No line says what a meeting means, and none says what will happen.

  Every word here is a draft for the owner. The 中文 has not been read by a
  reader of Chinese.
*/

export const CHAPTERS: Record<"road" | "hours", { title: L; numeral: L }> = {
  road: { numeral: { en: "Chapter I", zh: "第一章" }, title: { en: "The Road", zh: "行路" } },
  hours: { numeral: { en: "Chapter II", zh: "第二章" }, title: { en: "The Hours", zh: "時辰" } },
};

export const HOURS_OPEN: L[] = [
  { en: "You came back, and at night. Good. The garden keeps different company in the dark.", zh: "你回來了，還是夜裡。好。園子入夜，另有一番陪伴。" },
  { en: "On the road you met the ten gods, which is how a stem is read against the self.", zh: "在路上你見過十神，那是一干對日主的讀法。" },
  { en: "Under each stem of a chart sits a branch. There are twelve of them, and between them they share out the day, two hours each.", zh: "盤中每一干之下，坐著一支。地支十二，分守一日，各守一個時辰。" },
  { en: "Each carries an animal's name, the way a door carries a number.", zh: "每一支都帶著一個動物的名字，如同門上帶著號數。" },
  { en: "This chart holds four of them. Tonight they are walked in order, the year, the month, the day and the hour.", zh: "此盤有其四。今夜依序而行，年、月、日、時。" },
  { en: "The first is {branch}, under the year. It belongs to {phase}, so the walk begins on {phase} ground.", zh: "頭一位是{branch}，在年柱之下。屬{phase}，所以這一程起於{phase}之地。" },
  { en: "Each keeper will say which hours it holds, what it carries inside, and the name of its meeting with the ones before it. None of them says what any hour will bring.", zh: "每位守者會說它守哪個時辰、腹中藏什麼、與先前諸支相遇叫什麼名。誰也不說哪個時辰會帶來什麼。" },
];

export const HOURS_INVITE: Choice = {
  prompt: { en: "Will you walk the hours?", zh: "這幾個時辰，你願走嗎？" },
  options: [
    {
      label: { en: "I will walk them.", zh: "我願走。" }, tag: null,
      reply: { en: "Then watch the garden. It knows the hour.", zh: "那就看著這園子。它識得時辰。" },
    },
    {
      label: { en: "Why animals?", zh: "為何是動物？" }, tag: null,
      reply: { en: "A name is easier to carry than a number, and twelve animals are easier to carry than twelve signs. Here the animal is only a name. Watch the garden.", zh: "名字比號數好記，十二個動物比十二個字好記。在這裡，動物只是名字。看著這園子。" },
    },
  ],
};

/** Said on the road as the reader steps into each branch's hour. */
export const HOUR_AIR: L[] = [
  { en: "It is the middle of the night. Nothing moves but the water.", zh: "夜正深。唯水在動。" },
  { en: "The small hours. The ground is cold and holds still.", zh: "更深。地寒而靜。" },
  { en: "The dark is thinning. Something stirs before the light does.", zh: "夜色漸薄。光未至，已有動靜。" },
  { en: "Morning opens its door. The air is new.", zh: "晨門初開。空氣是新的。" },
  { en: "The morning is up, and damp. The day has begun its work.", zh: "晨已起，帶著濕氣。一日之事已動。" },
  { en: "The sun climbs. The shadows shorten.", zh: "日頭攀升。影子漸短。" },
  { en: "It is noon. The light stands straight overhead.", zh: "正午。光直立頭頂。" },
  { en: "The afternoon is warm and slow.", zh: "午後，暖而緩。" },
  { en: "The afternoon leans west. The light turns clear and thin.", zh: "午後西斜。光清而薄。" },
  { en: "The sun is going down. The west is gold.", zh: "日將落。西天一片金。" },
  { en: "Evening. The first lamps are lit.", zh: "入夜。初燈已點。" },
  { en: "The night gathers. The day is laid away.", zh: "夜色聚攏。一日已收。" },
];

export const B_FRAME: L = { en: "I keep {branch}. In this chart it sits under the {pillar}, which is read for {domain}.", zh: "我守{branch}。此盤之中，它坐於{pillar}之下，主{domain}。" };
export const B_HOURS: L = { en: "My hours run from {hours}.", zh: "我的時辰是{hours}。" };
export const B_QUALITY: L = { en: "{branch} belongs to {phase}. It is read as {quality}.", zh: "{branch}屬{phase}。其象為{quality}。" };
export const B_HIDDEN: L = { en: "Inside me I carry {stem}. To the self of this chart it is {god}, read as {reading}.", zh: "我腹中藏{stem}。於此盤日主，它是{god}。{god}者，{reading}。" };
export const B_HIDDEN_NEXT: L = { en: "Beneath that I carry {stem}. To the self it is {god}, read as {reading}.", zh: "其下又藏{stem}。於日主為{god}。{god}者，{reading}。" };
export const B_REPEAT: L = { en: "You have met my sign already on this walk. A branch that stands twice in a chart is kept twice. What I carry inside, you have already heard.", zh: "此行你已遇過我這一字。一支重見於盤中，便有兩位守者。我腹中所藏，你已聽過。" };
export const B_MEET: L = { en: "Earlier you met {other}, under the {earlier}. Its meeting with {branch} has a name, {tie}. I only name it.", zh: "先前你遇過{other}，在{earlier}之下。它與{branch}相遇，有其名，曰{tie}。我只道其名。" };
export const B_ONWARD: L = { en: "That is all I keep. The moon gate is open, and another hour stands beyond it.", zh: "我所守的就是這些。月門已開，門外另有一個時辰。" };

/** One small moment at each pillar, set on the ground that pillar is read for. */
export const PILLAR_CHOICE: Choice[] = [
  {
    prompt: { en: "A thing handed down through a family comes to your hands. It is heavy.", zh: "家中代代相傳之物，傳到了你手上。它很沉。" },
    options: [
      { label: { en: "Keep it, and carry it well.", zh: "留著，好好扛。" }, tag: "stand", reply: { en: "Then it goes on, and it has your grip on it now.", zh: "那麼它傳下去了，如今上頭有你的手勁。" } },
      { label: { en: "Set it down, with thanks.", zh: "道謝，然後放下。" }, tag: "room", reply: { en: "Then your hands are free, and the thanks were real.", zh: "那麼你的手空了出來，而那聲謝是真的。" } },
    ],
  },
  {
    prompt: { en: "The work is at its busiest, and the table at home is set.", zh: "手上的活正忙，家裡的飯桌已擺好。" },
    options: [
      { label: { en: "Finish the work first.", zh: "先把活做完。" }, tag: "stand", reply: { en: "Then the work is whole, and the table waits a little.", zh: "那麼活是完整的，飯桌稍等片刻。" } },
      { label: { en: "Go to the table.", zh: "先去桌邊。" }, tag: "room", reply: { en: "Then the work waits a little, and the table is full.", zh: "那麼活稍等片刻，飯桌是滿的。" } },
    ],
  },
  {
    prompt: { en: "Someone close asks what you truly think.", zh: "親近之人問你，心裡到底怎麼想。" },
    options: [
      { label: { en: "Say it plainly.", zh: "直說。" }, tag: "stand", reply: { en: "Then they know the real shape of your thought. That is one kind of closeness.", zh: "那麼對方知道了你心思的真樣子。這是一種親近。" } },
      { label: { en: "Ask what they think first.", zh: "先問對方怎麼想。" }, tag: "room", reply: { en: "Then you know them a little better. That is another kind of closeness.", zh: "那麼你更懂對方一些。這是另一種親近。" } },
    ],
  },
  {
    prompt: { en: "Something you made is ready to leave your hands.", zh: "你所做之物，已可離手。" },
    options: [
      { label: { en: "Shape it once more before it goes.", zh: "臨行前再修一遍。" }, tag: "stand", reply: { en: "Then it leaves with your care in every edge.", zh: "那麼它帶著你每一處的用心離去。" } },
      { label: { en: "Let it go as it is.", zh: "就這樣放手。" }, tag: "room", reply: { en: "Then it leaves with room to become its own.", zh: "那麼它帶著自成其形的餘地離去。" } },
    ],
  },
];

export const HOURS_CLOSE_FIRST: L = { en: "You walked the night through. Look, the stones have their colour back.", zh: "你走完了這一夜。看，石頭的顏色回來了。" };
export const HOURS_CLOSE_WAY: Record<"stand" | "room" | "even", L> = {
  stand: { en: "Through these hours the choices kept hold more often than they let go. Steadiness showed.", zh: "這幾個時辰裡，所擇持多於放。顯出的是沉穩。" },
  room: { en: "Through these hours the choices let go more often than they kept hold. Openness showed.", zh: "這幾個時辰裡，所擇放多於持。顯出的是開闊。" },
  even: { en: "Through these hours the choices kept hold and let go in equal measure. Balance showed.", zh: "這幾個時辰裡，所擇持與放各半。顯出的是均衡。" },
};
export const HOURS_CLOSE_LAST: L[] = [
  { en: "Four branches, four hours of one day. Each said what it keeps and what it carries, and the names of their meetings. That is all a branch says.", zh: "四支，一日之中的四個時辰。各說了所守、所藏，與彼此相遇之名。地支所言，僅此而已。" },
  { en: "What is done inside an hour was never written on it. That part is yours.", zh: "一個時辰之內做什麼，時辰上從未寫明。那一段歸你。" },
  { en: "The day is beginning. Stay for it if you like.", zh: "天將亮。願留便留。" },
];

/** The light a branch's hours are walked in. */
export function toneOfHour(branch: number): Tone {
  if (branch <= 1 || branch >= 10) return "night";
  if (branch <= 3) return "dawn";
  if (branch === 9) return "dusk";
  return "day";
}

/** turn: which of the twelve choices each place offers; null keeps the approved ones. */
export function buildHours(p: FourPillars, turn: number | null = null): Leg[] {
  const dm = STEMS[p.dayStem];
  const walked = [p.yearBranch, p.monthBranch, p.dayBranch, p.hourBranch];
  const varsOf = (bi: number, pillar: number): Vars => {
    const b = BRANCHES[bi];
    const pl = PILLAR_LABELS[pillar];
    return {
      branch: signOf(b),
      phase: { en: PHASES[b.phase].english, zh: PHASES[b.phase].hanzi },
      quality: { en: b.quality, zh: b.qualityZh },
      hours: { en: b.hours, zh: b.hoursZh },
      pillar: { en: pl.english, zh: pl.hanzi },
      domain: { en: pl.domain, zh: pl.domainZh },
    };
  };
  const first = BRANCHES[walked[0]];
  const legs: Leg[] = [];

  legs.push({
    spec: { env: "garden", tone: "night", figure: "keeper", hour: 0 },
    name: KEEPER, vars: varsOf(walked[0], 0),
    meet: HOURS_OPEN.map((line) => ({ who: "keeper" as const, line })),
    choice: turnChoice(HOURS_INVITE, HOURS_INVITE_TURNS, turn, 0, false), after: [], exit: "grow", arrive: OPENING[first.phase],
  });

  walked.forEach((bi, i) => {
    const b = BRANCHES[bi];
    const fig = (line: L, vars?: Partial<Vars>): Beat => ({ who: "figure", line, vars });
    const meet: Beat[] = [fig(B_FRAME), fig(B_HOURS), fig(B_QUALITY)];
    if (walked.slice(0, i).includes(bi)) meet.push(fig(B_REPEAT));
    else b.hiddenStems.forEach((si, n) => {
      const stem = STEMS[si];
      const god = tenGodOf(dm, stem);
      meet.push(fig(n === 0 ? B_HIDDEN : B_HIDDEN_NEXT, {
        stem: signOf(stem),
        god: { god: { en: god.english, han: god.hanzi, pinyin: capWords(god.pinyin) } },
        reading: { en: god.reading, zh: god.readingZh },
      }));
    });
    const after: Beat[] = [];
    for (let j = 0; j < i; j++) {
      const pl = PILLAR_LABELS[j];
      for (const m of branchMeetings(walked[j], bi)) {
        const t = TIE_NAMES[m.kind];
        after.push(fig(B_MEET, {
          other: signOf(BRANCHES[walked[j]]),
          earlier: { en: pl.english, zh: pl.hanzi },
          tie: { en: t.english, zh: t.hanzi },
        }));
      }
    }
    after.push(fig(B_ONWARD));
    legs.push({
      spec: { env: b.phase, tone: toneOfHour(bi), figure: "animal", animal: bi, hour: (bi * 2) % 24, phase: b.phase },
      name: { en: `The ${b.animal}`, zh: b.animalHanzi },
      vars: varsOf(bi, i), meet, choice: turnChoice(PILLAR_CHOICE[i], PILLAR_TURNS[i], turn, i), after, exit: "gate",
      sub: { en: `The hour of the ${b.animal}`, zh: `${b.hanzi}時` },
      enter: HOUR_AIR[bi],
    });
  });

  legs.push({
    spec: { env: "garden", tone: "dawn", figure: "keeper", hour: 6 },
    name: KEEPER, vars: varsOf(walked[3], 3),
    meet: [{ who: "keeper", line: HOURS_CLOSE_FIRST }],
    choice: null, after: [], exit: "end",
  });
  return legs;
}

/** The Keeper's last words at first light, which turn on how the reader chose. */
export function closingHours(tags: Tag[]): L[] {
  const stand = tags.filter((t) => t === "stand").length;
  const room = tags.length - stand;
  const way = stand > room ? "stand" : room > stand ? "room" : "even";
  return [HOURS_CLOSE_WAY[way], ...HOURS_CLOSE_LAST];
}
