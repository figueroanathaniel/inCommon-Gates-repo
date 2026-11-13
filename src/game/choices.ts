import type { GodKind } from "./world";
import type { Choice } from "./script";

/*
  The choices on the walk turn, so no walk asks the same thing twice running.
  Every place a choice stands (each of the ten figures, each of the four
  pillars of the hours, and the Keeper's two invitations) keeps four families
  of moment. Each family holds three variations, and each variation offers
  two ways through, a Yang way that stands and a Yin way that makes room.
  Family one, variation one, is the choice the owner approved; the other
  eleven at each place are drafts for the owner, written in English only.
  While the Academy reads in 中文, the walk keeps the approved choice.

  A scene is [moment, Yang label, Yang reply, Yin label, Yin reply]. The
  turn lives in memory for the visit and is stored nowhere.
*/

type Scene = [string, string, string, string, string];
/** Eleven scenes: family one's second and third variations, then three for each of families two to four. */
type Turns = [Scene, Scene, Scene, Scene, Scene, Scene, Scene, Scene, Scene, Scene, Scene];

export const ROAD_INVITE_TURNS: Turns = [
  ["The road is open below the garden. Will you take it?", "I will take it.", "Then watch the garden. It knows this ground.", "Who walks it with me?", "Ten figures, one at a time, each with a weight and a gift. Watch the garden."],
  ["Your eight characters are laid out like stones. Will you walk across them?", "Lead on.", "Then watch the garden. It is already moving.", "What do the stones hold?", "Rivals and friends, elders and generals, pressure and rest, every one drawn from these eight. Watch the garden."],
  ["The lanterns are lit for a walk. Are you ready to go?", "I am ready.", "Good. Readiness is half the road. Watch the garden.", "Can I go slowly?", "As slowly as you like. The road waits for the walker. Watch the garden."],
  ["Some come up the stairs to look, and some to walk. Which are you tonight?", "I came to walk.", "Then the garden will make way. Watch it.", "I came to look, and I may walk.", "Looking is how every walk begins. Watch the garden."],
  ["The first step is the only one anyone asks of you. Will you take it?", "I will take it now.", "Then the ground is already answering. Watch the garden.", "I will take it gently.", "Gentle steps reach the same gate. Watch the garden."],
  ["There is weight on this road as well as gifts. Will you walk it anyway?", "Weight and all.", "Then you carry your own strength with you. Watch the garden.", "Tell me about the gifts.", "Friendship, pleasure, courage, compassion and more. Each figure leaves one. Watch the garden."],
  ["Everyone who walks this road meets something hard on it. Will you go?", "I will meet it.", "Spoken like someone who has met hard things before. Watch the garden.", "Will I be alone?", "Never for long. Every stretch has a figure, and I will be here at the end. Watch the garden."],
  ["The road asks for nothing but your company. Will you give it?", "Gladly.", "Then the road is glad too. Watch the garden.", "What does it give back?", "A look at this chart from the inside, and a gift at every stop. Watch the garden."],
  ["The road runs here on Earth, through cities, offices and ponds. Will you walk it with me?", "Show me the way.", "The garden will show it better than I can. Watch.", "Why here on Earth?", "Because this is where eight characters are lived. Watch the garden."],
  ["This chart has a place to begin. Shall we go and find it?", "Let us find it.", "It is already rising out of the stones. Watch the garden.", "Where does it begin?", "On the ground under the day, where the closest companion stands. Watch the garden."],
  ["The stones are warm and the night is long enough. Will you walk?", "I will walk.", "Then watch the garden. It has been waiting for you.", "Will you walk beside me?", "I keep the garden, and I will be here when you come back. Watch the garden."],
];

export const HOURS_INVITE_TURNS: Turns = [
  ["The night is long and the hours are open. Will you walk them?", "Open them.", "Then watch the garden. It knows the hour.", "Why walk at night?", "Because the first of the twelve hours stands at midnight. Watch the garden."],
  ["Four animals keep this chart's hours. Will you go and meet them?", "Take me to them.", "Then watch the garden. The first is already waking.", "Are they really animals?", "Only by name. A name is easier to carry than a sign. Watch the garden."],
  ["The garden is dark now. Will you walk into it?", "Into the dark, then.", "Good. The dark keeps the hours well. Watch the garden.", "Will there be light?", "Lamps, the moon, and at the end the morning. Watch the garden."],
  ["The hours do not hurry. Will you walk them at their pace?", "At their pace.", "Then the night will open to you. Watch the garden.", "May I rest between them?", "There is a moon gate between every hour, and you may stand in it as long as you like. Watch the garden."],
  ["The year, the month, the day and the hour each keep a door. Will you knock?", "I will knock.", "Then the first door is opening. Watch the garden.", "What is behind them?", "A keeper at each, who will say what it holds and what it carries. Watch the garden."],
  ["Every hour of a day has a keeper. Will you walk with four of them?", "I will walk with them.", "Then the first one is waiting. Watch the garden.", "Which four?", "The four under this chart's pillars, in order. Watch the garden."],
  ["You walked the road by day. Will you walk the hours by night?", "By night, then.", "Good. Watch the garden turn.", "Is the night different?", "The night keeps different company. Watch the garden."],
  ["Time is the oldest road there is. Will you walk a little of it?", "A little, and well.", "That is the only way anyone walks it. Watch the garden.", "How much is a little?", "Four hours of one day, by the old count. Watch the garden."],
  ["The keepers of the hours rarely have visitors. Will you be one?", "I will visit.", "They will be glad. Watch the garden.", "Will they mind?", "A keeper keeps a door so that someone can come through it. Watch the garden."],
  ["The first keeper is awake. Shall we go?", "Let us go.", "Then watch the garden. It knows the way.", "Is it safe?", "It is a garden and a walk and four keepers. Watch the garden."],
  ["The stones have their night colour. Will you walk while they keep it?", "While they keep it.", "Then watch the garden. The hour is turning.", "And when the colour comes back?", "Then you will be home, at first light. Watch the garden."],
];

export const GOD_TURNS: Record<GodKind, Turns> = {
  companion: [
    ["Your friend is tired and the gate is still far.", "Carry their pack for a stretch.", "Then your shoulders are wider than you knew. That is strength.", "Sit down together and rest.", "Then the gate can wait. Two people resting is also a way of arriving."],
    ["You reach the gate first, and your friend is nowhere in sight.", "Go back for them.", "Then the road knows who you are. Nobody is left on it.", "Wait, and trust them to come.", "Then trust walks back down the road in your place."],
    ["Your friend wins the prize you both trained for.", "Shake their hand and train again.", "Then you stand level, and the next race is yours to run.", "Celebrate them with your whole heart.", "Then their joy is doubled, and some of it is yours."],
    ["A friend asks you to judge between them and another friend.", "Say plainly who is right.", "Then both know where you stand. Fairness has a spine.", "Help them hear each other.", "Then nobody had to lose. That is a rare kind of peace."],
    ["You and a friend want the same seat.", "Ask for it openly.", "Then it is a fair contest between equals. That is respect.", "Offer it to them.", "Then you gave from fullness, and a gift between equals keeps them equal."],
    ["The road is empty and nobody will see what you do here.", "Walk it as if the whole town were watching.", "Then you are your own witness. That is sturdy company.", "Walk it any way you please.", "Then the road is yours alone, and it is enough."],
    ["Someone you barely know offers to walk with you.", "Welcome them and set the pace.", "Then a stranger becomes a companion. You made that.", "Let them set the pace.", "Then you are learning the road through someone else's feet."],
    ["A friend has gone quiet, and you have not heard from them in a season.", "Go and knock on their door.", "Then they know someone came. That matters more than any reason.", "Send word and leave the door open.", "Then the way back is clear whenever they are ready."],
    ["There is one lantern and two of you.", "Hold it high so both can see.", "Then you lit the road for two. That is leadership among friends.", "Walk close so it covers you both.", "Then the light is shared, and so is the dark."],
    ["A friend tells you a secret that is heavy to keep.", "Keep it, and stand by them.", "Then your word is a wall they can lean on.", "Ask what they need from you.", "Then they are held, and they are also heard."],
    ["Your friend has made a mistake that everyone is talking about.", "Stand beside them in public.", "Then they are not alone in the square. That is friendship with its sleeves rolled up.", "Go to them in private first.", "Then they have somewhere soft to land before they face the rest."],
  ],
  robwealth: [
    ["Someone like you has taken credit for your work.", "Claim it, clearly and calmly.", "Then your name is back on what you made. That is a boundary.", "Let the work speak and move on.", "Then you kept your peace, and the work is still yours."],
    ["A hand you trusted was in your store.", "Change the lock and say why.", "Then the door is yours again, and everyone knows it.", "Change the lock and say nothing.", "Then the door is yours again, quietly. Some boundaries need no speech."],
    ["A rival reaches for the very thing you want.", "Reach faster.", "Then you know your own appetite. Own it.", "Let them have this one.", "Then you chose which battles are worth your hunger."],
    ["Your rival is better at the thing you love.", "Learn from them and close the gap.", "Then the rival has become a whetstone. You are sharper.", "Admire them and keep your own way.", "Then there is room for two of you in the world."],
    ["A rival stumbles in front of you.", "Pass them and keep running.", "Then the race stays a race. That is honest.", "Stop and offer a hand.", "Then the race is a little kinder than it was."],
    ["The one who wronged you asks to be forgiven.", "Forgive, and keep the boundary.", "Then you are both generous and safe.", "Say you are not ready yet.", "Then forgiveness keeps its own time. That is honest too."],
    ["Years later you meet the one who took from you.", "Greet them first.", "Then you walked in as the one who is whole.", "Nod and walk on.", "Then you kept your peace, and it was enough."],
    ["You took something once that was not yours.", "Return it and name it.", "Then the store is honest again, starting with yours.", "Make it right in a quieter way.", "Then the mending is real even if nobody sees it."],
    ["There is one portion left and two hungry people.", "Take it and share it out.", "Then you held the plate and fed both. That is command.", "Let the other choose first.", "Then their hunger was seen. That is its own feast."],
    ["Someone copies the way you do things.", "Do it better and keep going.", "Then let them follow. The road ahead is still yours.", "Take it as a compliment.", "Then imitation becomes kinship."],
    ["A friend's success stings a little.", "Use the sting to work harder.", "Then envy has been turned into fuel. Well done.", "Name the sting kindly to yourself.", "Then it loosens, and the friend is still a friend."],
  ],
  eatinggod: [
    ["The pot is simmering and the kitchen smells of ginger.", "Invite the neighbours.", "Then the kitchen becomes a feast. You made that.", "Keep the lid on and savour it.", "Then you are fed first. A cook who eats well cooks long."],
    ["A quiet evening, rice warm, nothing owed to anyone.", "Cook something ambitious.", "Then the evening has a flourish in it. Enjoy the work of your hands.", "Eat something simple and rest.", "Then rest is the meal. That is wise."],
    ["Everyone has been fed but you.", "Cook again, for yourself this time.", "Then the last bowl is yours. That is fair.", "Ask someone to cook for you.", "Then you get to be the guest. Let it be sweet."],
    ["Another table asks for your food, and the pot is nearly empty.", "Say the kitchen is closed tonight.", "Then the cook keeps something back. That is how kitchens last.", "Give the last ladle and rest after.", "Then you gave fully, and rest is owed to you."],
    ["You have been making things for others all season.", "Make one thing for yourself.", "Then your hands remember what they love.", "Let someone make something for you.", "Then the gift comes back around the table."],
    ["A song comes to you while the pot simmers.", "Sing it out loud.", "Then the kitchen has music. That is a gift to whoever hears it.", "Hum it softly to yourself.", "Then it is yours to keep a while longer."],
    ["You made something and someone does not like it.", "Make the next one bolder.", "Then taste grows by daring. Keep cooking.", "Taste it again with their words in mind.", "Then you learned without losing your own palate."],
    ["There is a recipe you have never dared to try.", "Try it tonight.", "Then the kitchen is bigger than it was this morning.", "Read it slowly first.", "Then the dish begins in the mind, where good food often does."],
    ["The sun is warm and the work can wait an hour.", "Take the hour and enjoy it fully.", "Then pleasure was claimed, and it counts.", "Take the hour and do nothing at all.", "Then you let ease find you. That is a skill."],
    ["A friend says you work too hard.", "Plan a feast and invite them.", "Then the work makes room for joy. Good.", "Ask them to show you how they rest.", "Then you have a teacher in the gentle arts."],
    ["The fruit is ripe today and soft by tomorrow.", "Eat it now, every bite.", "Then the moment was not wasted.", "Share it with whoever is near.", "Then sweetness travels."],
  ],
  hurtingofficer: [
    ["Your teacher is wrong about something you understand well.", "Say so, respectfully, in class.", "Then the room learned something today, and so did your teacher.", "Ask a question that shows the gap.", "Then the teacher finds it alongside you. That is a gentle power."],
    ["The plan everyone agreed on has a flaw only you can see.", "Stop the meeting and show it.", "Then the flaw is out in the light. That took nerve.", "Fix it quietly in your own part.", "Then the work is better, and the proof is in it."],
    ["You are asked to speak, and your voice shakes.", "Speak at full volume anyway.", "Then the room heard all of you. That is your real size.", "Speak softly and let them lean in.", "Then they came toward you. Quiet can command too."],
    ["Someone tells you to tone it down.", "Keep the tone you have.", "Then your voice stays your own. That is integrity.", "Choose where the volume belongs.", "Then you are the one deciding. That is power, held lightly."],
    ["You have an idea nobody has thought of.", "Announce it.", "Then the idea is in the world with your name on it.", "Build it first, then show them.", "Then the idea arrives already standing."],
    ["Your clever remark would win the argument and wound a friend.", "Find something just as clever and kinder.", "Then brilliance and care sat at the same table.", "Hold it back this time.", "Then the friend kept their dignity, and you kept the remark for a better day."],
    ["You were left out of the room where it is decided.", "Knock and ask to be let in.", "Then they know you want the seat. That is courage.", "Build your own table.", "Then others may come to yours."],
    ["A rule you broke turned out to protect someone.", "Own it publicly.", "Then your talent and your honesty are the same size.", "Make amends quietly.", "Then the repair is real, and the lesson is yours."],
    ["You can do in an hour what takes others a day.", "Take on something harder.", "Then your gift is being stretched. That is how it grows.", "Teach someone else how.", "Then your gift is in two pairs of hands."],
    ["Praise comes for work you know is not your best.", "Say it could be better and show how.", "Then your standard is your own.", "Accept the praise and keep the standard privately.", "Then you were gracious, and the bar is still where you set it."],
    ["Your talent is noticed by someone with power.", "Step forward and take the chance.", "Then the door opened because you walked through it.", "Ask what they see in it.", "Then you hear your gift described, and learn its shape."],
  ],
  indirectwealth: [
    ["A stranger at the market pays more than you asked.", "Thank them and put it to work.", "Then luck was met by a plan. That is nerve.", "Give the extra to the next person who needs it.", "Then the luck keeps travelling."],
    ["A gift arrives from someone you hardly know.", "Accept it and repay it twice over.", "Then the circle widens. Generosity with muscle.", "Accept it and simply say thank you.", "Then receiving was enough. That is grace."],
    ["A road leads out past the last field you know.", "Walk it to the end.", "Then the map is larger, with your name on its edge.", "Walk a little, and come home with stories.", "Then the world came a little closer, at your pace."],
    ["Someone offers you a share in a venture you do not fully understand.", "Learn it quickly and decide.", "Then you met the chance with your eyes open.", "Ask for time and ask questions.", "Then patience was your wealth today."],
    ["A far city calls to you.", "Go and see it.", "Then you have stood in a place that called your name.", "Read about it first, and dream a while.", "Then the city lives in you before you arrive."],
    ["Money that came easily has gone just as easily.", "Laugh and start again.", "Then you held it lightly and you stand tall. That is a trader's heart.", "Sit with it a moment before moving on.", "Then the loss was felt and let go. Both were honest."],
    ["A bet you made did not pay.", "Learn the lesson and bet again, wiser.", "Then nerve and wisdom are walking together.", "Rest from betting for a season.", "Then you gave the field time to heal. That is also skill."],
    ["You have more than enough this year.", "Spend some of it on something bold.", "Then abundance became a story.", "Put some away for a lean season.", "Then the abundance is still there when you need it."],
    ["Someone asks to borrow what you can spare.", "Lend it freely.", "Then your hand is open. People remember open hands.", "Give it outright, as a gift.", "Then nothing is owed, and the giving is clean."],
    ["At a crowded table, the bill arrives.", "Pay for everyone.", "Then you made the evening a feast. Enjoy that.", "Split it evenly and laugh about it.", "Then everyone held a share of the joy."],
    ["A street musician plays the song you love.", "Empty your pocket into the hat.", "Then the music was paid for gladly.", "Stop and listen to the whole song.", "Then your attention was the coin. Musicians know its worth."],
  ],
  directwealth: [
    ["The month's work is done and the ledger is open.", "Count every coin tonight.", "Then you know exactly where you stand. That is solid ground.", "Close it and count tomorrow, rested.", "Then the numbers will be the same, and you will be kinder to them."],
    ["Payday, and your family is waiting at home.", "Pay every bill first, then go home.", "Then you walk in free of debt. That is a quiet pride.", "Go home first and pay tomorrow.", "Then they had you while the day was still warm."],
    ["The shop is closed, and a regular knocks at the door.", "Open up and serve them.", "Then your word to them holds even after hours.", "Tell them gently you will open early.", "Then you kept your evening and your custom both."],
    ["A promise you made is due, and it is inconvenient.", "Keep it fully.", "Then your word is worth what you said it was.", "Ask honestly to keep it another way.", "Then the promise bent without breaking."],
    ["Everyone else has left the office.", "Finish the last task.", "Then tomorrow begins clean. Steady hands did that.", "Leave it, and lock up.", "Then the work will keep, and so will you."],
    ["You have saved enough to build something.", "Lay the foundation now.", "Then there is a roof on its way that you can stand under.", "Keep saving and plan carefully.", "Then the house is already being built in the plans."],
    ["Your household needs a new rule.", "Write it and keep it first yourself.", "Then the rule has a living example.", "Ask everyone what they think it should be.", "Then the rule belongs to all of you."],
    ["A careless person offers you a quick profit.", "Turn it down.", "Then your ledger stays honest. That is wealth no one can take.", "Ask how it works before you answer.", "Then you were open, and your judgment had room to work."],
    ["Your employer offers you less than your work is worth.", "Name your worth plainly.", "Then you stood for your own labour. That is dignity.", "Accept for now and keep the record.", "Then your patience has a plan inside it."],
    ["Someone you love is careless with money you both earned.", "Sit down with them and the ledger.", "Then the household has clear sight again.", "Ask what they needed that you missed.", "Then the numbers and the heart are both being tended."],
    ["You can afford a small luxury this week.", "Buy it, and enjoy it without guilt.", "Then honest wages bought honest pleasure.", "Put it aside for something bigger.", "Then the small pleasure grew into a plan."],
  ],
  sevenkillings: [
    ["Everyone is looking at you to decide.", "Decide now.", "Then they had a leader when they needed one.", "Ask for one breath, then decide.", "Then the decision came from stillness. That is command."],
    ["The deadline is tonight and the work is not done.", "Push through until it is done.", "Then you found a gear you did not know you had.", "Do what can be done well, and say so.", "Then you were honest about your strength. That is courage too."],
    ["Someone stronger challenges you openly.", "Accept the challenge.", "Then you met strength with strength. Whatever happens, you stood.", "Decline with your head high.", "Then you chose your ground. Generals do that."],
    ["A hard task is given to you and nobody else.", "Take it as an honour.", "Then the weight became a crown.", "Ask who will stand with you.", "Then the burden is shared, and the strength is too."],
    ["Someone tries to frighten you.", "Look them in the eye.", "Then fear met someone who did not move.", "Step back and find your footing.", "Then you are steady before you answer. That is wisdom in armour."],
    ["Your body is tired and the training is not finished.", "Finish the training.", "Then discipline carried you where tiredness could not.", "Stop and recover.", "Then you trained the hardest muscle of all, knowing when to rest."],
    ["Your temper rises at someone who deserves it.", "Speak the truth sharply and briefly.", "Then the anger served a purpose and was done.", "Wait until the heat passes, then speak.", "Then the truth arrives without fire on it."],
    ["You have been tested for a long time.", "Stand one more day.", "Then the test met something it could not break.", "Ask for help.", "Then strength was lent to you. Receiving it is brave."],
    ["Someone weaker is being pushed around.", "Step between them.", "Then your strength became a shield.", "Take them aside and help them find their feet.", "Then they leave stronger than they came."],
    ["Your team is afraid.", "Lead from the front.", "Then they followed your back into the hard part.", "Sit with them and name the fear.", "Then fear has a name, and it lost some of its size."],
    ["You are given power over others.", "Use it to lift the ones below you.", "Then power proved itself kind.", "Ask them how they want to be led.", "Then you are a general who listens. Those are rare."],
  ],
  directofficer: [
    ["The fair rule means you must wait your turn, and you are in a hurry.", "Wait your turn.", "Then order held, and so did you.", "Ask if there is a fair way to go sooner.", "Then you asked within the rule. That is how rules learn."],
    ["You could bend the rule and nobody would know.", "Keep it.", "Then you know. That is the whole of integrity.", "Ask why the rule is there.", "Then you understand it, and keep it with open eyes."],
    ["Your name is spoken in a meeting you are not at.", "Go and speak for yourself.", "Then your name has your voice beside it.", "Let your record speak.", "Then years of good work stood up for you."],
    ["You are praised in public for something a colleague did.", "Correct it on the spot.", "Then credit went where it belonged. That is standing.", "Thank your colleague in front of everyone afterward.", "Then the correction became a gift."],
    ["You are offered a title.", "Take it and carry it well.", "Then the title found someone worthy of it.", "Ask what it will ask of you.", "Then you accepted it knowing its weight."],
    ["You are put in charge of something that is a mess.", "Set it in order, one rule at a time.", "Then order grew under your hand.", "Listen first to how it got this way.", "Then the order you bring will fit the people in it."],
    ["Someone you lead breaks a rule for a kind reason.", "Apply the rule, and explain it.", "Then fairness held, and they understood it.", "Hear them, then decide.", "Then mercy and order sat at the same table."],
    ["A decision is yours, and either way someone will be unhappy.", "Decide clearly and own it.", "Then responsibility had a face, and it was yours.", "Explain to each side why.", "Then even the unhappy were respected."],
    ["You see a small wrong done in daylight.", "Name it right there.", "Then daylight had a witness.", "Speak to the one who did it, alone.", "Then they could put it right with their dignity."],
    ["Doing the right thing will cost you a friend's favour.", "Do it anyway.", "Then your conscience is clear, and that calm cannot be bought.", "Tell the friend first, and then do it.", "Then the friendship was honoured even as the right thing was done."],
    ["You made a promise in public that is hard to keep.", "Keep it, in public.", "Then everyone saw your word hold.", "Explain honestly what has changed.", "Then honesty kept your good name."],
  ],
  indirectresource: [
    ["You know something nobody around you believes.", "Keep working until you can show it.", "Then your belief has hands.", "Hold it quietly and listen to the doubters.", "Then your belief grows roots in their questions."],
    ["A dream keeps returning with the same image.", "Write it down and follow it.", "Then the dream has a path into the day.", "Let it return, and keep watch.", "Then you are keeping a door open to the deep."],
    ["Everyone is going out tonight, and you want to stay in with a book.", "Stay in, gladly.", "Then your evening was chosen, and chosen well.", "Go out, and bring the book.", "Then you carried your quiet with you."],
    ["You have been alone for a long while.", "Make the solitude a workshop.", "Then the quiet became a place where things get made.", "Let someone in for an evening.", "Then the lamp lit two faces for once."],
    ["A friend asks why you are so quiet.", "Tell them what you have been thinking about.", "Then they met the mind behind the quiet.", "Say that the quiet is good company.", "Then they know your solitude is a home."],
    ["You find an old book on a strange subject.", "Read it through tonight.", "Then a new room opened in your mind.", "Read a page a day.", "Then it will last like a slow tea."],
    ["Your way of learning is unusual.", "Trust it completely.", "Then your mind runs on its own road, at full speed.", "Learn a common way as well.", "Then you have two roads, and can choose."],
    ["A teacher with strange methods offers to teach you.", "Learn everything you can.", "Then the strange became yours to use.", "Learn a little and keep your own judgment.", "Then you took the gift and kept your own counsel."],
    ["Your gut says no, and every reason says yes.", "Follow your gut.", "Then the quiet knowing led, and you let it.", "Wait until the two agree.", "Then patience let the deep and the clear speak together."],
    ["Someone mocks a thing you hold sacred.", "Defend it calmly.", "Then what you hold sacred has a guardian.", "Let it pass and keep it close.", "Then it stays safe in the place no mocking reaches."],
    ["You have a question nobody can answer.", "Go and look for the answer yourself.", "Then the search is the gift.", "Live with the question a while.", "Then it ripens in you, at its own pace."],
  ],
  directresource: [
    ["Your elder insists on driving you, though you can drive yourself.", "Thank them and drive yourself.", "Then you showed them what their care made, someone who can go alone.", "Let them drive, and talk on the way.", "Then the ride became time together. That is its own gift."],
    ["An elder gives you advice about a choice that is yours.", "Listen, then decide for yourself.", "Then you honoured them and your own life.", "Ask them to tell you more.", "Then their years became part of your map."],
    ["It is time to leave a house that has loved you.", "Go with your head high.", "Then their love walks out the door with you.", "Go slowly, and visit often.", "Then the leaving is gentle for everyone."],
    ["The nest is warm and the world is cold.", "Step into the cold.", "Then you learned your own warmth.", "Stay one more season.", "Then you go when you are ready, and that is wisdom."],
    ["Someone who cared for you now needs your care.", "Take charge of it.", "Then you returned the shelter you were given.", "Ask them how they want to be cared for.", "Then their dignity was cared for too."],
    ["You are given a gift you feel you have not earned.", "Accept it and make it count.", "Then the gift becomes your strength.", "Accept it and simply feel loved.", "Then you let love arrive before any reason. That is a kind of courage."],
    ["You are unwell, and someone brings soup.", "Thank them and promise to return the kindness.", "Then care is moving in both directions.", "Let them stay and look after you.", "Then you let yourself be tended. That is a lesson too."],
    ["Someone believes in you more than you believe in yourself.", "Rise to meet their belief.", "Then you grew into the size they saw.", "Borrow their belief until yours grows.", "Then their faith is a bridge you can walk on."],
    ["A child is afraid of the dark.", "Leave a light on and stand guard.", "Then the dark has a guardian tonight.", "Sit with them until they sleep.", "Then they learn the dark can be gentle."],
    ["A younger person asks for help with something you once found hard.", "Show them the way you found.", "Then your struggle became their map.", "Ask how they see it first.", "Then they found their own way, with you near."],
    ["You were hard on yourself today.", "Forgive yourself and stand up.", "Then you gave yourself the support you give others.", "Speak to yourself as an elder would.", "Then the kindest voice in the room was yours."],
  ],
};

/** By pillar, year, month, day and hour, as PILLAR_CHOICE. */
export const PILLAR_TURNS: [Turns, Turns, Turns, Turns] = [
  [
    ["Your family's name is spoken with a weight you did not choose.", "Carry it and make it shine.", "Then the name is brighter for passing through your hands.", "Carry it gently, in your own way.", "Then the name grows a new branch. That is how families live."],
    ["An old family custom is falling out of use.", "Keep it alive yourself.", "Then the old thread is still running through the cloth.", "Let it rest, with thanks.", "Then you honoured it by letting it be finished."],
    ["You find a photograph of yourself as a small child.", "Make a promise to that child.", "Then the child has someone strong standing for them now.", "Sit with it and remember.", "Then the child was seen again, and kindly."],
    ["A habit from childhood still follows you.", "Keep it on purpose.", "Then it is yours now, carried by choice.", "Thank it and let it go.", "Then the child's way of coping can finally rest."],
    ["Someone from your earliest years appears again.", "Greet them warmly.", "Then the old road and the new met in daylight.", "Listen to what they remember of you.", "Then you hear yourself through another's years."],
    ["You learn where your people came from.", "Go and stand there.", "Then your feet touched the root.", "Learn the stories slowly.", "Then the roots reach you one story at a time."],
    ["An elder of the family has died, and the stories have gone quiet.", "Gather the family and tell the stories.", "Then the voices are carried on.", "Keep one story close and tell it when the time is right.", "Then the story waits safe in you."],
    ["A pattern runs through your family that you want to end.", "End it with you.", "Then the line bends because you bent it.", "Name it and choose differently, slowly.", "Then change came in small brave steps."],
    ["The family gathers, and you feel like a stranger at the table.", "Speak up and take your place.", "Then the table made room. You made it make room.", "Listen for the one who feels it too.", "Then two strangers became kin."],
    ["The town you grew up in has changed.", "Help build what it becomes.", "Then your roots have new shoots.", "Walk the old streets and remember.", "Then the town you knew still lives in you."],
    ["A family member asks you to carry on their work.", "Take it up.", "Then the work goes on in younger hands.", "Ask what part of it is truly yours to carry.", "Then you took what fit and blessed the rest."],
  ],
  [
    ["A big chance at work falls on the day of a family celebration.", "Take the chance.", "Then you met the moment in your season of strength.", "Go to the celebration.", "Then the day belonged to the people who raised you."],
    ["You could work late every night this month and get ahead.", "Do it, for this month.", "Then the work moved because you moved it.", "Keep your evenings.", "Then the work is good and the life around it is too."],
    ["Your parents hoped you would do different work.", "Show them what your work is worth.", "Then they see you in your full strength.", "Tell them why it matters to you.", "Then they heard your heart along with your choice."],
    ["A parent asks for help with their work.", "Take it on fully.", "Then you carried the family's work in your season.", "Help them and keep your own work going.", "Then both works grow."],
    ["You notice you work just the way a parent did.", "Use it proudly.", "Then the inheritance is a tool in your hand.", "Notice it gently and choose what to keep.", "Then you are shaping what you were shaped by."],
    ["You feel at the height of your powers.", "Take on the biggest work you can.", "Then your season is spent on something worthy.", "Spend it on what you love most.", "Then strength went where the heart was."],
    ["The work you are good at no longer feels like yours.", "Change course boldly.", "Then your strength found a new field.", "Rest and listen for what is next.", "Then the next work has room to call you."],
    ["Someone younger needs a start in your trade.", "Open the door for them.", "Then your strength became someone else's beginning.", "Teach them what you wish you had known.", "Then your own training lives on in them."],
    ["A lesson from your upbringing no longer fits.", "Set it down firmly.", "Then you are raising yourself now.", "Keep the part that was kind.", "Then the upbringing is pruned and still green."],
    ["You catch yourself repeating a saying from your parents.", "Say it proudly.", "Then the old words still do good work.", "Smile, and say it your own way next time.", "Then the words grew up with you."],
    ["Your work in the world is asked to serve something larger.", "Say yes and lead.", "Then the work became a calling.", "Ask how you can serve and still be whole.", "Then the calling has room for you in it."],
  ],
  [
    ["Your partner asks what you want, really.", "Tell them.", "Then they know the shape of your desire. That is trust.", "Ask them the same, and take turns.", "Then two wants met at one table."],
    ["Someone close sees a part of you that you usually hide.", "Let them see all of it.", "Then you were known, and you stayed.", "Ask what they see.", "Then you learned yourself in their eyes."],
    ["You are alone with yourself on a long evening.", "Ask yourself a hard question.", "Then you met yourself with courage.", "Ask yourself what you need.", "Then you were your own good company."],
    ["You notice you have changed.", "Claim who you are now.", "Then the new self stands in the light.", "Thank who you were.", "Then the old self rests with honour."],
    ["Someone describes you, and they are wrong.", "Correct them.", "Then you stood up for your own shape.", "Let them be wrong and stay as you are.", "Then you know your own face, whatever picture they hold."],
    ["You and someone you love disagree about something that matters.", "Hold your ground with love.", "Then both of you were real in the room.", "Find the place where you agree first.", "Then the disagreement has a floor to stand on."],
    ["Your partner is going through something hard.", "Carry what you can for them.", "Then love had strong arms today.", "Sit beside them without fixing it.", "Then love had a quiet face, and it was enough."],
    ["Love is offered to you openly.", "Meet it fully.", "Then two hearts met at full height.", "Take it in slowly.", "Then love was given time to be trusted."],
    ["Your heart wants something your head calls foolish.", "Follow your heart.", "Then you lived from the centre.", "Let the two of them talk it over.", "Then heart and head left as friends."],
    ["You have been strong for everyone else.", "Be strong for yourself now.", "Then your strength came home.", "Let yourself be soft for a while.", "Then softness was a rest your heart had earned."],
    ["Someone asks who you are, with no title or work to hide behind.", "Answer in one bold sentence.", "Then you named yourself plainly.", "Answer with a story.", "Then they met you the way a friend does."],
  ],
  [
    ["A student is ready to work without you.", "Give them one last hard test.", "Then they leave knowing they can meet it.", "Send them off with your blessing.", "Then they carry your trust as well as your teaching."],
    ["Your work is about to be seen by people you will never meet.", "Sign it boldly.", "Then your name travels with your work.", "Let it go out unsigned.", "Then the work is free to belong to whoever needs it."],
    ["A young person chooses a path you would not have chosen.", "Tell them honestly what you see.", "Then they had your honesty to steer by.", "Back them anyway.", "Then they walk knowing someone believes in them."],
    ["A child asks you a question you cannot answer.", "Find the answer together.", "Then you showed them how answers are found.", "Say you do not know, and wonder with them.", "Then wonder became something you share."],
    ["Someone younger copies the way you live.", "Live so the copy is worth having.", "Then your example is strong.", "Show them your mistakes too.", "Then they learned that growing is allowed to be messy."],
    ["You picture yourself much older, looking back.", "Choose one thing to start now.", "Then the older you has something to be proud of.", "Ask that older self what mattered.", "Then the years ahead spoke softly to you."],
    ["There is something you have always meant to do.", "Begin it this week.", "Then someday became now.", "Write it down and keep it close.", "Then it stays alive until its hour comes."],
    ["A craft you love will outlast you.", "Make one more piece you are proud of.", "Then you added to the thing that lasts.", "Teach it to someone.", "Then the craft has another pair of hands."],
    ["You are asked what you would like to leave behind.", "Build something lasting with what you have.", "Then those who come after have ground to stand on.", "Leave the stories, told well.", "Then those who come after know who they come from."],
    ["Someone carries on your work and changes it.", "Ask them to keep its spine.", "Then the work stayed upright in new hands.", "Let them change it.", "Then the work lives because it was allowed to grow."],
    ["A seed you planted long ago has become a tree you will not sit under.", "Plant another.", "Then you are still sending shade forward.", "Sit beside it a while and be glad.", "Then you saw the gift you gave."],
  ],
];

/** How many different choices one place can offer before any comes round again. */
export const CHOICE_CYCLE = 12;

const toChoice = (s: Scene, tagged: boolean, yangFirst: boolean): Choice => {
  const L = (en: string) => ({ en, zh: "" });
  const yang = { label: L(s[1]), reply: L(s[2]), tag: tagged ? ("stand" as const) : null };
  const yin = { label: L(s[3]), reply: L(s[4]), tag: tagged ? ("room" as const) : null };
  return { prompt: L(s[0]), options: yangFirst ? [yang, yin] : [yin, yang] };
};

/**
 * The choice a place offers on this turn. Turn null keeps the approved choice
 * (the 中文 walk). Otherwise the twelve come round in order, a new family
 * every turn, and the offset keeps places on one walk out of step.
 * An invitation's two answers keep tag null, as the approved one does.
 */
export function turnChoice(approved: Choice, turns: Turns, turn: number | null, offset = 0, tagged = true): Choice {
  if (turn === null) return approved;
  const k = (((turn + offset) % CHOICE_CYCLE) + CHOICE_CYCLE) % CHOICE_CYCLE;
  const family = k % 4;
  const variation = Math.floor(k / 4);
  if (family === 0 && variation === 0) return approved;
  const at = family === 0 ? variation - 1 : 2 + (family - 1) * 3 + variation;
  // The Yang way leads on even scenes and the Yin way on odd ones.
  return toChoice(turns[at], tagged, tagged ? at % 2 === 0 : true);
}

let walkTurn = Math.floor(Date.now() / 60000) % CHOICE_CYCLE;
/** A new turn for each walk begun this visit. Held in memory only. */
export function nextWalkTurn(): number {
  walkTurn = (walkTurn + 1) % 1_000_000;
  return walkTurn;
}
