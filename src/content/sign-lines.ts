import type { FourPillars, Phase } from "@contracts/bazi";
import { PHASES, STEMS } from "@contracts/bazi";

/*
  The sign lines: one sentence for each stem, branch and god with the sign as
  its subject, one for each way a self can meet its season, and the closing
  questions of each phase. A rendition of Across a Sign, ASB-1.10, for BaZi.
  Kin Common LLC writing, approved in English by the owner on 12 November
  2026; change it only with the owner. Each line is added after the
  definition the Academy already shows and replaces none of them. The 中文
  renditions are drafted and held back until a reader of Chinese has read
  them, so nothing here is shown in 中文.
*/

/** By the stem's character. */
export const STEM_LINE: Record<string, string> = {
  甲: "Yang Wood grows toward the light in a straight line, and the roof finds out later.",
  乙: "Yin Wood bends round the wall, thanks it for the support, and is over the top by summer.",
  丙: "Yang Fire warms the whole courtyard and forgets that someone wanted shade.",
  丁: "Yin Fire lights one page at a time and reads every word on it.",
  戊: "Yang Earth stays where it is, and the road goes round.",
  己: "Yin Earth takes the seed it is handed and says nothing until there is something to eat.",
  庚: "Yang Metal cuts the knot while the others are still discussing the rope.",
  辛: "Yin Metal comes out of the hard year brighter, and would like that noticed.",
  壬: "Yang Water meets the rock, goes round it, and is at the sea before the rock has finished objecting.",
  癸: "Yin Water arrives without a sound, and by morning everything in the garden has had some.",
};

/** By the branch's character. */
export const BRANCH_LINE: Record<string, string> = {
  子: "The Rat does its thinking at midnight and has the day half planned before anyone wakes.",
  丑: "The Ox keeps the warmth under the frost and sees no reason to mention it.",
  寅: "The Tiger is up in the dark, moving, before the year has agreed to begin.",
  卯: "The Rabbit opens the door at first light and is through it before the hinge has finished.",
  辰: "The Dragon keeps two stores in one damp cellar and knows which is which.",
  巳: "The Snake climbs toward noon with something bright kept back in its belly.",
  午: "The Horse stands at the top of the day and has already felt the first cool thread in it.",
  未: "The Goat banks the fire, keeps the root, and lets the afternoon take its time.",
  申: "The Monkey is new metal with a spring already running through it, and it will not sit still for either.",
  酉: "The Rooster pours one cup at sundown and wants it to be the right cup.",
  戌: "The Dog locks the storehouse at dusk and knows there is fire laid away inside.",
  亥: "The Pig gathers water in the dark and is already carrying next spring's first shoot.",
};

/** By the god's key in TEN_GODS. */
export const GOD_LINE: Record<string, string> = {
  companion: "The Companion stands at the same height and carries the other end of the table.",
  robwealth: "Rob Wealth has the same appetite and reaches for the same dish.",
  eatinggod: "The Eating God cooks more than it can eat and sets a place for whoever turns up.",
  hurtingofficer: "The Hurting Officer has the better answer and gives it while the official is still speaking.",
  indirectwealth: "Indirect Wealth walks the whole market and comes home with something nobody sent it for.",
  directwealth: "Direct Wealth counts the day's takings twice and puts the same sum by every month.",
  sevenkillings: "Seven Killings sets the bar a hand higher than last time and offers no explanation.",
  directofficer: "The Direct Officer arrives with the seal and the rule book, and has read the rule book.",
  indirectresource: "Indirect Resource learned it from a book nobody else in the village has opened.",
  directresource: "Direct Resource packed the bag the night before and put a second coat in it.",
};

export type SeasonMeeting = "own" | "fed" | "feeding" | "pressed" | "mastering";

export const SEASON_LINE: Record<SeasonMeeting, string> = {
  own: "A self born in its own season is at home before it has unpacked.",
  fed: "A self fed by its season was handed breakfast before it asked, and may come late to the stove.",
  feeding: "A self that feeds its season is still serving when the others have sat down.",
  pressed: "A self pressed by its season learned its own shape early, from the hammer.",
  mastering: "A self that masters its season came in pushing, and found the door did open.",
};

/** How the Day Master's phase stands to the phase of the month it was born in. */
export function seasonMeeting(day: Phase, month: Phase): SeasonMeeting {
  if (month === day) return "own";
  if (PHASES[month].generates === day) return "fed";
  if (PHASES[day].generates === month) return "feeding";
  if (PHASES[month].overcomes === day) return "pressed";
  return "mastering";
}

/*
  The closing question. Each phase keeps four families of question, each
  family holds three variations, and each variation is written twice, a Yang
  form that calls the reader forward and a Yin form that steadies and
  strengthens from within. The Day Master's polarity chooses the form; the
  turn chooses the family and the variation. Families rotate on every reading
  shown, so the next three readings always ask from a different family, and
  all twelve questions a reader can be asked come round before any repeats.
  Each family's first variation keeps the question the owner approved on
  12 November 2026 in one of its forms. Every other line is a draft for the
  owner, English only, like the rest of this file.
*/
export interface AskPair { yang: string; yin: string }
/** Four families, each of three variations. */
export type AskFamily = [AskPair, AskPair, AskPair];

export const PHASE_ASKS: Record<Phase, [AskFamily, AskFamily, AskFamily, AskFamily]> = {
  wood: [
    // Reaching. Where the growth is headed.
    [
      { yang: "So, what is the growth reaching toward, and has anyone asked the roof?", yin: "What is the growth reaching toward, and what quiet support has it been leaning on all along?" },
      { yang: "Which way is the trunk already leaning, and are you ready to grow straight into it?", yin: "Which small green thing has been trying to grow here, and what would it need to keep going?" },
      { yang: "If the whole forest had to make room, what would you grow into this year?", yin: "Where does the light reach you most gently, and what grows when you stay in it?" },
    ],
    // Pruning. What goes so the trunk can thicken.
    [
      { yang: "Which branch is it time to let go so the trunk can thicken?", yin: "Which branch has already gone quiet, and may it fall with your blessing?" },
      { yang: "What would you cut back today so the strongest shoot gets all the sap?", yin: "What could you stop feeding, gently, so the root has something left for itself?" },
      { yang: "Which old growth is shading the new, and who will lift the saw?", yin: "What is the tree tired of holding up, and who said it had to hold it?" },
    ],
    // Bending. The vine's way round the wall.
    [
      { yang: "Where is it worth pushing straight through, and where does the wall simply want going round?", yin: "Where would bending get there sooner than pushing?" },
      { yang: "When the wind comes hard tonight, what keeps the trunk standing?", yin: "What has the vine learned from every wall it climbed, and who taught it to keep climbing?" },
      { yang: "What would it take to bend all the way down and still come up whole?", yin: "Where has softness already carried you farther than force could, and how might you trust it again?" },
    ],
    // Benevolence, the kindness of wood. Who rests in the shade.
    [
      { yang: "Whose shade are you, and do they know they can rest under you?", yin: "Who has been shade for you, and have you told them?" },
      { yang: "What could you build tall enough that others could climb it?", yin: "Who grows beside you, and what would it be to let your roots touch?" },
      { yang: "Where could your kindness stand up tall and be seen?", yin: "What tender thing in you is still growing, and how will you shelter it?" },
    ],
  ],
  fire: [
    // The light, and who it is for.
    [
      { yang: "Go on, who is the light for tonight?", yin: "Who is the light for tonight, and is there a little left for the one holding it?" },
      { yang: "If every window in the city turned toward you, what would you want them to see?", yin: "Whose face do you light up without trying, and what would it be to let that be enough?" },
      { yang: "Who has been waiting in the dark for exactly your kind of fire?", yin: "Where could the light fall on you for once, and could you let it stay?" },
    ],
    // Tending. What is kept warm, and by whom.
    [
      { yang: "So, what is being kept warm that could stand on its own by now?", yin: "What have you kept warm for so long that your own hands have gone cold?" },
      { yang: "Which fire are you still feeding out of habit, and what if you let it burn down to embers?", yin: "Which coal deserves a breath from you tonight, and which can be left to glow by itself?" },
      { yang: "What would you stop carrying from fire to fire, and let catch on its own?", yin: "Who could tend the hearth tonight so you could sit beside it?" },
    ],
    // Seeing. What the lamp shows.
    [
      { yang: "What do you see clearly that others keep squinting at, and what would it take to say it out loud?", yin: "What does the lamp see that the sun walks past?" },
      { yang: "What truth is burning in you, and who needs to see by its light?", yin: "What small thing, held near the candle, turns out to be beautiful?" },
      { yang: "Where is the room darkest, and what happens when you walk in?", yin: "What have you noticed lately that nobody else had words for yet?" },
    ],
    // Joy and courtesy, the grace of fire. The welcome.
    [
      { yang: "What is worth a celebration that you have walked straight past?", yin: "What joy came in quietly this week, and did it get a seat at the table?" },
      { yang: "Who would you welcome loudly, and what keeps the door from swinging open?", yin: "How do you like to be welcomed, and who could you teach?" },
      { yang: "What would it be to laugh in full voice here?", yin: "Where does your warmth feel most at home, and how often do you go there?" },
    ],
  ],
  earth: [
    // Carrying. What the ground holds up.
    [
      { yang: "So, what is being carried that nobody ever came to claim?", yin: "What have you carried so faithfully that you forgot you could set it down?" },
      { yang: "Which weight is truly yours to lift, and which belongs on other shoulders?", yin: "What would it feel like to be carried for a while?" },
      { yang: "What load would you lift gladly if your hands were free of the rest?", yin: "Who has offered to share the weight, and what would it cost to say yes?" },
    ],
    // Harvest. What is ripe.
    [
      { yang: "What was planted here that is ready to be eaten?", yin: "What have you grown that you have not yet let yourself taste?" },
      { yang: "Which field is ripe, and who brings in the harvest if you do not?", yin: "What is ripening slowly, and how can you keep it company while it does?" },
      { yang: "What have you earned the right to enjoy today?", yin: "Whose table has your harvest fed, and is there a bowl set at it for you?" },
    ],
    // The mountain. Holding still.
    [
      { yang: "When did the mountain last let the road come to it?", yin: "Where could you stay still and let what you need find its way to you?" },
      { yang: "What ground will you hold, whatever the weather does?", yin: "What steadiness in you do others lean on without knowing it?" },
      { yang: "What would you stand on so firmly that the whole valley could find you?", yin: "What quiet center do you keep, and who has been allowed inside it?" },
    ],
    // Trust, the faithfulness of earth. The kept word.
    [
      { yang: "Whose word do you keep as if it were your own, and does yours carry that weight?", yin: "Whom do you trust with the soft middle of things, and do they know?" },
      { yang: "What promise is worth keeping now, even when it costs?", yin: "What promise did you make to yourself that is still waiting to be kept?" },
      { yang: "What could be built on your word if you gave it plainly?", yin: "Where has your faith in someone held them up, and where might it hold you?" },
    ],
  ],
  metal: [
    // The clean cut.
    [
      { yang: "So, what would one clean cut settle?", yin: "What could be gently cut loose, and what would the lightness make room for?" },
      { yang: "Which knot have you been untying for years that one stroke would end?", yin: "What ending have you been waiting for permission to make?" },
      { yang: "What decision is already sharpened and ready in your hand?", yin: "What part of you already knows the answer, and what would it take to listen?" },
    ],
    // The edge kept for an old day.
    [
      { yang: "Which edge is being kept sharp for a day that has passed?", yin: "What armour did you put on for an older hurt, and may it come off now?" },
      { yang: "What old battle is still being fought, and who would you be once it is over?", yin: "Where could your guard come down a little, among the people who have earned it?" },
      { yang: "Which blade would serve you better turned toward what you are building?", yin: "What were you protecting back then, and is it safe enough now to rest?" },
    ],
    // The polish. What is precious.
    [
      { yang: "What is the polish for, and who gets to see it?", yin: "What in you is already precious, before any polish at all?" },
      { yang: "What is your worth, said plainly, without a single apology?", yin: "What did the hard year refine in you that you can be proud of?" },
      { yang: "Where does your standard raise the whole room, and where does it only cut you?", yin: "Who saw your shine before you did, and what did they see?" },
    ],
    // Rightness, the justice of metal, and what autumn lets fall.
    [
      { yang: "What is right here, and who will say it if you will not?", yin: "What do you know is right, quietly, in the place where you know things?" },
      { yang: "What loss can you honour by standing up straight inside it?", yin: "What has autumn taken from you, and how gently may you carry that?" },
      { yang: "What line will you not cross, and who is safer because of it?", yin: "What has falling away left clean and clear in you?" },
    ],
  ],
  water: [
    // Going round, and naming.
    [
      { yang: "So, where is the water going round something it could simply name?", yin: "What has the water been patiently wearing smooth, and what shape is coming through?" },
      { yang: "What would you name out loud if you trusted the current to carry you?", yin: "What is the water circling, and could it be named softly, just to yourself first?" },
      { yang: "What obstacle have you been flowing around that deserves a flood?", yin: "Where has going around something been its own quiet wisdom?" },
    ],
    // What soaked in, rising.
    [
      { yang: "What has soaked in quietly that is ready to come up?", yin: "What have you been taking in all season, and what is it becoming in you?" },
      { yang: "What spring is rising in you, and where will you let it break the surface?", yin: "What has been resting deep in you, and how much more rest does it ask for?" },
      { yang: "What do you know now that a year ago you could only feel, and what will you do with it?", yin: "What feeling has been under the ice, and who could you trust with it when it thaws?" },
    ],
    // Depth.
    [
      { yang: "Who knows how deep it runs here?", yin: "Who have you let see the depth, and how did it feel to be seen?" },
      { yang: "How deep are you willing to go to find what is true?", yin: "What lives down in the quiet that you have never had to explain to anyone?" },
      { yang: "What would change if you trusted your own depth the way the sea trusts its own?", yin: "Where could you float for a while and let the deep hold you up?" },
    ],
    // Wisdom, the knowing of water, and the winter store.
    [
      { yang: "What do you know that the world has not yet asked you, and will you offer it?", yin: "What have you learned the slow way that you can finally trust?" },
      { yang: "What is winter storing in you, and what will you build with it come spring?", yin: "What is winter asking you to keep close, and where will you keep it warm?" },
      { yang: "What fear has been moving under the current, and what happens when you look straight at it?", yin: "What fear could you sit with tonight, kindly, until it shows you what it was guarding?" },
    ],
  ],
};

const FAMILIES = 4;
const VARIATIONS = 3;
/** How many different questions one reader can be asked before any comes round again. */
export const ASK_CYCLE = FAMILIES * VARIATIONS;

/**
 * The question that closes a reading. The Day Master's phase chooses the
 * twelve, its polarity chooses the Yang or Yin form, and the turn walks them,
 * a new family each time, starting from a place the chart chooses. The same
 * chart and turn always give the same question.
 */
export function closingAsk(p: FourPillars, turn = 0): string {
  const dm = STEMS[p.dayStem];
  const start =
    p.yearStem + p.yearBranch + p.monthStem + p.monthBranch + p.dayStem + p.dayBranch + p.hourStem + p.hourBranch;
  const k = (((start + turn) % ASK_CYCLE) + ASK_CYCLE) % ASK_CYCLE;
  const pair = PHASE_ASKS[dm.phase][k % FAMILIES][Math.floor(k / FAMILIES) % VARIATIONS];
  return dm.yinyang === "yang" ? pair.yang : pair.yin;
}

const TURN_KEY = "incommon.bazi.ask.v1";
let memTurn = 0;

/**
 * Moves the question on by one and returns the new turn. Kept on this device
 * as a single counting number, with nothing about any chart in it; a device
 * that will not keep it still turns for this visit.
 */
export function takeAskTurn(): number {
  let n = memTurn;
  try {
    const raw = Number(localStorage.getItem(TURN_KEY));
    if (Number.isFinite(raw) && raw >= 0) n = Math.max(n, Math.floor(raw));
  } catch {
    /* No storage. The visit's own count carries on. */
  }
  const next = (n + 1) % 1_000_000;
  memTurn = next;
  try {
    localStorage.setItem(TURN_KEY, String(next));
  } catch {
    /* As above. */
  }
  return next;
}
