/**
 * Long-form posts on North Indian cooking and the royal kitchens the menu
 * borrows from. Stored as structured blocks rather than markdown so the
 * renderer stays dependency-free and every heading can carry an anchor id.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; title: string; text: string }

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: 'Royal Recipes' | 'Kitchen Craft' | 'Delhi Food' | 'Ingredients'
  author: string
  authorRole: string
  publishedAt: string
  updatedAt: string
  readingMinutes: number
  heroAlt: string
  tags: string[]
  body: Block[]
}

export const posts: Post[] = [
  {
    slug: 'dum-pukht-the-lost-art-of-sealed-cooking',
    title: 'Dum Pukht: the lost art of cooking inside a sealed pot',
    excerpt:
      'Awadh’s most famous technique was invented to feed famine relief workers, not kings. Here is how sealing a pot with dough changes what happens inside it — and why we still do it.',
    category: 'Royal Recipes',
    author: 'The Morsaab’s Kitchen',
    authorRole: 'Written at the pass',
    publishedAt: '2026-07-22',
    updatedAt: '2026-08-10',
    readingMinutes: 8,
    heroAlt: 'A sealed brass handi with a dough rim, resting over low charcoal embers',
    tags: ['dum pukht', 'awadhi', 'technique', 'biryani'],
    body: [
      { type: 'p', text: 'There is a story every food writer in India tells about dum pukht, and for once the story is true. In 1784, Nawab Asaf-ud-Daula of Awadh started building the Bara Imambara in Lucknow as a famine relief project. Thousands of workers needed feeding, at all hours, in shifts. Somebody in that kitchen worked out that if you filled enormous pots with rice, meat, vegetables and spice, sealed the lids with dough and left them over dying embers, the food would still be hot and — more importantly — still be good whenever a shift came off the site.' },
      { type: 'p', text: 'The Nawab is said to have walked past those pots, smelled what was happening inside them, and had the technique moved into his own kitchen. Famine food became court food. That is the part of the story people forget.' },
      { type: 'h2', text: 'What the seal actually does' },
      { type: 'p', text: 'Sealing a pot with a rope of atta dough is not a quaint flourish. It changes the physics of what is happening inside.' },
      { type: 'ul', items: [
        'Steam cannot escape, so the food cooks in its own moisture at just above 100°C rather than drying out.',
        'Volatile aromatics — cardamom, kewra, saffron, mace — have nowhere to go. In an open pot most of them leave in the first ten minutes.',
        'Pressure builds very slightly, which pushes that aromatic steam back into the rice and the vegetables instead of into the kitchen.',
        'The dough itself bakes into a hard crust, which tells you the seal held. A cracked seal is visible immediately.',
      ] },
      { type: 'p', text: 'The result is a dish where the flavour is *inside* the grain rather than coating it. Open a properly dum-cooked biryani and the aroma arrives all at once, in a way that an open-pot pulao never manages.' },
      { type: 'h2', text: 'The three temperatures' },
      { type: 'p', text: 'Traditional dum uses heat from below and above — embers under the pot and hot coals piled on the lid. Most modern kitchens skip the coals on top, which is why home dum biryani so often ends up with a scorched base and an underdone crown.' },
      { type: 'ol', items: [
        'Base heat: low and steady. On a gas hob, this means a tawa between flame and pot to diffuse it. Direct flame will burn the bottom layer before the top has warmed.',
        'Top heat: coals on the lid, or in a domestic kitchen, a preheated oven at 160°C for the last fifteen minutes.',
        'Rest: at least ten minutes off the heat before the seal is broken. The pot is still cooking. Break it early and you lose the steam that was about to finish the job.',
      ] },
      { type: 'callout', title: 'In our kitchen', text: 'We run dum on the Royal Special thali’s pulao and on the dal makhani, which sits sealed for six hours overnight. The dal is not a fast dish and we have never found a way to make it one that we were willing to serve.' },
      { type: 'h2', text: 'Why vegetarian dum is harder' },
      { type: 'p', text: 'Meat brings fat and collagen to a sealed pot. Both are forgiving: fat carries spice, collagen turns to gelatin and gives body. A vegetarian dum has neither, so everything has to be built deliberately.' },
      { type: 'p', text: 'We compensate three ways. Birista — onions fried slowly to a deep brown and then crushed — replaces some of the fat-borne sweetness. Fried cashew paste gives body where collagen would have. And the vegetables go in at staggered times rather than all at once, because a potato and a green pea do not want the same forty minutes.' },
      { type: 'quote', text: 'The seal is not the technique. The seal is what lets the technique work unattended. The technique is knowing what to put in the pot and in what order.', cite: 'Our head chef' },
      { type: 'h2', text: 'Trying it at home' },
      { type: 'p', text: 'You do not need a brass handi. A heavy-bottomed pot with a well-fitting lid and a rope of stiff chapati dough around the rim will do. What you do need is patience and a diffuser — a plain iron tawa between the flame and the pot costs almost nothing and is the single difference between a dum that works and one that scorches.' },
      { type: 'p', text: 'Start with a vegetable pulao rather than a biryani. Fewer layers, less that can go wrong, and you will learn what the seal sounds like when it is working — a faint, steady hiss, and then nothing at all.' },
    ],
  },
  {
    slug: 'why-paneer-butter-masala-tastes-different-everywhere',
    title: 'Why paneer butter masala tastes different in every restaurant',
    excerpt:
      'The same six ingredients produce wildly different dishes. The variable is not the recipe — it is the tomato, the cashew and how long somebody was willing to stand over the pan.',
    category: 'Kitchen Craft',
    author: 'The Morsaab’s Kitchen',
    authorRole: 'Written at the pass',
    publishedAt: '2026-06-14',
    updatedAt: '2026-07-30',
    readingMinutes: 7,
    heroAlt: 'A copper handi of paneer butter masala with a swirl of cream and crushed kasuri methi',
    tags: ['paneer', 'north indian', 'technique', 'tomato'],
    body: [
      { type: 'p', text: 'Order paneer butter masala at five restaurants in Delhi and you will get five different dishes. One is orange and cloyingly sweet. One is thin and sharply acidic. One tastes mostly of cream. One has a strange metallic edge. And one, occasionally, is the thing you were actually hoping for.' },
      { type: 'p', text: 'The ingredient list is nearly identical in all five kitchens: tomato, cashew, butter, cream, kasuri methi, and paneer. So the variation is not coming from the recipe. It is coming from four decisions that most recipes do not mention.' },
      { type: 'h2', text: 'Decision one: which tomato' },
      { type: 'p', text: 'This is the biggest single variable and almost nobody writes it down. A desi tomato is small, thin-skinned and genuinely sour. A hybrid table tomato is large, watery and comparatively sweet. Substitute one for the other and you have changed the dish fundamentally — the sourness that the cream is supposed to be balancing simply is not there.' },
      { type: 'p', text: 'Kitchens that use the sweeter hybrid tomato compensate by adding sugar, which is why so much restaurant makhani tastes like dessert. The fix is not less sugar; it is a sourer tomato.' },
      { type: 'h3', text: 'What we do' },
      { type: 'p', text: 'Two parts desi tomato to one part hybrid, blanched and passed through a sieve rather than blended with the skins. Blended skin is where the metallic edge comes from.' },
      { type: 'h2', text: 'Decision two: how long the cashew soaks' },
      { type: 'p', text: 'Cashew paste is the body of the gravy. Under-soaked cashews will not break down completely, and no amount of blending fixes it — you get a gravy that is subtly grainy on the tongue and separates on the plate within ten minutes.' },
      { type: 'ul', items: [
        'Twenty minutes in hot water: grainy. This is what most kitchens do when they are behind.',
        'Four hours in cold water: smooth, but flat in flavour.',
        'Twenty minutes simmered in the tomato itself, then blended hot: smooth and the cashew flavour actually carries.',
      ] },
      { type: 'h2', text: 'Decision three: when the butter goes in' },
      { type: 'p', text: 'Butter added at the start, with the aromatics, browns and gives a nutty depth. Butter added at the end, off the heat, stays sweet and dairy-fresh and gives that glossy finish. These are different dishes and both are legitimate. Adding all your butter at one end and wondering why it tastes unbalanced is the mistake.' },
      { type: 'p', text: 'We split it — a third at the start with the whole spices, two thirds swirled in off the heat at the end.' },
      { type: 'h2', text: 'Decision four: the kasuri methi' },
      { type: 'p', text: 'Dried fenugreek leaf is what makes the dish smell like *that*. It also goes bitter fast. Crushed between the palms and added in the last thirty seconds, it is the signature. Boiled in the gravy for five minutes, it is a bitter note you cannot remove.' },
      { type: 'callout', title: 'The thirty-second rule', text: 'Kasuri methi, garam masala and cream all go in during the last thirty seconds. Everything that makes the dish smell expensive is volatile. Cook it and you have thrown it away.' },
      { type: 'h2', text: 'And the paneer' },
      { type: 'p', text: 'Paneer should go into the gravy warm and stay there for two minutes, not twenty. Long simmering squeezes water out of it and turns it rubbery — the exact texture people complain about. If the paneer is fridge-cold, soak it in hot salted water for five minutes first. It will be softer than the block you started with.' },
      { type: 'quote', text: 'People think the secret is a spice. It is almost never a spice. It is a tomato and a timer.', cite: 'Our head chef' },
    ],
  },
  {
    slug: 'indo-chinese-how-delhi-invented-a-cuisine',
    title: 'Indo-Chinese: how Kolkata invented a cuisine and Delhi turned up the heat',
    excerpt:
      'Chilli paneer is not a corruption of Chinese food. It is a 150-year-old cuisine with its own logic, its own techniques, and a Hakka community in Tangra to thank for it.',
    category: 'Delhi Food',
    author: 'The Morsaab’s Kitchen',
    authorRole: 'Kitchen notes',
    publishedAt: '2026-05-19',
    updatedAt: '2026-06-25',
    readingMinutes: 9,
    heroAlt: 'A wok mid-toss with cubes of paneer, capsicum and onion catching the flame',
    tags: ['indo-chinese', 'hakka', 'kolkata', 'history'],
    body: [
      { type: 'p', text: 'There is a particular kind of food snobbery that describes Indo-Chinese food as "not real Chinese food," as though that were a criticism. It is not real Chinese food. It was never trying to be. It is a distinct cuisine, roughly 150 years old, invented by a specific community in a specific city, and it has its own internal logic that is worth understanding.' },
      { type: 'h2', text: 'Tangra, Kolkata' },
      { type: 'p', text: 'Hakka Chinese migrants began arriving in Calcutta in the late 18th century, and by the 1900s a substantial community had settled in Tangra, in the east of the city, working mostly in tanning and shoemaking. They cooked what they knew, with what Bengal sold them.' },
      { type: 'p', text: 'What Bengal sold them was not what China sold them. No Shaoxing wine, so vinegar. Limited access to the specific soy sauces of southern China, so a darker, sweeter local soy. And an abundance of green chilli, ginger and garlic — the three things that would come to define the entire cuisine.' },
      { type: 'p', text: 'By the 1950s Tangra had restaurants, and by the 1970s the food had left Kolkata entirely and become a national obsession.' },
      { type: 'h2', text: 'The four pillars' },
      { type: 'p', text: 'Almost every Indo-Chinese dish is built on some combination of four things:' },
      { type: 'ol', items: [
        'The aromatic trinity: green chilli, ginger and garlic, chopped fine and hit with very high heat for a few seconds. Not sliced, not crushed — chopped.',
        'A cornflour slurry, which is what gives the sauces their particular glossy cling. This is doing a job that stock reduction does in Cantonese cooking, in a fraction of the time.',
        'Vinegar and soy in tension. The sourness is doing as much work as the salt.',
        'A double fry. Anything that should be crisp is fried once at a moderate temperature to cook it through, rested, and fried again hot to crisp the surface.',
      ] },
      { type: 'h3', text: 'Why the double fry matters' },
      { type: 'p', text: 'This is the single most common thing home cooks skip and the single biggest reason home chilli potato goes soggy. The first fry drives moisture out of the interior. The rest lets the remaining moisture redistribute to the surface. The second fry, at a genuinely high temperature, flashes that surface moisture off. Skip the rest and you are just frying wet potato twice.' },
      { type: 'h2', text: 'What Delhi changed' },
      { type: 'p', text: 'Indo-Chinese arrived in Delhi and got hotter, drier and sweeter, roughly in that order. Kolkata’s versions are more restrained and more sour. Delhi added chilli, cut the gravy back so the sauce clings rather than pools, and — in the 1990s — started adding honey, which is where honey chilli potato comes from.' },
      { type: 'p', text: 'Delhi also made it overwhelmingly vegetarian. In Tangra, chilli chicken is the anchor dish. In West Delhi, chilli paneer outsells everything, and an entire vegetarian grammar grew up around it: paneer, mushroom, babycorn, soya chaap.' },
      { type: 'callout', title: 'The chaap question', text: 'Soya chaap is a genuinely North Indian invention — wheat gluten wrapped on a stick — that got absorbed into Indo-Chinese cooking somewhere around Karol Bagh in the 2000s. There is no Chinese antecedent for it at all. It is a Delhi dish wearing an Indo-Chinese sauce.' },
      { type: 'h2', text: 'Cooking it at home' },
      { type: 'p', text: 'The domestic obstacle is heat. A restaurant wok burner puts out several times what a home hob does, and wok hei — the faint scorched aroma of a properly seared toss — is genuinely difficult without it.' },
      { type: 'ul', items: [
        'Cook in small batches. Crowding the pan drops the temperature and you end up steaming.',
        'Get everything chopped and within arm’s reach first. From the moment the aromatics hit the oil, the dish is 90 seconds long.',
        'Use a flat-bottomed carbon steel pan rather than a round wok on a domestic hob — more contact, more heat transfer.',
        'Add the cornflour slurry last, off the boil, and let it come back to a simmer for ten seconds. Longer and it goes gluey.',
      ] },
      { type: 'quote', text: 'It is not fusion. Fusion is a chef’s decision. This was a community cooking dinner with what the market had.', cite: 'Our head chef' },
    ],
  },
  {
    slug: 'the-mughal-spice-box-what-each-spice-does',
    title: 'The Mughal spice box: what each spice is actually doing',
    excerpt:
      'Garam masala is not one thing. Here is what the nine spices in a royal kitchen’s box contribute, when they go in, and what happens if you get the order wrong.',
    category: 'Ingredients',
    author: 'The Morsaab’s Kitchen',
    authorRole: 'Written at the pass',
    publishedAt: '2026-04-08',
    updatedAt: '2026-07-02',
    readingMinutes: 10,
    heroAlt: 'A round steel masala dabba with nine compartments of whole and ground spices',
    tags: ['spices', 'garam masala', 'mughlai', 'technique'],
    body: [
      { type: 'p', text: 'Every Indian kitchen has a masala dabba, and almost every cook can tell you what is in theirs. Fewer can tell you what each spice is *for* — what specific job it does that the others cannot. Which is a problem, because once you know, substitution stops being guesswork.' },
      { type: 'p', text: 'Here is the Mughal box as we keep it, and what each compartment contributes.' },
      { type: 'h2', text: 'The structural spices' },
      { type: 'h3', text: 'Cumin (jeera)' },
      { type: 'p', text: 'The floor of North Indian cooking. Earthy, slightly bitter, and — crucially — fat-soluble, which is why it goes into hot ghee first. Cumin bloomed in fat tastes completely different from cumin stirred into a finished gravy: rounder, nuttier, less dusty. If a dish tastes flat and you cannot say why, it is usually cumin that went in too late.' },
      { type: 'h3', text: 'Coriander (dhania)' },
      { type: 'p', text: 'The bulking agent, and not in a dismissive sense. Ground coriander gives body and a mild citrus sweetness, and it thickens. A gravy with no coriander tastes thin no matter how much you reduce it.' },
      { type: 'h3', text: 'Turmeric (haldi)' },
      { type: 'p', text: 'Colour, a faint bitterness, and a musty base note. Turmeric burns easily and turns acrid — it should go in with liquid, not into dry hot oil. Most people use too much. A quarter teaspoon does what a full teaspoon does, without the chalkiness.' },
      { type: 'h2', text: 'The aromatic spices' },
      { type: 'h3', text: 'Green cardamom (choti elaichi)' },
      { type: 'p', text: 'The signature of Mughlai cooking. Eucalyptic, sweet, floral. Extremely volatile — this is a last-thirty-seconds spice, or a whole-pod-in-the-oil spice, never a boil-for-twenty-minutes spice. Shahi paneer without cardamom is just cream sauce.' },
      { type: 'h3', text: 'Black cardamom (badi elaichi)' },
      { type: 'p', text: 'A completely different ingredient despite the name — smoky, camphorous, dried over open flame. One pod is plenty for a whole pot. It belongs in slow-cooked dishes, which is why it is in dal makhani and not in a quick sabzi.' },
      { type: 'h3', text: 'Cinnamon and cassia (dalchini)' },
      { type: 'p', text: 'Warm sweetness without sugar. Cassia — thicker, coarser bark — is what most Indian kitchens actually use and what most recipes mean. True Ceylon cinnamon is more delicate and gets lost in a heavy gravy.' },
      { type: 'h3', text: 'Cloves (laung)' },
      { type: 'p', text: 'Powerfully medicinal, numbing in quantity. Three or four cloves in a pot for six people. This is the spice most often overdone, and the result is a gravy that tastes faintly of a dentist’s waiting room.' },
      { type: 'h2', text: 'The finishing spices' },
      { type: 'h3', text: 'Mace and nutmeg (javitri, jaiphal)' },
      { type: 'p', text: 'The two halves of the same seed, and the most distinctly royal note in the box. Mace is the lacy red aril, more floral; nutmeg is the kernel, warmer and sweeter. Both go in at the very end, ground fine, in tiny quantities. This is what people are tasting when they say a dish tastes "expensive" and cannot explain why.' },
      { type: 'h3', text: 'Saffron (kesar)' },
      { type: 'p', text: 'Bloom it. Saffron threads dropped dry into a gravy give you colour and almost nothing else. Steeped in two tablespoons of warm milk for ten minutes first, they give you the honeyed, hay-like aroma you actually paid for.' },
      { type: 'callout', title: 'The order that matters', text: 'Whole spices into hot fat. Ground spices with the onions, before the tomato. Powdered finishing spices — garam masala, mace, nutmeg — off the heat. Get this order wrong and no quantity adjustment will fix it.' },
      { type: 'h2', text: 'On garam masala' },
      { type: 'p', text: 'Garam masala is not a spice, it is a finishing blend, and every family’s is different. What all good ones share is that they are dominated by the aromatic and finishing spices above — cardamom, cinnamon, clove, mace — and not by cumin and coriander, which have already done their work earlier in the dish.' },
      { type: 'p', text: 'Buy it in small quantities or grind it yourself. Ground garam masala is at its best for about six weeks and then it is just brown powder.' },
      { type: 'quote', text: 'A spice box is a set of decisions somebody already made. Learn what each decision was for and you can start making your own.', cite: 'Our head chef' },
    ],
  },
  {
    slug: 'eating-well-around-dwarka-mor',
    title: 'Eating well around Dwarka Mor: a local’s guide',
    excerpt:
      'West Delhi does not get written about much. Here is what is actually worth your evening between Uttam Nagar and Dwarka Mor — including the places that are not us.',
    category: 'Delhi Food',
    author: 'The Morsaab’s Kitchen',
    authorRole: 'Kitchen notes',
    publishedAt: '2026-03-11',
    updatedAt: '2026-08-01',
    readingMinutes: 6,
    heroAlt: 'Evening street scene on Rama Park Road with lit shopfronts and food carts',
    tags: ['dwarka mor', 'uttam nagar', 'west delhi', 'local guide'],
    body: [
      { type: 'p', text: 'Food writing about Delhi has a geography problem. It covers Old Delhi thoroughly, South Delhi obsessively, and treats everything west of Rajouri Garden as a place people commute from. Anyone who actually lives between Uttam Nagar and Dwarka Mor knows this is nonsense.' },
      { type: 'p', text: 'This is a partisan guide — we run a restaurant here — so treat the recommendations accordingly. But the neighbourhood deserves the write-up.' },
      { type: 'h2', text: 'The morning' },
      { type: 'p', text: 'West Delhi does breakfast better than it gets credit for. The chhole-bhature carts near Uttam Nagar East metro start around 8 AM and are done by noon, and the queue tells you which one to join. Bedmi puri and aloo, if you can find it, is worth more of a detour than the more famous versions in Chandni Chowk, mostly because you will not queue for forty minutes.' },
      { type: 'h2', text: 'The afternoon' },
      { type: 'p', text: 'Lunch here is thali territory, and it is genuinely competitive. Most of the strip along Rama Park Road runs a lunch thali between ₹150 and ₹350, and the price tells you roughly how many sabzis you get and whether the paneer is real.' },
      { type: 'callout', title: 'Our bias, declared', text: 'Our Royal Special thali is ₹349. We think it is the best value on the road. You should assume we would say that and try two others as well.' },
      { type: 'h2', text: 'The evening' },
      { type: 'p', text: 'This is where the neighbourhood is strongest and least documented. The Indo-Chinese here is excellent — West Delhi has more chilli paneer per square kilometre than anywhere else in the city, and the competition has made it good. The tandoor stalls that fire up around 7 PM near Mohan Garden do a soya chaap that people drive across the city for.' },
      { type: 'ul', items: [
        'Late-night: the strip stays open past 11 PM on weekends, which is unusual for this side of Delhi.',
        'Sweets: the mithai shops near Dwarka Mor metro do a rasmalai that is worth the walk from the station.',
        'Chaat: the carts near the Bindapur turning are the neighbourhood standard, and every family here has a fixed opinion about which one.',
      ] },
      { type: 'h2', text: 'Getting around' },
      { type: 'p', text: 'Dwarka Mor and Uttam Nagar East are both on the Blue Line, which makes the whole strip reachable without a car. Rama Park Road is about a seven-minute walk from Dwarka Mor metro, and auto-rickshaws from either station will not charge more than ₹40 within the area — do not accept the first quote.' },
      { type: 'p', text: 'Parking is the genuine constraint on Friday and Saturday evenings. If you are driving, come before 7:30 PM or plan on parking two lanes back.' },
      { type: 'quote', text: 'The best food in Delhi is very rarely the most written-about food in Delhi.', cite: 'Our head chef' },
    ],
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export const postsByDate = [...posts].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)
