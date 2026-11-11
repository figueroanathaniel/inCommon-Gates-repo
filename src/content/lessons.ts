/**
 * The scrolls of the Academy, each written twice: once wholly in English,
 * once wholly in traditional Chinese. The reader chooses one; the two are
 * never mixed on one page.
 *
 * Voice law, inherited from inCommon and binding here:
 *  - Attribute once, then speak declaratively inside the frame.
 *  - No machinery vocabulary: no calculate, compute, algorithm, data,
 *    process, system, function, output, input, variable, parameter.
 *  - No em dashes anywhere, in either language. A period, a comma, or a colon.
 *  - The English scroll names every sign in English alone (Jia, Zi, the
 *    Day Master). The Chinese scroll names it by its character alone.
 *  - Nothing is ever declared to be fated. The tradition describes
 *    weights, seasons and relations; the life remains the reader's.
 *
 * The history is kept to what was read: Li Xuzhong of the Tang through
 * Han Yu's epitaph for him, the verses of the Marrow of Heaven's Drops and
 * Ren Tieqiao's notes on them, and the opening of the True Commentary on
 * Ziping. What rests on later report, such as Xu Ziping and the stem of the
 * day, is said as remembered.
 *
 * The Chinese text is this house's own rendering and has not yet been read
 * by a native reader.
 */

export interface LessonBody {
  id: string;
  /** The line as the old book wrote it. */
  epigraphZh: string;
  /** Where it was written, in Chinese. */
  sourceZh: string;
  /** The same line carried into English. */
  epigraphEn: string;
  /** Where it was written, in English. */
  sourceEn: string;
  paragraphs: string[];
  paragraphsZh: string[];
  table?: "stems" | "branches" | "phases" | "gods" | "jiazi";
  /** How Your Nature enters this scroll once it stands inscribed. */
  stoneTurn: string;
  stoneTurnZh: string;
}

export const LESSON_BODY: Record<string, LessonBody> = {
  yuan: {
    id: "yuan",
    epigraphZh: "易與天地準，故能彌綸天地之道。",
    sourceZh: "《易·繫辭上》",
    epigraphEn: "The Change measures itself against heaven and earth, and so it can enfold the way of heaven and earth entire.",
    sourceEn: "The Book of Changes, Appended Statements",
    paragraphs: [
      "BaZi, the Eight Characters, reads the moment of a birth as four pairs of signs. The pairs are the year, the month, the day and the hour, and each one sets a sign of heaven over a sign of earth. That makes four pillars and eight characters, and a whole life fits on a sheet the size of a letter.",
      "The first reader with a name is Li Xuzhong, a censor of the Tang who died in 813. His friend Han Yu wrote his epitaph and remembered him as the man who went deepest into the books of the Five Phases. From the year, month and day of a birth he weighed how long a life would run, how high it would rise, and where it would meet ease or difficulty, and he was seldom wrong. The same epitaph remembers that he took an elixir of quicksilver and hoped not to die. He could read the length of other lives and still wanted more of his own. The art has carried both wishes ever since, to know the shape of a life and to meet it well.",
      "Under the Song the hour joined the year, the month and the day. The art took the name it is still taught under, Ziping, after Xu Ziping, and the tradition remembers him for setting the stem of the day at the centre of the chart. His line's teaching was gathered in the Deep Sea of Ziping. Under the Ming, Wan Minying is credited with drawing the whole field together in the Compendium of the Three Destinies.",
      "Two later books gave the art its discipline and its reason. The True Commentary on Ziping, by Shen Xiaozhan of the Qing, sends every reading back to one question, which is how the self of the day stands against the season of its month. The Marrow of Heaven's Drops, a verse long credited to Liu Ji of the early Ming, says why anyone should read a chart at all. It is to open the ears and eyes of the people of this world. Its great commentator, Ren Tieqiao, filled it with five hundred and twelve charts of real lives.",
      "This hall keeps to that method. One true chart, Your Nature, stands at its centre, and every scroll comes back to it. By the last scroll the grammar of the art is something you have seen written in a life.",
      "The Marrow puts the heart of the matter in one line. Going with the grain is fortune, and going against it is misfortune. The eight characters show the grain of a life, the ground it was planted in and the weather it was born under. The walking is still yours.",
    ],
    paragraphsZh: [
      "八字，是把一個出生的時刻讀作四對記號：年、月、日、時，每一對都是一個天干立於一個地支之上。四柱八字，一生鋪展在一張不過書信大小的紙上。",
      "有名可考的第一位讀者是李虛中，唐代的御史，卒於八一三年。他的朋友韓愈為他寫墓誌，記他於五行之書鑽研最深。他依人出生的年、月、日，推一生的長短、所至的高低、何處遇順、何處遇逆，少有不中。同一篇墓誌也記他服食水銀之藥，冀求不死。一個能讀出他人壽數的人，想延長自己的壽數。此術從此帶著這兩種願望：知一生之形，並好好與之相遇。",
      "到了宋代，時辰加入年、月、日之列，此術也得了至今仍沿用的名字「子平」，取自徐子平；傳統記他把日干立為命盤的中心。其一脈之學輯為《淵海子平》；明代的萬民英，被認為把全域匯為一書，即《三命通會》。",
      "後來有兩部書，給了此術紀律與理由。清代沈孝瞻的《子平真詮》，把一切論斷歸於一問：日之自身，對其月之季令。而《滴天髓》，一篇長久以來歸於明初劉基的韻文，說出人為何要讀命：「要與人間開聾聵。」其大注家任鐵樵，以五百一十二個真實人生的命例充實其書。",
      "此院守此方法。一張真正的命盤立於中心，名為本命，每一卷都回到它，直到此術的文法，成為在一個人一生之中親眼看見的文字。",
      "《滴天髓》以一句道出要旨：「順則吉兮凶則悖。」八字顯出一生的紋理，所植之地，與所生之天候。行路的，是行路之人。",
    ],
    stoneTurn:
      "Your Nature stands at the centre of this hall. Once it is inscribed, every scroll you have read can be found written in it. The last scroll reads it whole, aloud, in one voice, for the reader who stayed to hear it.",
    stoneTurnZh:
      "本命立於此院之中。一旦刻成，你讀過的每一卷都將在其中找到；最後一卷，會為留下來聆聽的讀者，以一個聲音，把它完整地讀出來。",
  },

  tiangan: {
    id: "tiangan",
    epigraphZh: "欲識三元萬法宗，先觀帝載與神功。",
    sourceZh: "《滴天髓·天道》",
    epigraphEn: "To know the three origins, the root of every method, look first at what heaven carries and the work of its spirit.",
    sourceEn: "The Marrow of Heaven's Drops, the Way of Heaven",
    paragraphs: [
      "The Heavenly Stems are the ten signs of heaven's turning. Their order is older than the dynasties that kept it, and it runs Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, Gui. They are the five phases taken twice each, once in the fullness of yang and once in the refinement of yin. It is one breath moving through ten shapes.",
      "Meet them in turn. Jia rises first, the great tree pushing up through the split seed. Yi bends and finds its way, wood as the vine. Bing shows itself at noon and warms whatever it reaches. Ding carries a flame indoors and lights exactly one room. Wu stands as the mountain. Ji opens as garden soil and takes in whatever falls. Geng comes out of the ore as a blade. Xin is pressed and polished into the jewel. Ren runs in flood toward the sea. Gui falls as quiet rain and closes the round where every seed begins.",
      "Each stem carries three things. It has its phase, its breath of yin or yang, and the shape that phase takes in that breath. Yang wood is the tree and yin wood is the vine. Hold all three and a stem becomes something you know on sight.",
      "In a chart the stems stand above, in heaven's place, and show what a life wears on its face. What it keeps in the cellar belongs to the branches.",
    ],
    paragraphsZh: [
      "天干是天行的十個記號，其次序比守護它的朝代還要古老：甲、乙、丙、丁、戊、己、庚、辛、壬、癸。它們是五行各取兩次，一次為陽之盈，一次為陰之精：一氣行於十形。",
      "依次與之相識。甲最先升起，是破種而出的大樹。乙彎曲而自尋其路，是如藤之木。丙在正午自明，溫暖所及的一切；丁把火帶進屋內，恰好照亮一室。戊立而為山。己開而為園土，承受落下的一切。庚自礦中出而為刃；辛經壓磨而成寶石。壬奔流成洪，向海而去；癸化為靜雨，合上一切種子開始之處的這一輪。",
      "每一干帶著它的五行、它的陰陽，以及這一行在這一氣中所取的形。陽木是樹，陰木是藤。三者兼持，一干便成為可以認出的存在。",
      "在命盤中，天干居上，在天之位，顯出一生示於面上的樣子。藏於窖中的，屬於地支。",
    ],
    table: "stems",
    stoneTurn:
      "On Your Nature, look first at the four signs along the top of the pillars. Those are the chart's four stems, the things that life says out loud. The third of them is the stem of the day, and the whole art turns around it.",
    stoneTurnZh:
      "在本命上，先看四柱頂端的四個字。那是此盤的四干，那一生明白宣示之處。其中第三個，日干，是整門學問所環繞的那一個。",
  },

  dizhi: {
    id: "dizhi",
    epigraphZh: "干為天元，支為地元，支中所藏為人元。",
    sourceZh: "任鐵樵注《滴天髓》",
    epigraphEn: "The stems are heaven's origin, the branches earth's origin, and what the branches store is the human origin.",
    sourceEn: "Ren Tieqiao on the Marrow of Heaven's Drops",
    paragraphs: [
      "The Earthly Branches are the twelve mansions the year and the day pass through. They run Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, Hai. The stems are heaven's breath and the branches are earth's body. They are the twelve months of the year and the twelve double hours of the day. They are also the twelve creatures the branches are first remembered by, the Rat, the Ox, the Tiger, the Rabbit, the Dragon, the Snake, the Horse, the Goat, the Monkey, the Rooster, the Dog and the Pig.",
      "The creatures are a house for the memory. Under each one, a branch is a season, an hour and a phase of the world's breathing. Zi is the hour of deepest night and the month of the solstice. Water is at its stillest there, and the next year's yang is already conceived in the dark. Wu is high noon and high summer. Fire is at its summit there, and yin is already conceived in the same way. The twelve make one circle of breathing, out and in, and every branch holds the seed of its own turning.",
      "Each branch also keeps what the tradition calls the hidden stems. These are the one, two or three stems stored inside it, like provisions in a cellar. Zi keeps only Gui, pure water with nothing else laid by. Chou keeps three, Ji the soil, Gui the meltwater and Xin the metal asleep in frozen ground. The hidden stems are why the branches are read as what a life holds in reserve. They are the abilities it does not wear on its face, and they come up in their season.",
      "In a chart the branches stand below, in the place of earth, and the tradition reads them as root, season and dwelling. The stem declares and the branch sustains. When the two agree, the pillar stands firm. When they pull against each other, the reading says so out loud, because that is where a life does its work.",
    ],
    paragraphsZh: [
      "地支是歲與日所經的十二宮：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。天干是天之氣，地支是地之體：一年的十二個月，一日的十二時辰，以及最先用來記住地支的十二生肖：鼠、牛、虎、兔、龍、蛇、馬、羊、猴、雞、狗、豬。",
      "生肖是一座記憶之屋。每一生肖之下，地支是一季、一時、世界呼吸的一相。子是最深的夜時，也是冬至之月，水最靜之處，來年之陽已在暗中受孕。午是正午，也是盛夏，火至其巔，陰亦已在其中受孕。十二支是一圈呼吸，一出一入，每一支都懷著自身轉變的種子。",
      "每一地支也藏著傳統所稱的藏干，一、二或三個天干藏於其中，如窖中之糧。子只藏癸，純水，別無他物。丑藏三者：己為土，癸為融雪之水，辛為眠於凍土中的金。正因有藏干，地支被讀為一生所儲之力：不顯於面的才具，到了它的季節才浮現。",
      "在命盤中，地支居下，在地之位，傳統讀之為根、為季、為所居。天干宣示，地支承載。兩者相合，一柱立穩；兩者相拉，這股張力便被說出，因為那正是一生用力之處。",
    ],
    table: "branches",
    stoneTurn:
      "On Your Nature, the four signs along the bottom of the pillars are its branches, the seasons and hours that life was rooted in. One of them, the branch of the month, outweighs the rest. The scroll of the Five Phases shows why.",
    stoneTurnZh:
      "在本命上，四柱底部的四個字是它的地支：那一生所紮根的季節與時辰。其中一支，月支，重於其餘；五行一卷會讓你看見原因。",
  },

  wuxing: {
    id: "wuxing",
    epigraphZh: "五行：一曰水，二曰火，三曰木，四曰金，五曰土。",
    sourceZh: "《尚書·洪範》",
    epigraphEn: "Of the five phases, the first is called water, the second fire, the third wood, the fourth metal, the fifth earth.",
    sourceEn: "The Book of Documents, the Great Plan",
    paragraphs: [
      "The Five Phases usually come into English as the five elements. The art reads them as movements. Wood rises and spreads. Fire flares upward. Earth receives and ripens. Metal gathers and hardens. Water sinks and stores. A stem or a branch takes part in its phase the way a dancer takes part in a dance.",
      "The first round to learn is the generating cycle, the order in which each phase gives birth to the next. Wood feeds fire. Fire makes earth of its ash. Earth bears metal in its veins. Metal gathers water the way dew gathers on cool bronze. Water nourishes wood, and the round closes. Nothing in it comes first and nothing comes last. It is a ring of mothers, and the tradition holds that every chart is a small picture of this ring, whole or strained.",
      "The second round is the overcoming cycle, and it is kept with care, because it is the round of governance. Wood parts earth with its roots. Earth dams water. Water quenches fire. Fire melts metal. Metal's edge fells wood. The old readers called this the cycle of control, the way a bank guides a river. A chart where one phase runs unchecked is read as a chart out of balance, and the overcoming round is how the world puts that right.",
      "Every judgement in the art comes back to these two rounds. When you meet a stem, ask what generates it and what it generates, then what it overcomes and what overcomes it. By then you have already begun to read. The pillars, the gods and the decades are the same two rounds in formal dress.",
    ],
    paragraphsZh: [
      "五行，英文常譯作五種元素。此術讀之為五種運動：木，升發舒展之動；火，炎上之動；土，承受成熟之動；金，收斂堅凝之動；水，潤下收藏之動。一干一支參與其行，如舞者參與一場舞。",
      "先學的一輪是相生，五行依次生下一行之序：木生火，火燃成灰而為土，土於礦脈中生金，金聚水如露凝於涼銅，水養木，合成一輪。此輪無首無尾。它是一環母親，傳統以為每一張命盤，都是這一環的小小縮影，或完整，或受壓。",
      "第二輪是相剋，傳統慎重持守，因為它是治理之輪：木以根破土，土築堤擋水，水滅火，火熔金，金之刃伐木。古之讀者稱之為制約之輪，如堤岸引導江河。一行獨盛而無所制的命盤，被讀為失衡；相剋之輪，是世間自有的調劑。",
      "此術的每一個論斷，都回到這兩輪。遇見一干，問何者生它，它生何者，它剋何者，何者剋它，你便已開始讀了。其餘的一切，四柱、十神、大運，都是這兩輪穿上了正式的衣裳。",
    ],
    table: "phases",
    stoneTurn:
      "Hold the two rounds in mind and look at Your Nature. Count the phases among its eight signs. You will see at once which movement this chart is heavy with and which it barely holds. The Mirror scroll says aloud what that weight has meant.",
    stoneTurnZh:
      "心中持此二輪，看你的本命。數一數八字中的五行。你一眼便能看出此盤重於哪一種運動、幾乎不含哪一種，而鑑之一卷會說出這份重量曾意味著什麼。",
  },

  yinyang: {
    id: "yinyang",
    epigraphZh: "一陰一陽之謂道。",
    sourceZh: "《易·繫辭上》",
    epigraphEn: "One yin, one yang, this is called the Way.",
    sourceEn: "The Book of Changes, Appended Statements",
    paragraphs: [
      "Yin and Yang are the two breaths under everything you have unrolled so far. Yang rises, declares and moves outward. It is the sunlit face of the hill, the day, and the stem that stands like a tree. Yin settles, receives and works within. It is the shaded face of the hill, the night, and the stem that climbs like a vine. The tradition is exact about one thing above all. The two breaths are equal, and they always arrive together. The sunlit face is there because the shaded one is.",
      "The ten stems are the five phases taken in both breaths, and the old images let you feel the difference. Bing is yang fire, the open sun that warms without choosing. Ding is yin fire, the lamp that lights exactly one room. Ren is yang water, the river in flood that goes round nothing because it goes through. Gui is yin water, the dew that has touched every leaf by morning. The phase is the same and the manner is opposite. A yang stem gets there by declaring, and a yin stem gets there by keeping on.",
      "The twelve branches change polarity as they turn. Zi is yang, Chou is yin, Yin is yang, Mao is yin, and so on round the circle, breath out and breath in, hour by hour and month by month. This is why the cycle has sixty pairs and not a hundred and twenty. A yang stem only ever rides a yang branch, and a yin stem a yin branch. The pairs are matched breath to breath, and the whole round of sixty breathes in step.",
      "When a chart is read, polarity is the first thing that sharpens a judgement. A Companion in the same polarity is a true shoulder beside yours. In the opposite polarity it turns into the rival who wants what you want. Yin and yang leave a sign its nature and change how it comes at you. The reading listens for the manner before the meaning.",
    ],
    paragraphsZh: [
      "陰陽，是你至今所展開的一切之下的二氣。陽是上升、宣示、向外之氣：山的向陽面，白晝，如樹而立的干。陰是安定、承受、向內作工之氣：山的背陰面，黑夜，如藤攀緣的干。傳統於一事最為精確：二氣相等，且總是同來。向陽之面之所以存在，是因為有背陰之面。",
      "十干是五行各取二氣，在古老的意象裡能感到其分別。丙是陽火，不擇而暖的太陽；丁是陰火，恰好照亮一室的燈。壬是陽水，洪流不繞過任何物，因為它直穿而過；癸是陰水，清晨時觸遍每一片葉的露。同一行，相反的方式。陽干以宣示成事，陰干以堅持成事。",
      "十二地支隨其轉動而陰陽交替：子陽，丑陰，寅陽，卯陰，如此繞圈，一出一入，時時月月。這就是為什麼六十甲子是六十而不是一百二十：陽干只乘陽支，陰干只乘陰支。干支以氣配氣，整個六十花甲同步呼吸。",
      "讀盤之時，陰陽是每一論斷的第一層細辨。同性的比肩，是真正並立的肩膀；異性時，它便成了想要你所要之物的對手。陰陽不改一個記號的本性，而塑造它走向你的方式；先聽其方式，再聽其意義。",
    ],
    stoneTurn:
      "Count the yang signs and the yin signs on Your Nature. Few charts hold them in equal number, and this one is no different. The Mirror scroll names the balance honestly, as one more weight among the rest.",
    stoneTurnZh:
      "數一數你本命上的陽與陰。很少有命盤兩者數目相等，這一張也不例外。鑑之一卷會如實說出這份平衡，作為諸多重量中的一份。",
  },

  sizhu: {
    id: "sizhu",
    epigraphZh: "年為根，月為苗，日為花，時為果。",
    sourceZh: "命家古訣",
    epigraphEn: "The year is the root, the month the sprout, the day the flower, the hour the fruit.",
    sourceEn: "An old verse of the art",
    paragraphs: [
      "BaZi is the whole building of the art, and the four pillars are its frame. Take one moment of birth and write it four times, as the year, the month, the day and the hour, each a pair of signs. Set the four pairs side by side with each stem above its branch, and you have the eight characters the art is named for. The old verse calls them root, sprout, flower and fruit, and the order teaches something. The year is what you grew from, and the hour is what you send forward.",
      "Each pillar keeps its own ground in a life. The Year Pillar holds ancestry and the earliest years, the family one comes from and the first weather one remembers. The Month Pillar holds parents, upbringing and one's work in the world. Its branch is the month's decree, the season that weighs more than any other of the eight characters. The Day Pillar holds the self and the spouse. Its stem is the Day Master, the one character the whole chart is read against, and its branch is the ground one's closest companion stands on. The Hour Pillar holds children, those who carry the work onward, and the later years. It is the fruit, what the tree finally offers.",
      "The pillars are cast, and the casting is exact. The year turns at the Beginning of Spring, near the fourth of February, so a child born in late January belongs to the pillar of the year just closing. The months turn at the solar terms, and each branch reigns from its own term. The days turn in a round of sixty that no dynasty has interrupted. The hours turn in the twelve double hours, with Zi holding the night from eleven to one. When the hour of birth is unknown, the chart stands on three pillars, as Li Xuzhong's charts once did.",
      "In the old manner the pillars are read from right to left, the way the tradition writes. The year is at the right hand and the hour at the left. The day sits one step left of centre, so the self always stands a little west of the middle of its own life. Everything this house keeps is written in that order. Your Nature is set in that order too, exactly as a chart would be laid out for a reading.",
    ],
    paragraphsZh: [
      "八字是此術的整體結構，四柱是它的框架。取一個出生的時刻，寫四遍：年為一對記號，月為一對，日為一對，時為一對。把四對並排，每一干立於其支之上，便得此術所以為名的八個字。根、苗、花、果，古訣如此稱之，而其次序本身就是教導：年是你所由生，時是你所傳於後。",
      "每一柱在一生中各有所主。年柱主祖上與幼年，所出之家，與記憶中最早的天候。月柱主父母、成長與在世之業；其地支為月令，八字之中份量最重的一季。日柱主自身與配偶：其天干為日主，全盤皆依之而讀的那一個字；其地支為至親之伴所立之地。時柱主子女、承業之人與晚年：果實，樹最終所獻者。",
      "四柱有其排法，而排法精確。年以立春為界，約在二月四日前後；一月下旬出生的孩子，屬於正在結束的那一年。月以節氣為界，每一支自其節起而當令。日以不斷的六十日一輪而轉，沒有任何朝代打斷過它；時以十二時辰而轉，子時掌夜裡十一時至一時。出生時辰不詳者，命盤立於三柱之上，如李虛中當年的命盤。",
      "依古法立於命盤之前，四柱自右而左讀，如傳統的書寫：年在右手，時在左手，日在中間偏左一步，自身總是立在自己一生正中略西之處。此院所藏的一切都依此序書寫，你的本命也依此序排列，正如一張命盤為讀盤而鋪開時那樣。",
    ],
    stoneTurn:
      "This is the scroll where Your Nature stops being an emblem and becomes a chart. Stand in front of it now and read its four pillars in order, year to hour, root to fruit. You know what ground each one holds. The next scroll shows how the eight characters speak to one another.",
    stoneTurnZh:
      "正是在這一卷，本命不再只是一個象徵，而成為一張命盤。現在立於其前，依序讀其四柱，從年到時，從根到果。你知道每一柱所主。下一卷會讓你看見八個字如何彼此言語。",
  },

  shishen: {
    id: "shishen",
    epigraphZh: "以日干配月令地支，而生剋不同，格局分焉。",
    sourceZh: "《子平真詮》",
    epigraphEn: "Set the stem of the day against the branch of the month's decree, and as their feeding and overcoming differ, the structures divide.",
    sourceEn: "The True Commentary on Ziping",
    paragraphs: [
      "The Ten Gods are the ten relations any sign can have to the Day Master, and they come entirely out of the two rounds you already hold. Take the Day Master's phase and polarity and set another stem beside it. Then ask the old questions. Is it the same phase as me? Does it generate me, or do I generate it? Does it overcome me, or do I overcome it? Is its breath the same as mine or the opposite? Five relations in two polarities make ten gods. Nothing new is added. It is the reckoning you already carry, read as kinship.",
      "Walk the ring. What shares my phase is my kin. In the same polarity it is the Companion, shoulder to shoulder. In the opposite it is Rob Wealth, the rival who shares my nature and contends for what is mine. What I generate is my expression. In the same polarity it is the Eating God, expression that nourishes. In the opposite it is the Hurting Officer, brilliance that tests every authority it meets. What I overcome is my wealth. In the same polarity it is Indirect Wealth, the windfall and the wide field. In the opposite it is Direct Wealth, the honest wage and the kept store.",
      "Now the other side. What overcomes me is my pressure and my standing. In the same polarity it is Seven Killings, the force that forges or breaks. In the opposite it is the Direct Officer, rightful order, office and name. What generates me is my support. In the same polarity it is Indirect Resource, learning that arrives by unmarked paths. In the opposite it is Direct Resource, the seal of rightful support and the classic sign of the scholar.",
      "The gods gather round the Day Master like a court round a sovereign, and reading a chart is reading that court. A self ringed by Resource is schooled. A self ringed by Wealth is busy. A self pressed by Killings is forged early. No god is fortunate or ill by itself. Each one is a relation, and the tradition always asks the same thing. What does this sovereign make of the court it was given?",
    ],
    paragraphsZh: [
      "十神，是任一記號對日主所能有的十種關係，全由你已掌握的兩輪推出。取日主的五行與陰陽，置另一干於其旁，問古老的問題：它與我同行嗎？它生我嗎？我生它嗎？它剋我嗎？我剋它嗎？它的氣與我同，還是相反？五種關係，各分兩性，便是十神。沒有加入任何新東西。整套名目，就是你已帶著的同一推演，讀作親屬。",
      "繞此環而行。與我同行者為我之親：同性為比肩，並肩而立；異性為劫財，與我同質、爭我所有的對手。我所生者為我之表達：同性為食神，滋養人的表達；異性為傷官，考驗一切所遇權威的才華。我所剋者為我之財：同性為偏財，意外之財與廣闊之田；異性為正財，正當的酬勞與守住的積存。",
      "另一側：剋我者為我之壓力與名位：同性為七殺，或鍛或折之力；異性為正官，正當的秩序、官職與名聲。生我者為我之扶持：同性為偏印，由無名小徑而來的學問；異性為正印，正當扶持之印，讀書人的典型標記。",
      "諸神環繞日主，如朝臣環繞君主；讀一張命盤，便是讀這一朝。被印星環繞的自身受教；被財星環繞的自身忙碌；被七殺所壓的自身早經鍛鍊。沒有一神本身是吉或凶。每一神都是一種關係，而傳統之問始終如一：這位君主如何對待它所得的朝廷？",
    ],
    table: "gods",
    stoneTurn:
      "On Your Nature, name the god that sits above each pillar, measured against the chart's Day Master. The court of that life is assembled there. You will see what steadies it, what rivals it, what it produces and what presses on it. The Mirror scroll reads that court aloud.",
    stoneTurnZh:
      "在本命上，以此盤的日主為準，說出每一柱之上所坐之神。你會看到那一生的朝廷聚集於此：什麼穩住它，什麼與它相爭，它產出什麼，什麼壓在它身上。鑑之一卷會把這一朝讀出來。",
  },

  dayun: {
    id: "dayun",
    epigraphZh: "命好不如運好，運好不如流年好。",
    sourceZh: "命家古諺",
    epigraphEn: "A fine chart is not the equal of a fine decade, and a fine decade is not the equal of a fine year.",
    sourceEn: "A saying of the old readers",
    paragraphs: [
      "The Luck Pillars are the decades a life walks through. The chart is the seed and the ground. The luck pillars are the weather of the years, and it arrives in seasons of ten years, each with its own stem and branch, its own phase and its own god. The tradition is careful with the word luck. These decades are the climates a seed grows through, and the same rain that swells one seed rots another.",
      "The sequence starts from the month pillar, the chart's season of strength, and steps forward or backward through the sixty pairs. The direction comes from the polarity of the year stem set against the received nature of the life. A yang year with a son, or a yin year with a daughter, walks forward through the pairs. The other two pairings walk backward. The first decade begins some years after birth. The years are counted from the distance to the nearest solar term, with three days of distance reckoned as one year of life. So one child steps into the current almost at once and another waits nine years, and the tradition reads the waiting as part of the road.",
      "Each luck pillar is read like a ninth and tenth character laid beside the eight. It brings a new stem to heaven's place, a new branch to earth's, and a new god to the court. A decade of Resource schools the self. A decade of Wealth keeps it. A decade of Killings forges it. The old readers held that the chart names what a life is, and the luck pillars name when each part of it will be asked for.",
      "The Marrow of Heaven's Drops keeps the measure. Going with the grain is fortune, and going against it is misfortune. The chart shows the seed, and the pillars show the seasons it will meet.",
    ],
    paragraphsZh: [
      "大運，是一生所行的十年。命盤是種子與土地；大運是歲月的天候，以十年為一季而來，各帶其干支、其五行與其神。傳統對「運」字很謹慎。這些十年是種子生長所經的氣候，同一場雨，能使一粒種子飽滿，也能使另一粒腐爛。",
      "其序從月柱起，即此盤得力之季，在六十甲子中順行或逆行。方向由年干的陰陽與命主出生時所受之性而定：陽年男命、陰年女命，順行；另外兩種配合，逆行。第一步大運始於出生數年之後，以出生至最近節氣的距離計，三日之距折為一歲。所以有的孩子幾乎立刻踏入其流，有的要等九年，傳統把這等待本身也讀為路的一部分。",
      "每一步大運，讀法正如置於八字之旁的第九、第十個字：天位上一個新的干，地位上一個新的支，一位新神來到朝中。印運教養自身；財運守持自身；殺運鍛鍊自身。古之讀者以為，命盤說出一生是什麼，大運說出其中每一部分何時被召喚。",
      "《滴天髓》守其分寸：「順則吉兮凶則悖。」命盤顯示種子，大運顯示它將遇見的季節。",
    ],
    stoneTurn:
      "Your Nature stands still and the decades move. The first luck pillars are laid beside it in the old order, rising from its month pillar, so you can see the first turns of the road for yourself. The Mirror scroll names the season this life first walked into.",
    stoneTurnZh:
      "本命不動，十年移行。其旁依古序排出最初幾步大運，自月柱而起，讓你親眼看見這條路開頭的轉折。鑑之一卷會說出此生最先踏入的季節。",
  },

  jian: {
    id: "jian",
    epigraphZh: "以銅為鑑，可以正衣冠；以人為鑑，可以明得失。",
    sourceZh: "相傳唐太宗悼魏徵之語",
    epigraphEn: "Take bronze for a mirror and you may set your dress in order; take a person for a mirror and you may see clearly what is gained and lost.",
    sourceEn: "Words attributed to the Tang emperor Taizong on the death of his counsellor Wei Zheng",
    paragraphs: [
      "The Mirror is the last scroll, and it is a reading. Every scroll before this one came back to Your Nature and showed one part of the art written in it. Here the parts are gathered and the chart is read whole, aloud, in one voice, the way it would be read for the reader who stayed to the end.",
      "The reading follows the order of the scrolls. First the Day Master is named, because nothing in a chart means anything until the self is known. Then the season is weighed, because the month's decree tells whether the self stands supported, spent, pressed or opposed. Then the five phases are counted across all eight characters, heaviest first, and the empty room is named as honestly as the full one. Then the pillars are read in order, root to fruit, each in its own ground. Last, the court of the gods is assembled round the Day Master, and the shape of that court is said plainly.",
      "The Marrow of Heaven's Drops names what the reading listens for. A life is prized for its balance. So every weight is held against the centre, the full room and the empty one alike. The reading describes the ground, the season and the court, and then it rests. The road belongs to the one who walks it.",
      "The art was always passed from one reader to one listener, and the Mirror reads that way. It reads to you, now, alone with the chart.",
    ],
    paragraphsZh: [
      "鑑是最後一卷，它本身就是一次讀盤。此前每一卷都回到本命，顯示此術的一部分寫在其中；在這裡，各部分被收攏，命盤被完整地、以一個聲音讀出來，如同為留到最後的讀者所讀。",
      "讀盤之序，即諸卷之序。先說出日主，因為在認識自身之前，命盤中一切皆無意義。次衡其季，因月令說明自身是得扶、泄氣、受壓，還是相抗。再於八字之中點數五行，最重者先，空著的那一間，與滿著的那一間同樣如實說出。再依序讀四柱，從根到果，各在其所主之地。最後，諸神環繞日主而聚，這一朝的形狀被平實地說出。",
      "《滴天髓》說出讀盤所聽取的：「命貴中和。」所以每一份重量都對著中心衡量，滿室與空室皆然。讀盤描述土地、季節與朝廷，然後止息；路屬於行路之人。",
      "此術向來由一位讀者傳給一位聽者，鑑也這樣讀：對你，此刻，獨與命盤相對。",
    ],
    stoneTurn: "",
    stoneTurnZh: "",
  },
};
