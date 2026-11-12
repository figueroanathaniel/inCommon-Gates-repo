import type { Phase } from "@contracts/bazi";
import type { EnvKind, FigureKind, Tone } from "./world";

/*
  Every word spoken on the walk, in English and in 中文. A line may hold
  tokens in braces, which the play screen fills from the chart: {branch} and
  {stem} are signs, {god} is one of the ten gods, and {phase}, {quality},
  {reading}, {pillar} and {domain} are the Academy's own contract text
  (contracts/bazi.ts). Nothing here says what a sign is beyond that text: the
  figures dramatise the ten gods' one line readings, and no line says what
  will happen to anybody.

  The whole script is a draft for the owner to approve. The 中文 has not been
  read by a reader of Chinese.
*/

export interface L { en: string; zh: string }
export type Tag = "stand" | "room";
export interface Option { label: L; tag: Tag | null; reply: L }
export interface Choice { prompt: L; options: [Option, Option] }
export interface GodScript { name: L; hard: L[]; choice: Choice; gift: L[] }

export const KEEPER: L = { en: "The Keeper", zh: "守者" };

export const PLACE: Record<EnvKind, L> = {
  garden: { en: "The Keeper's Garden", zh: "守者之園" },
  wood: { en: "The Bamboo Forest", zh: "竹林" },
  fire: { en: "The Heart of the City", zh: "城心" },
  water: { en: "The Edge of the Pond", zh: "池畔" },
  earth: { en: "The Dojo", zh: "武館" },
  metal: { en: "The Office", zh: "辦公室" },
};

export const TONE: Record<Tone, L> = {
  dawn: { en: "first light", zh: "晨" },
  day: { en: "midday", zh: "午" },
  dusk: { en: "dusk", zh: "暮" },
  night: { en: "night", zh: "夜" },
};

export const KEEPER_OPEN: L[] = [
  { en: "You climbed. Good. Sit a moment, the stones have time.", zh: "你上來了。好。且坐片刻，石頭不趕時辰。" },
  { en: "I keep this garden, and I keep the eight characters of those who come up the stairs. These ones are open in front of me.", zh: "我守此園，也守登階而來者的八字。這一盤，正攤在我面前。" },
  { en: "Under the day of this chart sits {branch}. It belongs to {phase}.", zh: "此盤日柱之下，坐的是{branch}，屬{phase}。" },
  { en: "It is read as {quality}.", zh: "其象為{quality}。" },
  { en: "The branch under the self is read as the ground one's closest companion stands on. So the road begins there, on {phase} ground.", zh: "自身之下的地支，向來讀作至親之人所立之地。所以這條路從那裡起步，起於{phase}之地。" },
  { en: "Along it stand the figures these pillars name. Each carries a weight and a gift. They show what a sign is read as. None of them says what will happen to anyone.", zh: "路上立著這四柱所指的人物。各負一重，各懷一贈。他們只示一字之所讀，不言誰將遇何事。" },
];

export const KEEPER_INVITE: Choice = {
  prompt: { en: "Will you walk the road, here on Earth?", zh: "這條人間的路，你願走嗎？" },
  options: [
    {
      label: { en: "I will walk it.", zh: "我願走這一程。" }, tag: null,
      reply: { en: "Then watch the garden. It knows this ground.", zh: "那就看著這園子。它識得這片地。" },
    },
    {
      label: { en: "What will I meet?", zh: "我會遇見什麼？" }, tag: null,
      reply: { en: "Rivals and teachers, cooks and generals. Betrayal and friendship, pressure and peace. Then the way back here. Watch the garden.", zh: "有爭者，有師長，有庖人，有將軍。有背棄也有友情，有重壓也有安寧。然後是回到這裡的路。看著這園子。" },
    },
  ],
};

/** What the reader is told as the garden becomes the first place. */
export const OPENING: Record<Phase, L> = {
  wood: { en: "The garden lets go of its stones. Bamboo rises where the lanterns stood, and a path opens between the stalks.", zh: "園子鬆開了石頭。燈籠所在之處，竹拔地而起，竹間現出一條小徑。" },
  fire: { en: "The garden burns away into light. Signs, awnings and a thousand windows stand up on every side. This is the heart of a city.", zh: "園子化入光中。招牌、棚簷與千扇窗在四周立起。這是城的中心。" },
  water: { en: "The garden sinks into still water. Reeds lean at the edge of a pond, and stepping stones lead out.", zh: "園子沉入靜水。池畔蘆葦低垂，踏石向前伸去。" },
  earth: { en: "The garden folds into walls of wood and paper. A floor of worn boards runs ahead. This is a dojo.", zh: "園子折成木與紙的牆。磨舊的地板向前鋪開。這是一間武館。" },
  metal: { en: "The garden hardens into glass and steel. Desks stand in rows under a white light. This is an office.", zh: "園子凝成玻璃與鋼。白光之下，桌案成列。這是一間辦公室。" },
};

/** The first thing a figure says: where in the chart it stands. */
export const FRAME: Record<"day" | "pillar" | "luck", L> = {
  day: { en: "I stand under the self, on the ground one's closest companion stands on. In this chart that ground holds {stem}, and to the self it is {god}.", zh: "我立於自身之下，至親之人所立之地。此盤此地藏{stem}，於日主為{god}。" },
  pillar: { en: "I stand at the {pillar}, the ground of {domain}. {stem} sits there, and to the self it is {god}.", zh: "我立於{pillar}，主{domain}。{stem}坐於此，於日主為{god}。" },
  luck: { en: "I walk the decade this chart is in now. {stem} leads it, and to the self it is {god}.", zh: "我走在此盤當下的大運之中。{stem}領此十年，於日主為{god}。" },
};
export const READ_AS: L = { en: "{god} is read as {reading}.", zh: "{god}者，{reading}。" };
export const AGAIN: L = { en: "We meet again. A sign that repeats speaks twice. Walk on, my weight is already known to you.", zh: "又見面了。一字重見，便說兩回。走吧，我的重量你已知曉。" };
export const INTIMACY: L = { en: "This is the ground a partner is read from. Intimacy lives here, being known at close range, which is both the tenderest thing and the most exposed.", zh: "此地是讀伴侶之處。親密住在這裡，在近處被人看清，既最柔軟，也最無遮。" };
export const ONWARD: L = { en: "The moon gate is open. Walk on when the heart is ready.", zh: "月門已開。心定了，便往前走。" };

export const GODS: Record<Exclude<FigureKind, "keeper">, GodScript> = {
  companion: {
    name: { en: "The Friend", zh: "友人" },
    hard: [
      { en: "Shoulder to shoulder is a comfort until it becomes a measure. Whoever stands level with you can also be counted against you.", zh: "並肩是安慰，直到它成了尺度。與你齊肩之人，也能拿來量你。" },
      { en: "The fear here is a plain one. That without someone beside you, the road has no witness.", zh: "這裡的懼怕很樸素。怕身旁無人，這條路便無人見證。" },
    ],
    choice: {
      prompt: { en: "A friend falls behind on the road. What do you do?", zh: "同行的朋友落在了後面。你怎麼做？" },
      options: [
        { label: { en: "Slow down and walk at their pace.", zh: "放慢腳步，與他同行。" }, tag: "room", reply: { en: "Then the road is longer and kinder. That is one of the good things.", zh: "那麼路長一些，也溫厚一些。這是世間好事之一。" } },
        { label: { en: "Keep your pace and wait at the gate.", zh: "照自己的步子走，在門前等他。" }, tag: "stand", reply: { en: "Then each of you keeps a road of your own, and meets with something to tell.", zh: "那麼各走各的路，再見時各有話說。" } },
      ],
    },
    gift: [{ en: "Friendship is the gift I carry. Nobody is above and nobody is below. Take it with you.", zh: "我所攜的贈禮是友情。無人在上，無人在下。帶著它走。" }],
  },
  robwealth: {
    name: { en: "The Rival", zh: "爭者" },
    hard: [
      { en: "I share your nature, so I know where you keep things. That is how a betrayal is read here, a hand that knew the way to the store.", zh: "我與你同質，所以知道你把東西收在哪裡。此處所讀的背棄便是如此，一隻識得庫門之路的手。" },
      { en: "It is a weight to carry, to be taken from by someone who is like you.", zh: "被與自己相似的人奪去，是一種要扛的重。" },
    ],
    choice: {
      prompt: { en: "Something of yours is gone, and you know who took it.", zh: "你的東西不見了，而你知道是誰拿的。" },
      options: [
        { label: { en: "Name it and ask for it back.", zh: "說破，並要回來。" }, tag: "stand", reply: { en: "Clear and hard. A line drawn where everyone can see it.", zh: "清楚而硬。一條人人看得見的界線。" } },
        { label: { en: "Let it go and close the door.", zh: "放下，把門關上。" }, tag: "room", reply: { en: "Lighter hands. The store is smaller and the house is quiet.", zh: "手輕了。庫小了些，屋裡安靜了。" } },
      ],
    },
    gift: [{ en: "What I leave behind is a boundary, and after it, if you want it, forgiveness. Both belong to you.", zh: "我留下的是一道界線，其後若你願意，還有寬恕。兩樣都歸你。" }],
  },
  eatinggod: {
    name: { en: "The Cook", zh: "庖人" },
    hard: [
      { en: "I am what the self makes and gives away. The trial is the empty pot, feeding every table until there is nothing left for your own.", zh: "我是自身所生、又送出去的東西。試煉在於空鍋，餵飽了每一桌，卻沒給自己留下一口。" },
      { en: "Still, smell that. Broth, ginger, rice just lifted from the steam.", zh: "不過，你聞聞。湯、薑，還有剛離了蒸氣的飯。" },
    ],
    choice: {
      prompt: { en: "The bowl is full and the evening is free.", zh: "碗是滿的，今晚無事。" },
      options: [
        { label: { en: "Call someone to share it.", zh: "喚一個人來同吃。" }, tag: "room", reply: { en: "Good. A table with two bowls is the oldest pleasure there is.", zh: "好。一桌兩碗，是最古老的樂事。" } },
        { label: { en: "Sit down and eat it slowly yourself.", zh: "坐下來，自己慢慢吃。" }, tag: "stand", reply: { en: "Good. Feeding yourself well is a skill, and it counts.", zh: "好。把自己餵好是一門本事，算數的。" } },
      ],
    },
    gift: [{ en: "Pleasure is my gift. The beautiful, ordinary things. Taste, rest, a song while the pot simmers.", zh: "我的贈禮是享受。那些美而尋常的事。滋味、歇息、鍋邊哼的一支歌。" }],
  },
  hurtingofficer: {
    name: { en: "The Prodigy", zh: "奇才" },
    hard: [
      { en: "I am brilliance that tests authority. The power is real. So is the trial, which is every room that wanted you quieter.", zh: "我是考驗權威的才華。這力量是真的。試煉也是真的，就是每一間盼你安靜些的屋子。" },
      { en: "Talent like this cuts both ways. It can open a door, and it can cost a seat at the table.", zh: "這樣的才具兩面皆利。能開一扇門，也能丟一個席位。" },
    ],
    choice: {
      prompt: { en: "The rule in front of you is wrong, and you can prove it.", zh: "眼前這條規矩是錯的，而你能證明。" },
      options: [
        { label: { en: "Say so, in front of everyone.", zh: "當眾說出來。" }, tag: "stand", reply: { en: "Then the room hears it. Some will thank you later, and some never.", zh: "那麼滿屋都聽見了。有人日後謝你，有人永不。" } },
        { label: { en: "Show a better way and let the work argue.", zh: "做出更好的法子，讓成果去辯。" }, tag: "room", reply: { en: "Then the work speaks first. It takes longer and it lasts.", zh: "那麼成果先開口。慢一些，也久一些。" } },
      ],
    },
    gift: [{ en: "Empowerment is what I hand you. Your own voice, at its full size.", zh: "我交給你的是自立之力。你自己的聲音，原本的大小。" }],
  },
  indirectwealth: {
    name: { en: "The Trader", zh: "行商" },
    hard: [
      { en: "I am the windfall and the wide field. What arrives by chance can leave by chance, and that is the fear I carry in my coat.", zh: "我是意外之財與廣闊之田。偶然而來者，也可偶然而去，這便是我藏在衣襟裡的懼怕。" },
      { en: "A wide field is also a lot of ground to lose sleep over.", zh: "田寬了，夜裡要掛心的地也就多了。" },
    ],
    choice: {
      prompt: { en: "A windfall lands in your hands today.", zh: "今日有一筆意外之財落到你手中。" },
      options: [
        { label: { en: "Share it out while it is warm.", zh: "趁熱分給眾人。" }, tag: "room", reply: { en: "Open hands. People remember a generous season.", zh: "手是張開的。慷慨的時節，人會記得。" } },
        { label: { en: "Plant it in a new field.", zh: "把它種進一塊新田。" }, tag: "stand", reply: { en: "A bold stake. The field is wider now, and so is the horizon.", zh: "下注果敢。田更寬了，天邊也更遠了。" } },
      ],
    },
    gift: [{ en: "Generosity is my gift, and nerve. The world is large, and you may walk into it.", zh: "我的贈禮是慷慨，還有膽氣。世界很大，你儘可走進去。" }],
  },
  directwealth: {
    name: { en: "The Steward", zh: "管家" },
    hard: [
      { en: "I am the honest wage and the kept store. The weight is the ledger, every day's work written down, every promise counted.", zh: "我是正當的酬勞與守住的積存。這份重是帳簿，每日之工都記下，每個承諾都算數。" },
      { en: "Duty is heavy because it does not end at sundown.", zh: "責任之所以重，是因為日落也不收工。" },
    ],
    choice: {
      prompt: { en: "The store is full, and someone you love asks for your time.", zh: "庫是滿的，而你所愛的人想要你的時間。" },
      options: [
        { label: { en: "Finish the count, then go to them.", zh: "把帳點完，再去見他。" }, tag: "stand", reply: { en: "Order first. What you bring them afterward is whole.", zh: "先有次序。之後你帶去的，是完整的。" } },
        { label: { en: "Close the ledger and go now.", zh: "合上帳簿，現在就去。" }, tag: "room", reply: { en: "People first. The ledger will be there in the morning.", zh: "先顧人。帳簿明早還在。" } },
      ],
    },
    gift: [{ en: "Structure is my gift. A roof that holds, a table that is laid, a life someone can lean on.", zh: "我的贈禮是條理。撐得住的屋頂，擺好的桌子，一段可供人倚靠的日子。" }],
  },
  sevenkillings: {
    name: { en: "The General", zh: "將軍" },
    hard: [
      { en: "I am pressure that forges or breaks. Tribulation wears my armour. I do not ask whether anyone is ready.", zh: "我是或鍛或折的壓力。磨難披著我的甲。我不問誰準備好了沒有。" },
      { en: "Feel it on your shoulders. That is the whole of my lesson, and I will not make it lighter.", zh: "感覺它壓在你肩上。我的教誨盡在於此，我不會替你減輕。" },
    ],
    choice: {
      prompt: { en: "The pressure is on you now.", zh: "此刻壓力落在你身上。" },
      options: [
        { label: { en: "Plant your feet and meet it.", zh: "站穩腳跟，迎上去。" }, tag: "stand", reply: { en: "Then you have felt your own strength. Remember where it sits.", zh: "那麼你已覺出自己的力氣。記住它在何處。" } },
        { label: { en: "Step aside and let it pass.", zh: "側身讓它過去。" }, tag: "room", reply: { en: "Then you have kept your strength for a day of your choosing. That is also command.", zh: "那麼你把力氣留給了自擇之日。這也是統御。" } },
      ],
    },
    gift: [{ en: "Courage is what I leave. Power that was tested and stayed kind.", zh: "我留下的是勇氣。受過試煉而仍然溫厚的力量。" }],
  },
  directofficer: {
    name: { en: "The Magistrate", zh: "官長" },
    hard: [
      { en: "I am rightful order and standing. The trial here is the eye of others, the feeling of being weighed in a public place.", zh: "我是正當的秩序與名位。此處的試煉是眾人的目光，在大庭廣眾之下被人掂量的滋味。" },
      { en: "A good name is slow to build and heavy to carry.", zh: "好名聲立得慢，扛著重。" },
    ],
    choice: {
      prompt: { en: "The rule is fair, and today it costs you.", zh: "規矩是公道的，而今日它讓你吃虧。" },
      options: [
        { label: { en: "Keep it anyway.", zh: "照樣守它。" }, tag: "stand", reply: { en: "Then your word and your act are the same thing. That is standing.", zh: "那麼你的言與行是一回事。這就是名位。" } },
        { label: { en: "Ask for it to be made kinder.", zh: "請求把它改得寬厚些。" }, tag: "room", reply: { en: "Then the rule learns something. Order that listens lasts longer.", zh: "那麼規矩也學到了東西。肯聽的秩序更長久。" } },
      ],
    },
    gift: [{ en: "The right thing, done in daylight. That is my gift, and the calm that follows it.", zh: "在白日之下做對的事。這是我的贈禮，還有隨之而來的平靜。" }],
  },
  indirectresource: {
    name: { en: "The Hermit", zh: "隱者" },
    hard: [
      { en: "I am learning that comes by side paths. My hardship is the long quiet, and the fear that nobody else reads the book you read.", zh: "我是由無名小徑而來的學問。我的艱難是長久的寂靜，以及怕無人與你讀同一卷書。" },
      { en: "Odd knowledge keeps odd hours. It can feel like standing outside every lit window.", zh: "冷僻的學問守著冷僻的時辰。有時像站在每一扇亮窗之外。" },
    ],
    choice: {
      prompt: { en: "A thing you believe has no proof yet.", zh: "你所信的一件事，尚無憑證。" },
      options: [
        { label: { en: "Hold to it and keep studying.", zh: "守住它，繼續鑽研。" }, tag: "stand", reply: { en: "Then belief has a spine. Let it also have patience.", zh: "那麼信念有了脊樑。願它也有耐心。" } },
        { label: { en: "Carry it lightly and stay open.", zh: "輕輕帶著它，把心敞開。" }, tag: "room", reply: { en: "Then belief has a door. Let it also have a floor.", zh: "那麼信念有了一扇門。願它也有地基。" } },
      ],
    },
    gift: [{ en: "Belief is my gift, and the peace of your own company. Solitude that is a room, with the lamp lit.", zh: "我的贈禮是信念，還有獨處的安寧。那種孤獨是一間屋子，燈是亮的。" }],
  },
  directresource: {
    name: { en: "The Elder", zh: "長者" },
    hard: [
      { en: "I am the seal of rightful support. Love like this can hold so close that leaving the house becomes its own trial.", zh: "我是正當扶持之印。這樣的愛能抱得太緊，以致離家本身成了一場試煉。" },
      { en: "To be cared for is a debt nobody asks you to repay, and it still sits on the heart.", zh: "受人照拂，是一筆無人向你討還的債，卻仍壓在心上。" },
    ],
    choice: {
      prompt: { en: "Someone who raised you offers help you did not ask for.", zh: "養育你的人，給了你並未開口求的幫助。" },
      options: [
        { label: { en: "Take it, and thank them.", zh: "收下，並道謝。" }, tag: "room", reply: { en: "Then the care lands. Receiving is a way of loving back.", zh: "那麼這份心意落了地。肯受，也是回以愛。" } },
        { label: { en: "Thank them, and do it yourself.", zh: "道謝，然後自己來。" }, tag: "stand", reply: { en: "Then the care has done its work. It raised someone who can stand.", zh: "那麼這份心意已盡其功。它養出了一個站得住的人。" } },
      ],
    },
    gift: [{ en: "Compassion is my gift. Being loved before anything was earned. Take it, it was always meant for the road.", zh: "我的贈禮是慈悲。未有寸功之前便已被愛。帶上吧，它本就是為這條路預備的。" }],
  },
};

export const CLOSE_FIRST: L = { en: "You came back by the long way. The lanterns are lit.", zh: "你繞了遠路回來。燈已點上。" };
export const CLOSE_WAY: Record<"stand" | "room" | "even", L> = {
  stand: { en: "On this walk the choices held ground more often than they gave it. Strength showed.", zh: "這一程，所擇守多於讓。顯出的是力量。" },
  room: { en: "On this walk the choices gave room more often than they took it. Gentleness showed.", zh: "這一程，所擇讓多於守。顯出的是溫厚。" },
  even: { en: "On this walk the choices held and gave in equal measure. Balance showed.", zh: "這一程，所擇守與讓各半。顯出的是均衡。" },
};
export const CLOSE_LAST: L[] = [
  { en: "Every figure on the road is one way of reading a sign. Hardship and betrayal, love and friendship, all of them were drawn from the same eight characters.", zh: "路上每個人物，都是一個字的一種讀法。艱難與背棄，愛與友情，皆出自同樣的八個字。" },
  { en: "What is done with them was never written in the chart. That part is yours.", zh: "如何用它們，命盤上從未寫明。那一段歸你。" },
  { en: "Sit as long as you like. The garden is quiet, and so, for now, is the road.", zh: "願坐多久便坐多久。園子是靜的，這條路此刻也是。" },
];
