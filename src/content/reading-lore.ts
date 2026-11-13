/**
 * What each phase is, and how the reading tends it, for the Destiny Chart.
 *
 * Every part here is said nine ways (the owner, 13 November 2026:
 * "Everything should have as many options as b1"). A middle is three
 * openings and three endings, and any opening reads with any ending. Each
 * phase has nine small acts of care, three for each close of a phrase.
 */

export type PhaseKey = "wood" | "fire" | "earth" | "metal" | "water";
type Trio = [string, string, string];
/** One part, said as any of three openings with any of three endings. */
export type Half = { x: Trio; y: Trio };

/** Nine small acts of care for each phase, said to the reader. */
export const TEND: Record<PhaseKey, [string, string, string, string, string, string, string, string, string]> = {
  wood: [
    "water your wood and give its branches room",
    "keep your green things in the sun",
    "let your wood grow a ring a year and call that progress",
    "prune what is dead so the living wood can breathe",
    "plant one small seed this week and visit it often",
    "walk among trees when your sap runs low",
    "let your branches lean toward whatever feeds them light",
    "keep a little spring in your step and a little soil under your nails",
    "give your wood a trellis and watch it climb",
  ],
  fire: [
    "keep your fire fed and your door open",
    "guard your flame from every draft",
    "let your fire be seen and let it warm someone",
    "bank your coals at night so the morning catches fast",
    "light a candle for something you love",
    "dance until the room warms up",
    "gather your people around your hearth",
    "let your spark sit near good kindling",
    "shine without burning the room down",
  ],
  earth: [
    "keep your earth turned and your pantry stocked",
    "plant your earth slowly and trust the harvest",
    "let your ground settle before you build on it",
    "eat a warm meal at a table you trust",
    "stand barefoot on bare ground now and then",
    "make a home where others can set down their bags",
    "mend one small thing that has been waiting",
    "give your field a fallow season",
    "keep a steady centre when the seasons spin",
  ],
  metal: [
    "keep your metal oiled and your bell polished",
    "hone your edge until it rings true",
    "let your metal shine on what you finish",
    "clear one shelf and keep only what shines",
    "breathe the autumn air and let it sharpen you",
    "keep your word like a well kept blade",
    "let go of whatever has gone to rust",
    "strike your bell once and let it ring",
    "polish one thing until it gleams",
  ],
  water: [
    "keep your water clean and moving",
    "give your water a quiet basin to rest in",
    "let your river find its own way to the sea",
    "drink deep and sleep long",
    "sit by moving water when your thoughts crowd",
    "keep a still pool inside for hard days",
    "carve your path slowly the way a river does",
    "trust the deep when the surface gets choppy",
    "follow your tides without apology",
  ],
};

/** b1 of a phase phrase (x and y), and its other three middles (b). */
export type Lore = { x: Trio; y: Trio; b: [Half, Half, Half] };

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
        {
          x: [
            "Picture the east wind at dawn whistling through new leaves, and you have your temperament in one breeze.",
            "Your temperament blows in from the east like a dawn wind through a young orchard.",
            "Somewhere an east wind is combing through spring leaves at sunrise, and it sounds a lot like you.",
          ],
          y: ["Reach, branch out and keep living things in view.", "Follow that breeze toward whatever is just beginning.", "Open the window and let it in every morning."],
        },
        {
          x: [
            "Wood bends and comes back, and it grows toward what it needs.",
            "A green branch bows in the storm and springs back taller.",
            "Wood leans toward the light with a patience that never quits.",
          ],
          y: [
            "So much of it gives you the patience of a tree and its stubborn hunger for height, so keep your roots watered.",
            "You carry that bend and that bounce in your bones, and your roots drink deepest when you slow down.",
            "That lean lives in you as a stubborn hunger for height, and every year you grow a little taller.",
          ],
        },
        {
          x: [
            "In wood the year is young and everything is still possible.",
            "Wood is the year at its youngest, every door still swinging open.",
            "Wood keeps the year in its first green hour, where every road is still a maybe.",
          ],
          y: [
            "You carry that youth a long way, the urge to start, to shelter and to grow, and it is yours to keep green.",
            "That youth travels with you, so start things, shelter things and grow them tall.",
            "You keep that green hour in your pocket, and it refreshes every time you begin.",
          ],
        },
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
        {
          x: [
            "Your chart has no east wind of its own, no sap rising in early spring.",
            "No dawn wind blows through your eight characters, and no sap climbs the trunk.",
            "Your spring was left off the guest list, so the east wind waits outside the door.",
          ],
          y: [
            "Borrow the breeze from good company, and tend whatever starts to sprout.",
            "Stand near people who carry it and let their breeze ruffle your leaves.",
            "Open the door to it often and feed whatever sprouts.",
          ],
        },
        {
          x: ["Wood grows toward light and keeps reaching.", "Wood is a reach that never gives up on the sky.", "A vine finds the sun even through a crack in the wall."],
          y: [
            "Learn the reach, and you will grow with a gardener's care.",
            "Practise that reach on purpose and your own green will follow.",
            "Copy that climb one small step at a time and you grow a spring of your own.",
          ],
        },
        {
          x: [
            "Benevolence is the virtue of wood, the kindness that lets living things flourish.",
            "Wood's virtue is benevolence, the generous hand that helps things grow.",
            "The kindness of wood is a gardener's kindness, all watering cans and patience.",
          ],
          y: [
            "Walk toward that kindness on purpose and you grow your own spring.",
            "Offer it freely and watch it come back to you in green.",
            "Practise it in small gestures and your own season starts to bud.",
          ],
        },
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
        {
          x: [
            "Wood is reaching and renewal, and for you it lives in one place.",
            "All your reaching and renewing grows from a single root.",
            "Your whole green season fits inside one character, like a forest folded into a seed.",
          ],
          y: ["That place is your doorway to beginnings, so keep it propped open.", "Return there whenever you need to start again.", "Visit it often and it keeps sprouting for you."],
        },
        {
          x: [
            "Benevolence, the virtue of wood, rests on one character for you, and it is the more precious for being alone.",
            "Your kindness of wood rests on one slender stem.",
            "One sapling holds all your benevolence, and it holds it proudly.",
          ],
          y: ["Shelter it like a sapling in a windy yard.", "Stake it gently and it will grow straight.", "Guard it from the frost and it will shade you one day."],
        },
        {
          x: [
            "Like a lone sprout pushing through pavement, your wood is small and unstoppable.",
            "Your wood is a dandelion in the sidewalk, cheerful and impossible to stop.",
            "A single green shoot can split stone, and yours has that kind of nerve.",
          ],
          y: ["Give it a little water and watch it work.", "Cheer it on and it will surprise you.", "Leave it some room and it will find the light."],
        },
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
        {
          x: [
            "Picture the south at midday, everything in flower and in full view, and that is your weather.",
            "Your weather is the south at noon, every bloom open and every shadow short.",
            "Somewhere a southern noon is blazing over a field of flowers, and it has your name on it.",
          ],
          y: ["Let yourself be seen, and keep good company close to the heat.", "Step into the light and invite your people in.", "Stand where you can be seen and share the warmth."],
        },
        {
          x: ["Fire rises, spreads and shows what was hidden.", "Fire climbs, catches and lights up every corner.", "A flame lifts toward the sky and turns the dark into a stage."],
          y: [
            "So much of it gives you brilliance, a quick heat and a knack for the ceremony that makes a gathering whole, so guard the flame from every draft.",
            "That gives you brilliance and a quick heat, and a gathering feels complete when you arrive.",
            "You inherit that lift, a quick spark and a gift for turning any evening into an occasion.",
          ],
        },
        {
          x: [
            "In fire the year stands at its height and holds nothing back.",
            "Fire is the year at full height, arms wide open.",
            "In fire the summer holds its longest day and spends every minute of it.",
          ],
          y: [
            "You carry that fullness, the urge to shine, to celebrate and to light the way, and your light grows when you share it.",
            "That fullness lives in you, so shine, celebrate and light a lamp for someone else.",
            "You keep that long day inside, and it grows brighter each time you hand it over.",
          ],
        },
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
        {
          x: [
            "Your chart has no high sun of its own to show itself by.",
            "No noon sun rises inside your eight characters.",
            "Your summer stayed home when your chart was cast, so the high sun is somewhere else.",
          ],
          y: [
            "Borrow the noon from the people who light you up, and tend that glow like a candle in a window.",
            "Sit near the people who glow and let their light warm your face.",
            "Go find it in good company and bring a little home in a jar.",
          ],
        },
        {
          x: [
            "A light you strike yourself is a light you know how to keep.",
            "A match you strike by hand teaches you everything about flame.",
            "Fire you build stick by stick is fire you understand.",
          ],
          y: ["Strike it on purpose, then guard it from every draft.", "Make the spark yourself and keep it fed.", "Light it with intent and keep the kindling close."],
        },
        {
          x: [
            "Propriety is the virtue of fire, the courtesy that gives every guest a place at the table.",
            "Fire's virtue is propriety, the grace of a good host.",
            "The courtesy of fire knows every guest by name and saves each a seat.",
          ],
          y: [
            "Set that table yourself, and the warmth comes to sit with you.",
            "Play the host on purpose and the glow will follow.",
            "Pull out a chair for someone and the room warms up.",
          ],
        },
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
        {
          x: [
            "Fire is radiance and gathering, and for you it lives in one place.",
            "All your radiance flickers from a single wick.",
            "Your whole summer burns inside one character, like a sun tucked into a lantern.",
          ],
          y: ["That place is your hearth, so keep it swept and the kettle on.", "Gather there when you need to glow.", "Return to it whenever the evening gets cold."],
        },
        {
          x: [
            "Propriety, the virtue of fire, rests on one character for you, and its light is the more precious for being alone.",
            "Your grace of fire burns in one small flame.",
            "One candle holds all your courtesy, and it holds it beautifully.",
          ],
          y: ["Cup your hands around it.", "Shield it from the wind and carry it carefully.", "Keep it trimmed and it will burn a long time."],
        },
        {
          x: [
            "Like the last match in a cold cabin, your fire matters more than its size.",
            "Your fire is a single ember in the grate, small and full of promise.",
            "One spark can light a bonfire, and yours has that kind of ambition.",
          ],
          y: ["Strike it when it counts.", "Blow on it gently and it will catch.", "Save it for the moments worth lighting."],
        },
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
        {
          x: [
            "Picture the centre of the compass holding the four directions together, and you have your gravity.",
            "Your gravity is the hub of the compass, the still point the four winds circle.",
            "Somewhere a compass needle settles at its centre, and that steadiness is yours.",
          ],
          y: [
            "Keep, carry and be the place others return to, and let yourself be returned to as well.",
            "Be the place people come home to, and come home to yourself too.",
            "Hold your ground and let the directions find you.",
          ],
        },
        {
          x: [
            "Earth receives the seed and the rain alike and turns them into harvest.",
            "Earth takes in seed, rain and time and gives back bread.",
            "Soil accepts whatever falls on it and quietly makes it into a meal.",
          ],
          y: [
            "So much of it gives you deep patience, so keep the soil turned and fed.",
            "You carry that patience in your bones, slow, sure and generous.",
            "That gift for turning what lands into what feeds is yours in plenty.",
          ],
        },
        {
          x: [
            "In earth each season rests before the next begins.",
            "Earth is the pause between seasons, the breath before the turn.",
            "Earth is the doorway every season walks through on its way to the next.",
          ],
          y: [
            "You carry that rest inside you, the urge to hold, to keep faith and to tend, and the first field to tend is your own.",
            "That pause lives in you, so hold, keep faith and look after your own field first.",
            "You keep that doorway open for others, and you can step through it yourself.",
          ],
        },
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
        {
          x: [
            "Your chart has no centre of its own to stand on, which leaves you free to choose your floor.",
            "No compass hub sits in your eight characters, so the floor is yours to pick.",
            "Your earth wandered off before the chart was cast, and now you get to choose your ground.",
          ],
          y: ["Pick ground that holds and tend it like a garden bed.", "Choose a place that holds weight and plant yourself there.", "Settle where the soil is kind and dig in."],
        },
        {
          x: [
            "Ground you make by hand is ground you know in every corner.",
            "A floor you lay yourself never surprises you.",
            "Earth built by hand is earth you can walk in the dark.",
          ],
          y: ["Lay it stone by stone and it will hold you.", "Build it slowly and it will carry you.", "Pack it down well and it will bear your weight."],
        },
        {
          x: [
            "Trust is the virtue of earth, the faith kept between people over time.",
            "Earth's virtue is trust, the promise that holds weight.",
            "The trust of earth is a handshake that lasts for years.",
          ],
          y: [
            "Build it promise by promise and you will have a field of your own.",
            "Keep your word in small things and the ground firms up under you.",
            "Plant it one kept promise at a time and the field grows.",
          ],
        },
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
        {
          x: [
            "Earth is holding and harvest, and for you it lives in one place.",
            "All your holding and harvesting happens in one small field.",
            "Your whole harvest fits inside one character, like a granary in a teacup.",
          ],
          y: ["That place is your still point, so give it a quiet hour.", "Go there when the world spins too fast.", "Return to it whenever you need to stand still."],
        },
        {
          x: [
            "Trust, the virtue of earth, rests on one character for you, and it is the more precious for being alone.",
            "Your trust of earth sits on one sturdy stone.",
            "One clay jar holds all your faithfulness, and it holds it well.",
          ],
          y: ["Keep it like a seed saved for spring.", "Guard it and it will steady you.", "Handle it gently and it will never crack."],
        },
        {
          x: [
            "Like a single stepping stone across a river, your earth carries more than it looks.",
            "Your earth is a cornerstone, small and holding up the whole wall.",
            "One good stone can anchor a house, and yours has that kind of backbone.",
          ],
          y: ["Step on it with confidence.", "Lean on it and feel it hold.", "Build around it and it will bear the weight."],
        },
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
        {
          x: [
            "Picture the west wind at dusk and a bell struck once in clear air, and that is your music.",
            "Your music is a single bell at dusk, ringing across a clear western sky.",
            "Somewhere a temple bell is sounding in the autumn evening, and the note is yours.",
          ],
          y: ["Let it ring, and keep it polished.", "Let that note carry and keep it bright.", "Strike it with care and let it travel."],
        },
        {
          x: [
            "Metal is refined in the fire and keeps its edge.",
            "Metal goes through the furnace and comes out sharper.",
            "A blade earns its edge in the flame and keeps it for years.",
          ],
          y: [
            "So much of it gives you resolve, a love of what is true and a courage for endings, so oil the blade and let it gleam.",
            "You carry that resolve, that love of truth and that courage for clean endings.",
            "That edge lives in you as resolve and a nose for what is true.",
          ],
        },
        {
          x: [
            "In metal the year gathers its harvest and lets the leaves go.",
            "Metal is the year bringing in the crop and dropping its leaves without regret.",
            "In metal the orchard is picked, the branches let go and the air turns crisp.",
          ],
          y: [
            "You carry that discernment, the urge to judge well, to release and to stand by your word, and your word grows brighter with use.",
            "That discernment is yours, so judge well, release well and keep your word.",
            "You keep that crisp air inside, and your word rings clearer every time you keep it.",
          ],
        },
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
        {
          x: [
            "Your chart has no blade of its own, no west wind to strip the branch.",
            "No autumn wind cuts through your eight characters.",
            "Your metal missed the casting, so the blade hangs on someone else's wall.",
          ],
          y: [
            "Borrow a clean cut from someone you trust, then hone it into your own.",
            "Learn the cut from people with a steady hand.",
            "Ask to hold it now and then until your grip remembers.",
          ],
        },
        {
          x: [
            "A line drawn with care is a fence the wind respects.",
            "A boundary drawn slowly is a boundary that stands.",
            "A line you mark by hand is a line you can defend.",
          ],
          y: ["Draw yours slowly and polish it.", "Draw it with care and keep it clean.", "Mark it clearly and walk it often."],
        },
        {
          x: [
            "Righteousness is the virtue of metal, the courage to do what is owed.",
            "Metal's virtue is righteousness, the nerve to keep a promise when it costs.",
            "The justice of metal is a bell that only rings true.",
          ],
          y: [
            "Practise it in small things first, like tuning a bell one note at a time.",
            "Start with small promises and your edge will grow.",
            "Tune it slowly and the note will come.",
          ],
        },
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
        {
          x: [
            "Metal is clarity and harvest, and for you it lives in one place.",
            "All your clarity is forged in one small blade.",
            "Your whole autumn fits inside one character, like a harvest moon in a locket.",
          ],
          y: ["That place is your conscience, so keep it polished.", "Go there when you need to choose.", "Return to it whenever the fog rolls in."],
        },
        {
          x: [
            "Righteousness, the virtue of metal, rests on one character for you, and it is the more precious for being alone.",
            "Your sense of what is just rings from one clear bell.",
            "One silver coin holds all your principle, and it holds it bright.",
          ],
          y: ["Keep it like your grandmother's silver.", "Polish it and it will shine.", "Spend it carefully and it will never tarnish."],
        },
        {
          x: [
            "Like a lone tuning fork in a noisy room, your metal sets the note for everything else.",
            "Your metal is the single key that opens the right door.",
            "One sharp needle can mend a whole coat, and yours is that precise.",
          ],
          y: ["Strike it clean.", "Use it with care and it will serve you well.", "Keep it handy and it will save the day."],
        },
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
        {
          x: [
            "Picture the north at midnight, dark, quiet and full of what has not yet surfaced, and that is your weather.",
            "Your weather is a northern midnight, still and deep and full of secrets.",
            "Somewhere a northern lake lies black and calm under the stars, and it holds your reflection.",
          ],
          y: ["Dive for what is hidden and come back with pearls.", "Go down into that dark and bring something up.", "Sit at its edge and listen to what rises."],
        },
        {
          x: [
            "Water takes the shape of any vessel and wears down stone in its own time.",
            "Water fills any cup and carves any canyon, given time.",
            "A river bends around every rock and still reaches the sea.",
          ],
          y: [
            "So much of it gives you adaptability, memory and a patience that outlasts force, so give the current room.",
            "You carry that adaptability, that long memory and a patience that outlasts force.",
            "That patience lives in you, flexible, deep and quietly unstoppable.",
          ],
        },
        {
          x: [
            "In water the year rests and gathers itself for spring.",
            "Water is the year asleep, dreaming of spring.",
            "In water the year pulls its blankets close and gathers strength under the snow.",
          ],
          y: [
            "You carry that inwardness, the urge to understand, to store and to move when the current is right, so keep the reservoir full.",
            "That inwardness is yours, so understand, store and move when the current calls.",
            "You keep that winter dream inside, and it wakes when the timing is right.",
          ],
        },
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
        {
          x: [
            "Your chart has no midnight of its own, no still pool to look into.",
            "No northern night falls inside your eight characters.",
            "Your water slipped away before the chart was cast, so the deep pool lies somewhere else.",
          ],
          y: [
            "Borrow the quiet from a friend who listens, and keep a cup of it by the bed.",
            "Find it in the people who listen and sit with them often.",
            "Go looking for it in quiet places and bring a little home.",
          ],
        },
        {
          x: [
            "Stillness that is learned runs as deep as stillness that is born.",
            "Quiet you practise goes as deep as quiet you were given.",
            "A well dug by hand fills just as full.",
          ],
          y: ["Sit with what you cannot yet see, and let the water clear.", "Sit still a while and let the silt settle.", "Wait at the edge and the water will come."],
        },
        {
          x: [
            "Wisdom is the virtue of water, the knowing that comes from patience.",
            "Water's virtue is wisdom, the knowing that takes its time.",
            "The wisdom of water is a slow drip that fills the bucket.",
          ],
          y: [
            "Give it time, like a spring filling a well drop by drop.",
            "Let it gather slowly and it will be there when you need it.",
            "Wait for it with patience and it will rise.",
          ],
        },
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
        {
          x: [
            "Water is depth and flow, and for you it lives in one place.",
            "All your depth pools in one small spring.",
            "Your whole winter fits inside one character, like the ocean held in a shell.",
          ],
          y: ["That place is your well, so lower the bucket gently.", "Go there when you need to listen.", "Return to it whenever the world gets loud."],
        },
        {
          x: [
            "Wisdom, the virtue of water, rests on one character for you, and it is the more precious for being alone.",
            "Your knowing of water rises from one quiet source.",
            "One raindrop holds all your wisdom, and it holds the whole sky.",
          ],
          y: ["Keep it like a single pearl in a quiet shell.", "Cherish it and it will deepen.", "Shelter it and it will clear your sight."],
        },
        {
          x: [
            "Like the one spring in a dry valley, your water draws every traveller.",
            "Your water is an oasis, small and life saving.",
            "One clear stream can green a whole meadow, and yours has that kind of reach.",
          ],
          y: ["Keep it running clear.", "Guard it well and it will keep you.", "Let it flow and watch what grows."],
        },
      ],
    },
  },
};
