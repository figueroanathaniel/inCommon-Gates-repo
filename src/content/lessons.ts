/**
 * The scrolls of the Academy.
 *
 * Voice law, inherited from inCommon and binding here:
 *  - Attribute once, then speak declaratively inside the frame.
 *  - No machinery vocabulary: no calculate, compute, algorithm, data,
 *    process, system, function, output, input, variable, parameter.
 *  - No em dashes anywhere. A period, a comma, or a colon.
 *  - Native symbols first, glossed in the old manner: （天干） [Heavenly Stems].
 *    A symbol carries its English beside it at first showing in a scroll;
 *    every showing after keeps the English alone.
 *  - Nothing is ever declared to be fated. The tradition describes
 *    weights, seasons and relations; the life remains the reader's.
 *
 * The history is kept to what was read: 李虛中 [Li Xuzhong] of the Tang
 * through Han Yu's epitaph for him, the verses of 滴天髓 and Ren Tieqiao's
 * notes on them, and the opening of 子平真詮. What rests on later report,
 * such as 徐子平 [Xu Ziping] and the stem of the day, is said as remembered.
 */

export interface LessonBody {
  id: string;
  epigraph: string;
  epigraphSource: string;
  paragraphs: string[];
  table?: "stems" | "branches" | "phases" | "gods" | "jiazi";
  /** How Your Nature enters this scroll once it stands inscribed. */
  stoneTurn: string;
}

export const LESSON_BODY: Record<string, LessonBody> = {
  yuan: {
    id: "yuan",
    epigraph: "易與天地準，故能彌綸天地之道。",
    epigraphSource: "The Book of Changes, Appended Statements: the Change measures itself against heaven and earth, and so it can enfold the way of heaven and earth entire.",
    paragraphs: [
      "（八字） [BaZi, the Eight Characters] reads a moment of birth as four pairs of signs: the year, the month, the day and the hour, each a sign of heaven set above a sign of earth. Four pillars, eight characters, and a life laid out on a sheet no larger than a letter.",
      "Its first reader with a name is （李虛中） [Li Xuzhong], a censor of the Tang who died in 813. His friend （韓愈） [Han Yu] wrote his epitaph and remembered him as the man who went deepest into the books of the Five Phases. From the year, month and day of a birth he weighed how long a life would run, how high it would rise, and where it would meet ease or difficulty, and he was seldom wrong. The same epitaph remembers that he took an elixir of quicksilver, hoping not to die. A man who could read the length of other lives wanted to lengthen his own. The art has carried both wishes ever since: to know the shape of a life, and to meet it well.",
      "Under the Song the hour joined the year, the month and the day, and the art took the name it is still taught under, （子平） [Ziping], after （徐子平） [Xu Ziping], whom the tradition remembers for setting the stem of the day at the centre of the chart. His line's teaching was gathered in （淵海子平） [the Deep Sea of Ziping], and under the Ming （萬民英） [Wan Minying] is credited with drawing the whole field together in （三命通會） [the Compendium of the Three Destinies].",
      "Two later books gave the art its discipline and its reason. （子平真詮） [the True Commentary on Ziping], by （沈孝瞻） [Shen Xiaozhan] of the Qing, sends every reading back to one question: the self of the day against the season of its month. And （滴天髓） [the Marrow of Heaven's Drops], a verse long credited to （劉基） [Liu Ji] of the early Ming, says why anyone should read a chart at all: 要與人間開聾聵 [to open the ears and eyes of the people of this world]. Its great commentator, （任鐵樵） [Ren Tieqiao], filled it with five hundred and twelve charts of real lives.",
      "This hall keeps to that method. One true chart, Your Nature, stands at its centre, and every scroll returns to it, until the grammar of the art is something seen written in a life.",
      "The Marrow puts the heart of the matter in a single line: 順則吉兮凶則悖 [going with the grain is fortune; going against it is misfortune]. The eight characters show the grain of a life, the ground it was planted in and the weather it was born under. The walking is the walker's.",
    ],
    stoneTurn:
      "Your Nature stands at the centre of this hall. When it is inscribed, every scroll you have read will be found written in it, and the last scroll will read it whole, aloud, in one voice, for the reader who has stayed to hear it.",
  },

  tiangan: {
    id: "tiangan",
    epigraph: "欲識三元萬法宗，先觀帝載與神功。",
    epigraphSource: "The Marrow of Heaven's Drops, the Way of Heaven: to know the three origins, the root of every method, look first at what heaven carries and the work of its spirit.",
    paragraphs: [
      "（天干） [the Heavenly Stems] are the ten signs of heaven's turning, in an order older than the dynasties that kept it: Jia （甲）, Yi （乙）, Bing （丙）, Ding （丁）, Wu （戊）, Ji （己）, Geng （庚）, Xin （辛）, Ren （壬）, Gui （癸）. They are the five phases each taken twice, once in yang fullness and once in yin refinement: one breath moving through ten shapes.",
      "Meet them in turn. Jia rises first, the great tree pushing up through the split seed. Yi bends and finds its way, wood as the vine. Bing declares itself at noon and warms whatever it reaches; Ding carries a flame indoors and lights one room exactly. Wu stands as the mountain. Ji opens as garden soil and takes in whatever falls. Geng comes out of the ore as a blade; Xin is pressed and polished into the jewel. Ren runs in flood toward the sea, and Gui falls as quiet rain, closing the round where every seed begins.",
      "Each stem carries its phase （五行） [the Five Phases], its breath （陰陽） [yin or yang], and the shape that phase takes in that breath. Yang wood is the tree; yin wood is the vine. Hold all three, and a stem becomes a presence you recognise.",
      "In a chart the stems stand above, in heaven's place, and show what a life wears on its face. What it keeps in its cellar belongs to the branches.",
    ],
    table: "stems",
    stoneTurn:
      "On Your Nature, look first at the four characters along the top of the pillars. Those are the chart's four stems, the visible declarations of that life. The third of them, the stem of the day, is the one the whole art turns around.",
  },

  dizhi: {
    id: "dizhi",
    epigraph: "干為天元，支為地元，支中所藏為人元。",
    epigraphSource: "Ren Tieqiao on the Marrow of Heaven's Drops: the stems are heaven's origin, the branches earth's origin, and what the branches store is the human origin.",
    paragraphs: [
      "（地支） [the Earthly Branches] are the twelve mansions the year and the day pass through: Zi （子）, Chou （丑）, Yin （寅）, Mao （卯）, Chen （辰）, Si （巳）, Wu （午）, Wei （未）, Shen （申）, You （酉）, Xu （戌）, Hai （亥）. Where the stems are heaven's breath, the branches are earth's body: the twelve months of the year, the twelve double hours of the day, and the twelve creatures by which the branches are first remembered, the Rat （鼠）, the Ox （牛）, the Tiger （虎）, the Rabbit （兔）, the Dragon （龍）, the Snake （蛇）, the Horse （馬）, the Goat （羊）, the Monkey （猴）, the Rooster （雞）, the Dog （狗）, the Pig （豬）.",
      "The creatures are a memory house. Beneath each one, a branch is a season and an hour and a phase of the world's breathing. Zi is the hour of deepest night and the month of the solstice, water at its stillest, where the year's next yang is already conceived in the dark. Wu is high noon and high summer, fire at its summit, where yin is likewise already conceived. The twelve are one circle of breathing, out and in, and every branch holds the seed of its own turning.",
      "Each branch also keeps what the tradition calls （藏干） [the hidden stems], the one, two or three stems stored within it like provisions in a cellar. Zi keeps only Gui, pure water with nothing else laid by. Chou keeps three: Ji the soil, Gui the meltwater, Xin the metal sleeping in frozen ground. The hidden stems are why the branches are read as what a life holds in reserve: capacities not worn on the face, which surface in their season.",
      "In a chart the branches stand below, in the place of earth, and the tradition reads them as root, season and dwelling. The stem declares; the branch sustains. When the two agree, a pillar stands firm. When they pull against one another, the tension is named aloud, for that is where a life does its work.",
    ],
    table: "branches",
    stoneTurn:
      "On Your Nature, the four characters along the bottom of the pillars are its branches: the seasons and hours that life was rooted in. One of them, the branch of the month, outweighs the rest, and the scroll of the Five Phases will show you why.",
  },

  wuxing: {
    id: "wuxing",
    epigraph: "五行：一曰水，二曰火，三曰木，四曰金，五曰土。",
    epigraphSource: "The Book of Documents, Great Plan: of the five phases, the first is called water, the second fire, the third wood, the fourth metal, the fifth earth.",
    paragraphs: [
      "（五行） [the Five Phases] are usually carried into English as the five elements. The art reads them as movements: Wood （木）, the movement of rising and spreading; Fire （火）, the movement of flaring upward; Earth （土）, the movement of receiving and ripening; Metal （金）, the movement of gathering and hardening; Water （水）, the movement of sinking and storing. A stem or branch takes part in its phase the way a dancer takes part in a dance.",
      "The first round to be learned is （相生） [the generating cycle], the order in which each phase gives birth to the next: wood feeds fire, fire makes earth of its ash, earth bears metal from its veins, metal gathers water as dew gathers on cool bronze, and water nourishes wood, closing the round. Nothing in the cycle is first and nothing is last. It is a ring of mothers, and the tradition holds that every chart is a small picture of this ring, complete or strained.",
      "The second round is （相剋） [the overcoming cycle], and it is kept with care, for it is the round of governance: wood parts earth with its roots, earth dams water, water quenches fire, fire melts metal, and metal's edge fells wood. The old readers called this the cycle of control, the way a bank guides a river. A chart in which a phase runs unchecked is read as a chart out of balance; the overcoming round is the world's own remedy.",
      "Every judgement in the art returns to these two rounds. When you meet a stem, ask what generates it and what it generates, what it overcomes and what overcomes it, and you have already begun to read. The rest of the art, the pillars, the gods, the decades, is these two rounds wearing formal dress.",
    ],
    table: "phases",
    stoneTurn:
      "Hold the two rounds in mind and look at Your Nature. Count the phases among its eight characters. You will see at a glance which movement this chart is heavy with and which it scarcely holds, and the Mirror scroll will say aloud what that weight has meant.",
  },

  yinyang: {
    id: "yinyang",
    epigraph: "一陰一陽之謂道。",
    epigraphSource: "The Book of Changes, Appended Statements: one yin, one yang, this is called the Way.",
    paragraphs: [
      "（陰陽） [Yin and Yang] are the two breaths beneath everything you have unrolled so far. Yang is the breath that rises, declares, and moves outward: the sunlit face of the hill, the day, the stem that stands like a tree. Yin is the breath that settles, receives, and works within: the shaded face of the hill, the night, the stem that climbs like a vine. The tradition is exact about one thing above all: the two breaths are equal, and they always arrive together. The sunlit face exists because the shaded one does.",
      "The ten stems are the five phases taken in both breaths, and you can feel the difference in the old images. Bing is yang fire, the open sun that warms without choosing; Ding is yin fire, the lamp that lights one room exactly. Ren is yang water, the river in flood that goes around nothing because it goes through; Gui is yin water, the dew that touches every leaf by morning. Same phase, opposite manner. A yang stem accomplishes by declaration; a yin stem accomplishes by persistence.",
      "The twelve branches alternate in polarity as they turn: Zi yang, Chou yin, Yin yang, Mao yin, and so round the circle, breath out and breath in, hour by hour and month by month. This is why the sixty pairs of the cycle are sixty and not a hundred and twenty: a yang stem only ever rides a yang branch, and a yin stem a yin branch. The pairs are matched breath to breath, and the whole sexagenary round breathes in step.",
      "In the reading of a chart, polarity is the first refinement of every judgement. A Companion in the same polarity is a true shoulder beside yours; in the opposite polarity it becomes the rival who wants what you want. Yin and yang leave a sign its nature and shape how it comes at you, and the manner is listened for before the meaning.",
    ],
    stoneTurn:
      "Count the yang and yin signs on Your Nature. Few charts hold them in equal number, and this one is no different. The Mirror scroll will name the balance honestly, as one more weight among the rest.",
  },

  sizhu: {
    id: "sizhu",
    epigraph: "年為根，月為苗，日為花，時為果。",
    epigraphSource: "An old verse of the art: the year is the root, the month the sprout, the day the flower, the hour the fruit.",
    paragraphs: [
      "（八字） [BaZi] is the art's whole architecture, and the four pillars are its frame. Take one moment of birth and write it four times over: the year as a pair of signs, the month as a pair, the day as a pair, the hour as a pair. Set the four pairs side by side, each stem above its branch, and you have the eight characters the art is named for. Root, sprout, flower and fruit, the old verse calls them, and the order itself instructs: the year is what you grew from, the hour is what you send forward.",
      "Each pillar keeps its own ground in a life. The Year Pillar （年柱） holds ancestry and the earliest years, the family one descends from and the first weather one remembers. The Month Pillar （月柱） holds parents, upbringing, and one's work in the world; its branch is the month's decree, （月令）, the season that weighs most heavily of all eight characters. The Day Pillar （日柱） holds the self and the spouse: its stem is （日主） [the Day Master], the one character the whole chart is read in relation to, and its branch is the ground one's closest companion stands upon. The Hour Pillar （時柱） holds children, those who carry the work onward, and the later years: the fruit, what the tree finally offers.",
      "The pillars are cast, and the casting is exact. The year turns at （立春） [the Beginning of Spring], near the fourth of February; a child born in late January belongs to the pillar of the year just closing. The months turn at the solar terms, each branch reigning from its own term. The days turn in an unbroken sixty-day round that no dynasty has interrupted, and the hours turn in the twelve double hours, Zi holding the night from eleven to one. When the hour of birth is unknown, the chart stands on three pillars, as Li Xuzhong's charts once did.",
      "Stand before a chart in the old manner and the pillars are read from right to left, as the tradition writes: the year at the right hand, the hour at the left, the day one step left of centre, where the self always stands slightly west of the middle of its own life. Everything this house keeps is written in that order, and Your Nature is set in that order, exactly as a chart would be laid out for a reading.",
    ],
    stoneTurn:
      "This is the scroll where Your Nature stops being an emblem and becomes a chart. Stand before it now and read its four pillars in order, year to hour, root to fruit. You know what each ground holds. The next scroll will show you how the eight characters speak to one another.",
  },

  shishen: {
    id: "shishen",
    epigraph: "以日干配月令地支，而生剋不同，格局分焉。",
    epigraphSource: "The True Commentary on Ziping: set the stem of the day against the branch of the month's decree, and as their feeding and overcoming differ, the structures divide.",
    paragraphs: [
      "（十神） [the Ten Gods] are the ten relations any sign can bear to the Day Master, and they are derived entirely from the two rounds you already hold. Take the Day Master's phase and polarity, set another stem beside it, and ask the old questions: is it the same phase as me, does it generate me, do I generate it, does it overcome me, or do I overcome it, and is its breath the same as mine or opposite? Five relations, each in two polarities, make ten gods. Nothing new is added. The whole vocabulary is the same reckoning you already carry, read as kinship.",
      "Walk the ring. What shares my phase is my kin: in the same polarity the Companion （比肩）, shoulder to shoulder, and in the opposite Rob Wealth （劫財）, the rival who shares my nature and contends for what is mine. What I generate is my expression: in the same polarity the Eating God （食神）, expression that nourishes, and in the opposite the Hurting Officer （傷官）, brilliance that tests every authority it meets. What I overcome is my wealth: in the same polarity Indirect Wealth （偏財）, the windfall and the wide field, and in the opposite Direct Wealth （正財）, the honest wage and the kept store.",
      "Round the other side: what overcomes me is my pressure and my standing: in the same polarity Seven Killings （七殺）, the force that forges or breaks, and in the opposite the Direct Officer （正官）, rightful order, office and name. What generates me is my support: in the same polarity Indirect Resource （偏印）, learning that arrives by unmarked paths, and in the opposite Direct Resource （正印）, the seal of rightful support, the classic sign of the scholar.",
      "The gods gather around the Day Master like a court around a sovereign, and the reading of a chart is the reading of that court. A self ringed by Resource is schooled; a self ringed by Wealth is busy; a self pressed by Killings is forged early. No god is fortunate or ill on its own. Each is a relation, and the tradition's question is always the same: what does this sovereign make of the court it was given?",
    ],
    table: "gods",
    stoneTurn:
      "On Your Nature, name the god sitting above each pillar against the chart's Day Master. You will find the court of that life assembled there: what steadies it, what rivals it, what it produces and what presses upon it. The Mirror scroll reads that court aloud.",
  },

  dayun: {
    id: "dayun",
    epigraph: "命好不如運好，運好不如流年好。",
    epigraphSource: "A saying of the old readers: a fine chart is not the equal of a fine decade, and a fine decade is not the equal of a fine year. The road is read beside the chart.",
    paragraphs: [
      "（大運） [the Luck Pillars] are the decades a life walks through. The chart is the seed and the ground; the luck pillars are the weather of the years, arriving in ten-year seasons, each carrying its own stem and branch, its own phase and god. The tradition is careful with the word luck. These decades are the climates a seed grows through, and the same rain that swells one seed rots another.",
      "The sequence begins from the month pillar, the chart's season of strength, and steps forward or backward through the sixty pairs. The direction is set by the polarity of the year stem against the received nature of the life: yang year with a son, or yin year with a daughter, walks forward through the pairs; the other two pairings walk backward. The first decade begins some years after birth, counted from the distance to the nearest solar term, three days of distance reckoned as one year of life. So one child steps into the current almost at once and another waits nine years, and the tradition reads the waiting itself as part of the road.",
      "Each luck pillar is read exactly like a ninth and tenth character laid beside the eight: a new stem in heaven's place, a new branch in earth's, a new god arriving at the court. A decade of Resource schools the self; a decade of Wealth keeps it; a decade of Killings forges it. The old readers held that the chart names what a life is, and the luck pillars name when each part of it will be asked for.",
      "The Marrow of Heaven's Drops keeps the measure: 順則吉兮凶則悖 [going with the grain is fortune; going against it is misfortune]. The chart shows the seed, and the pillars show the seasons it will meet.",
    ],
    stoneTurn:
      "Your Nature stands still and the decades move. Beside it the first luck pillars are laid in the old order, rising from its month pillar, so you can see the road's opening turns with your own eyes. The Mirror scroll names the season this life first walked into.",
  },

  jian: {
    id: "jian",
    epigraph: "以銅為鑑，可以正衣冠；以人為鑑，可以明得失。",
    epigraphSource: "Words attributed to the Tang emperor Taizong on the death of his counsellor Wei Zheng: take bronze for a mirror and you may set your dress in order; take a person for a mirror and you may see clearly what is gained and lost.",
    paragraphs: [
      "（鑑） [the Mirror] is the last scroll, and it is a reading. Every scroll before this one has returned to Your Nature and shown one part of the art written in it; here the parts are gathered and the chart is read whole, aloud, in one voice, as it would be read for the reader who has stayed to the end.",
      "The order of the reading is the order of the scrolls. First the Day Master is named, for nothing in a chart means anything until the self is known. Then the season is weighed, for the month's decree tells whether the self stands supported, spent, pressed, or opposed. Then the census of the five phases is taken across all eight characters, heaviest first, and the room that stands empty is named as honestly as the one that is full. Then the pillars are read in their order, root to fruit, each in its own ground. Last, the court of the gods is assembled around the Day Master, and the shape of that court is spoken plainly.",
      "The Marrow of Heaven's Drops names what the reading listens for: 命貴中和 [a life is prized for its balance]. So every weight is held against the centre, the full room and the empty one alike. The reading describes the ground, the season and the court, and then it rests, and the road belongs to the one who walks it.",
      "The art was always passed from one reader to one listener, and the Mirror reads that way: to you, now, alone with the chart.",
    ],
    stoneTurn: "",
  },
};
