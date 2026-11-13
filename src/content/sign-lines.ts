import type { FourPillars, Phase } from "@contracts/bazi";
import { PHASES, STEMS } from "@contracts/bazi";

/*
  The sign lines: one sentence for each stem, branch and god with the sign as
  its subject, one for each way a self can meet its season, and three
  questions for each phase. A rendition of Across a Sign, ASB-1.10, for BaZi.
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

/** Three questions for each phase, in the phase's own temper. */
export const PHASE_ASKS: Record<Phase, [string, string, string]> = {
  wood: [
    "So, what is the growth reaching toward, and has anyone asked the roof?",
    "Which branch is it time to let go so the trunk can thicken?",
    "Where would bending get there sooner than pushing?",
  ],
  fire: [
    "Go on, who is the light for tonight?",
    "So, what is being kept warm that could stand on its own by now?",
    "What does the lamp see that the sun walks past?",
  ],
  earth: [
    "So, what is being carried that nobody ever came to claim?",
    "What was planted here that is ready to be eaten?",
    "When did the mountain last let the road come to it?",
  ],
  metal: [
    "So, what would one clean cut settle?",
    "Which edge is being kept sharp for a day that has passed?",
    "What is the polish for, and who gets to see it?",
  ],
  water: [
    "So, where is the water going round something it could simply name?",
    "What has soaked in quietly that is ready to come up?",
    "Who knows how deep it runs here?",
  ],
};

/** The question that closes a reading: the Day Master's phase chooses the three, the chart chooses one, the same one each time. */
export function closingAsk(p: FourPillars): string {
  const n =
    p.yearStem + p.yearBranch + p.monthStem + p.monthBranch + p.dayStem + p.dayBranch + p.hourStem + p.hourBranch;
  return PHASE_ASKS[STEMS[p.dayStem].phase][n % 3];
}
