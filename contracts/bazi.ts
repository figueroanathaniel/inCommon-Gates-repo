/**
 * 八字 (BaZi) shared reckoning constants.
 * This file is the single source of truth for the stems, branches and phases.
 * It carries no prose voice; teaching prose lives in src/content.
 */

export type YinYang = "yang" | "yin";
export type Phase = "wood" | "fire" | "earth" | "metal" | "water";

export interface Stem {
  index: number; // 0..9
  hanzi: string;
  pinyin: string;
  english: string;
  yinyang: YinYang;
  phase: Phase;
  quality: string; // one declarative traditional line
  qualityZh: string;
}

export interface Branch {
  index: number; // 0..11
  hanzi: string;
  pinyin: string;
  english: string;
  animal: string;
  animalHanzi: string;
  yinyang: YinYang;
  phase: Phase;
  hours: string; // double hour it governs
  hiddenStems: number[]; // indexes into STEMS
  quality: string;
  hoursZh: string;
  qualityZh: string;
}

export const PHASES: Record<
  Phase,
  { hanzi: string; pinyin: string; english: string; generates: Phase; overcomes: Phase }
> = {
  wood: { hanzi: "木", pinyin: "mù", english: "Wood", generates: "fire", overcomes: "earth" },
  fire: { hanzi: "火", pinyin: "huǒ", english: "Fire", generates: "earth", overcomes: "metal" },
  earth: { hanzi: "土", pinyin: "tǔ", english: "Earth", generates: "metal", overcomes: "water" },
  metal: { hanzi: "金", pinyin: "jīn", english: "Metal", generates: "water", overcomes: "wood" },
  water: { hanzi: "水", pinyin: "shuǐ", english: "Water", generates: "wood", overcomes: "fire" },
};

export const STEMS: Stem[] = [
  { index: 0, hanzi: "甲", pinyin: "jiǎ", english: "Jia", yinyang: "yang", phase: "wood", quality: "the great tree, upright and reaching, first of the ten", qualityZh: "參天的大樹，挺直向上，十干之首" },
  { index: 1, hanzi: "乙", pinyin: "yǐ", english: "Yi", yinyang: "yin", phase: "wood", quality: "the climbing vine, yielding in form and persistent in aim", qualityZh: "攀緣的藤，形柔而志堅" },
  { index: 2, hanzi: "丙", pinyin: "bǐng", english: "Bing", yinyang: "yang", phase: "fire", quality: "the open sun, warming all it touches without favour", qualityZh: "當空的太陽，普照所及而無偏私" },
  { index: 3, hanzi: "丁", pinyin: "dīng", english: "Ding", yinyang: "yin", phase: "fire", quality: "the lamp flame, small in reach and exact in what it lights", qualityZh: "燈燭之火，所及雖小，所照分明" },
  { index: 4, hanzi: "戊", pinyin: "wù", english: "Wu", yinyang: "yang", phase: "earth", quality: "the mountain, unmoved, carrying what is placed upon it", qualityZh: "巍然的山，不動，承載置於其上之物" },
  { index: 5, hanzi: "己", pinyin: "jǐ", english: "Ji", yinyang: "yin", phase: "earth", quality: "the garden soil, receiving seed and turning it to harvest", qualityZh: "園圃的土，納種而化為收成" },
  { index: 6, hanzi: "庚", pinyin: "gēng", english: "Geng", yinyang: "yang", phase: "metal", quality: "the raw ore and the blade it becomes, hard and decisive", qualityZh: "礦中之金與所成之刃，剛而果決" },
  { index: 7, hanzi: "辛", pinyin: "xīn", english: "Xin", yinyang: "yin", phase: "metal", quality: "the wrought jewel, refined by pressure into brilliance", qualityZh: "琢成的寶石，經壓煉而生光彩" },
  { index: 8, hanzi: "壬", pinyin: "rén", english: "Ren", yinyang: "yang", phase: "water", quality: "the great river, moving around every obstacle toward the sea", qualityZh: "奔流的大江，繞過一切阻礙而入海" },
  { index: 9, hanzi: "癸", pinyin: "guǐ", english: "Gui", yinyang: "yin", phase: "water", quality: "the rain and the dew, quiet in falling and thorough in nourishing", qualityZh: "雨與露，降時無聲，滋潤周遍" },
];

export const BRANCHES: Branch[] = [
  { index: 0, hanzi: "子", pinyin: "zǐ", english: "Zi", animal: "Rat", animalHanzi: "鼠", yinyang: "yang", phase: "water", hours: "11 at night to 1 in the morning", hiddenStems: [9], quality: "the hour of deepest dark, where water is stillest and the seed of the day already turns", hoursZh: "夜十一時至凌晨一時", qualityZh: "至暗之時，水最靜處，一日之種已在其中轉動" },
  { index: 1, hanzi: "丑", pinyin: "chǒu", english: "Chou", animal: "Ox", animalHanzi: "牛", yinyang: "yin", phase: "earth", hours: "1 to 3 in the morning", hiddenStems: [5, 9, 7], quality: "the frozen field before dawn, patient earth holding warmth it does not yet show", hoursZh: "凌晨一時至三時", qualityZh: "黎明前的凍土，耐心的土，懷暖而未顯" },
  { index: 2, hanzi: "寅", pinyin: "yín", english: "Yin", animal: "Tiger", animalHanzi: "虎", yinyang: "yang", phase: "wood", hours: "3 to 5 in the morning", hiddenStems: [0, 2, 4], quality: "the first stir of wood at the year's true beginning, when yang rises in the dark", hoursZh: "凌晨三時至五時", qualityZh: "歲首真正的開端，木氣初動，陽生於暗中" },
  { index: 3, hanzi: "卯", pinyin: "mǎo", english: "Mao", animal: "Rabbit", animalHanzi: "兔", yinyang: "yin", phase: "wood", hours: "5 to 7 in the morning", hiddenStems: [1], quality: "the door of morning opening, wood in its gentler and quicker form", hoursZh: "清晨五時至七時", qualityZh: "晨門初開，木之柔而疾者" },
  { index: 4, hanzi: "辰", pinyin: "chén", english: "Chen", animal: "Dragon", animalHanzi: "龍", yinyang: "yang", phase: "earth", hours: "7 to 9 in the morning", hiddenStems: [4, 1, 9], quality: "the damp earth of late spring, where wood and water are stored together", hoursZh: "上午七時至九時", qualityZh: "暮春的濕土，木與水同藏其中" },
  { index: 5, hanzi: "巳", pinyin: "sì", english: "Si", animal: "Snake", animalHanzi: "蛇", yinyang: "yin", phase: "fire", hours: "9 to 11 in the morning", hiddenStems: [2, 6, 4], quality: "fire climbing toward its height, carrying metal hidden in its belly", hoursZh: "上午九時至十一時", qualityZh: "火升向其極，腹中暗藏金氣" },
  { index: 6, hanzi: "午", pinyin: "wǔ", english: "Wu", animal: "Horse", animalHanzi: "馬", yinyang: "yang", phase: "fire", hours: "11 in the morning to 1 in the afternoon", hiddenStems: [3, 5], quality: "the summit of the day, fire at its fullest, where yin is already conceived", hoursZh: "上午十一時至下午一時", qualityZh: "日之正中，火至其盛，陰已暗生" },
  { index: 7, hanzi: "未", pinyin: "wèi", english: "Wei", animal: "Goat", animalHanzi: "羊", yinyang: "yin", phase: "earth", hours: "1 to 3 in the afternoon", hiddenStems: [5, 3, 1], quality: "the warm earth of high summer, holding the ashes of fire and the root of wood", hoursZh: "下午一時至三時", qualityZh: "盛夏的暖土，藏火之餘燼與木之根" },
  { index: 8, hanzi: "申", pinyin: "shēn", english: "Shen", animal: "Monkey", animalHanzi: "猴", yinyang: "yang", phase: "metal", hours: "3 to 5 in the afternoon", hiddenStems: [6, 8, 4], quality: "metal newly born in autumn's first month, with water already springing within it", hoursZh: "下午三時至五時", qualityZh: "秋之首月，金氣初生，水已湧於其中" },
  { index: 9, hanzi: "酉", pinyin: "yǒu", english: "You", animal: "Rooster", animalHanzi: "雞", yinyang: "yin", phase: "metal", hours: "5 to 7 in the evening", hiddenStems: [7], quality: "the west at sundown, metal pure and singular, the vessel of wine at day's end", hoursZh: "傍晚五時至七時", qualityZh: "日落之西，金純而專，日暮的酒器" },
  { index: 10, hanzi: "戌", pinyin: "xū", english: "Xu", animal: "Dog", animalHanzi: "狗", yinyang: "yang", phase: "earth", hours: "7 to 9 in the evening", hiddenStems: [4, 7, 3], quality: "the dry earth of late autumn, the storehouse where fire is laid away", hoursZh: "晚上七時至九時", qualityZh: "晚秋的燥土，收藏火氣的庫" },
  { index: 11, hanzi: "亥", pinyin: "hài", english: "Hai", animal: "Pig", animalHanzi: "豬", yinyang: "yin", phase: "water", hours: "9 to 11 at night", hiddenStems: [8, 0], quality: "water gathering in the dark of the year, carrying the first wood of the next", hoursZh: "晚上九時至十一時", qualityZh: "歲暮之水聚於暗處，懷來年最初的木" },
];

/** The sixty 甲子 (Jiazi), the sexagenary pairs, by cycle index 0..59. */
export function jiazi(cycleIndex: number): { stem: Stem; branch: Branch } {
  const i = ((cycleIndex % 60) + 60) % 60;
  return { stem: STEMS[i % 10], branch: BRANCHES[i % 12] };
}

export interface FourPillars {
  yearStem: number;
  yearBranch: number;
  monthStem: number;
  monthBranch: number;
  dayStem: number;
  dayBranch: number;
  hourStem: number;
  hourBranch: number;
}

export const PILLAR_LABELS = [
  { key: "year", hanzi: "年柱", english: "Year Pillar", domain: "ancestry, the family one descends from, the earliest years", domainZh: "祖上、所出之家、最早的歲月" },
  { key: "month", hanzi: "月柱", english: "Month Pillar", domain: "parents, upbringing, the season of one's strength, one's work in the world", domainZh: "父母、成長、得力之季、在世之業" },
  { key: "day", hanzi: "日柱", english: "Day Pillar", domain: "the self and the spouse, the heart of the chart", domainZh: "自身與配偶，命盤之心" },
  { key: "hour", hanzi: "時柱", english: "Hour Pillar", domain: "children, those who carry the work onward, the later years, what one sends forward", domainZh: "子女、承業之人、晚年、所傳於後者" },
] as const;

/** 十神 (Ten Gods): the relation of another stem to the Day Master. */
export const TEN_GODS: Record<
  string,
  { hanzi: string; pinyin: string; english: string; reading: string; readingZh: string }
> = {
  companion: { hanzi: "比肩", pinyin: "bǐ jiān", english: "Companion", reading: "shoulder to shoulder, the same phase in the same polarity", readingZh: "並肩而立，同行同性" },
  robwealth: { hanzi: "劫財", pinyin: "jié cái", english: "Rob Wealth", reading: "the same phase in opposite polarity, a rival who shares your nature", readingZh: "同行異性，與己同質而相爭者" },
  eatinggod: { hanzi: "食神", pinyin: "shí shén", english: "Eating God", reading: "what the self produces in its own polarity, expression that nourishes", readingZh: "我所生之同性，滋養人的表達" },
  hurtingofficer: { hanzi: "傷官", pinyin: "shāng guān", english: "Hurting Officer", reading: "what the self produces in opposite polarity, brilliance that tests authority", readingZh: "我所生之異性，考驗權威的才華" },
  indirectwealth: { hanzi: "偏財", pinyin: "piān cái", english: "Indirect Wealth", reading: "what the self masters in the same polarity, the windfall and the wide field", readingZh: "我所剋之同性，意外之財與廣闊之田" },
  directwealth: { hanzi: "正財", pinyin: "zhèng cái", english: "Direct Wealth", reading: "what the self masters in opposite polarity, the honest wage and the kept store", readingZh: "我所剋之異性，正當的酬勞與守住的積存" },
  sevenkillings: { hanzi: "七殺", pinyin: "qī shā", english: "Seven Killings", reading: "what masters the self in the same polarity, pressure that forges or breaks", readingZh: "剋我之同性，或鍛或折的壓力" },
  directofficer: { hanzi: "正官", pinyin: "zhèng guān", english: "Direct Officer", reading: "what masters the self in opposite polarity, rightful order and standing", readingZh: "剋我之異性，正當的秩序與名位" },
  indirectresource: { hanzi: "偏印", pinyin: "piān yìn", english: "Indirect Resource", reading: "what generates the self in the same polarity, unconventional learning", readingZh: "生我之同性，由無名小徑而來的學問" },
  directresource: { hanzi: "正印", pinyin: "zhèng yìn", english: "Direct Resource", reading: "what generates the self in opposite polarity, the seal of rightful support", readingZh: "生我之異性，正當扶持之印" },
};

const godKey = (samePolarity: boolean, rel: "same" | "produces" | "masters" | "masteredBy" | "generatedBy"): string => {
  switch (rel) {
    case "same": return samePolarity ? "companion" : "robwealth";
    case "produces": return samePolarity ? "eatinggod" : "hurtingofficer";
    case "masters": return samePolarity ? "indirectwealth" : "directwealth";
    case "masteredBy": return samePolarity ? "sevenkillings" : "directofficer";
    case "generatedBy": return samePolarity ? "indirectresource" : "directresource";
  }
};

export function tenGodOf(dayStem: Stem, other: Stem): { key: string; hanzi: string; pinyin: string; english: string; reading: string; readingZh: string } {
  const same = dayStem.yinyang === other.yinyang;
  let rel: "same" | "produces" | "masters" | "masteredBy" | "generatedBy";
  if (other.phase === dayStem.phase) rel = "same";
  else if (PHASES[dayStem.phase].generates === other.phase) rel = "produces";
  else if (PHASES[dayStem.phase].overcomes === other.phase) rel = "masters";
  else if (PHASES[other.phase].overcomes === dayStem.phase) rel = "masteredBy";
  else rel = "generatedBy";
  const key = godKey(same, rel);
  return { key, ...TEN_GODS[key] };
}

/** The scrolls of the Academy, in the order they are unrolled. */
export const LESSONS = [
  { id: "yuan", order: 0, hanzi: "緣", english: "The Prologue", title: "Why the Eight Characters are read at all", titleZh: "何以讀八字" },
  { id: "tiangan", order: 1, hanzi: "天干", english: "The Heavenly Stems", title: "Ten signs of heaven's turning", titleZh: "天行的十個記號" },
  { id: "dizhi", order: 2, hanzi: "地支", english: "The Earthly Branches", title: "Twelve mansions of the year and the day", titleZh: "歲與日的十二宮" },
  { id: "wuxing", order: 3, hanzi: "五行", english: "The Five Phases", title: "The generating and overcoming rounds", titleZh: "相生與相剋二輪" },
  { id: "yinyang", order: 4, hanzi: "陰陽", english: "Yin and Yang", title: "The two breaths that move the ten and the twelve", titleZh: "運行十干十二支的二氣" },
  { id: "sizhu", order: 5, hanzi: "八字", english: "BaZi", title: "How one moment becomes eight characters", titleZh: "一個時刻如何成為八字" },
  { id: "shishen", order: 6, hanzi: "十神", english: "The Ten Gods", title: "The relations that gather around the Day Master", titleZh: "環繞日主的諸般關係" },
  { id: "dayun", order: 7, hanzi: "大運", english: "The Luck Pillars", title: "The decades a life walks through", titleZh: "一生所行的十年" },
  { id: "jian", order: 8, hanzi: "鑑", english: "The Mirror", title: "The Destiny Chart read whole", titleZh: "通讀命盤" },
] as const;

export type LessonId = (typeof LESSONS)[number]["id"];
