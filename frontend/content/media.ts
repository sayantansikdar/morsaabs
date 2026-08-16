/**
 * Central image registry.
 *
 * Every image on the site is declared here with its alt text (feature 16), so
 * alt copy is reviewed in one place rather than scattered through JSX.
 *
 * ⚠️ PLACEHOLDER PHOTOGRAPHY — the `src` values point at stock photography.
 * Replace each one with real Morsaab's photography before launch; the alt text
 * is already written for the real subject. Team headshots in particular must be
 * genuine photos of the actual team (feature 20) — do not ship stock faces as
 * if they were staff.
 */

export type Media = { src: string; alt: string; width: number; height: number }

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const media = {
  heroAmbience: {
    src: u('photo-1517248135467-4c7edcad34c4', 1920),
    alt: 'The Morsaab’s dining room at dinner service, warm lamps over occupied tables beneath carved arches',
    width: 1920,
    height: 1280,
  },
  interiorArches: {
    src: u('photo-1552566626-52f8b828add9'),
    alt: 'Arched alcove seating on the Morsaab’s mezzanine, laid for a table of four',
    width: 1600,
    height: 1067,
  },
  kitchenPass: {
    src: u('photo-1556910103-1c02745aae4d'),
    alt: 'Chefs plating at the Morsaab’s kitchen pass under service lights',
    width: 1600,
    height: 1067,
  },
  tandoor: {
    src: u('photo-1585937421612-70a008356fbe'),
    alt: 'Paneer tikka skewers being lifted from the charcoal tandoor',
    width: 1600,
    height: 1067,
  },
  thali: {
    src: u('photo-1567188040759-fb8a883dc6d8'),
    alt: 'The Morsaab’s Royal Special thali with paneer, dal makhani, mix veg, naan, rice and dessert',
    width: 1600,
    height: 1067,
  },
  paneerButterMasala: {
    src: u('photo-1631452180519-c014fe946bc7'),
    alt: 'Paneer butter masala in a copper handi, finished with cream and crushed kasuri methi',
    width: 1600,
    height: 1067,
  },
  chilliPaneer: {
    src: u('photo-1626132647523-66f5bf380027'),
    alt: 'Indo-Chinese chilli paneer tossed with capsicum and onion in a dark chilli glaze',
    width: 1600,
    height: 1067,
  },
  dosa: {
    src: u('photo-1668236543090-82eba5ee5976'),
    alt: 'A crisp masala dosa served with sambhar and three chutneys',
    width: 1600,
    height: 1067,
  },
  dessert: {
    src: u('photo-1601050690597-df0568f70950'),
    alt: 'Warm gulab jamun in rose syrup, plated with crushed pistachio',
    width: 1600,
    height: 1067,
  },
  cateringCounter: {
    src: u('photo-1555244162-803834f70033'),
    alt: 'A live catering counter set up at an outdoor event, chafing dishes lit and staffed',
    width: 1600,
    height: 1067,
  },
  banquetHall: {
    src: u('photo-1519167758481-83f550bb49b3'),
    alt: 'The first-floor banquet hall laid for a seated dinner of 120 guests',
    width: 1600,
    height: 1067,
  },
  delivery: {
    src: u('photo-1526367790999-0150786686a2'),
    alt: 'A Morsaab’s rider loading an insulated hot-bag for a home delivery',
    width: 1600,
    height: 1067,
  },
  storefront: {
    src: u('photo-1590846406792-0adc7f938f1d'),
    alt: 'The Morsaab’s storefront on Rama Park Road, lit at dusk',
    width: 1600,
    height: 1067,
  },
} satisfies Record<string, Media>

/** Feature 20 — the team. Replace with real headshots and real names. */
export const team = [
  {
    name: 'Ramesh Bhatt',
    role: 'Head Chef',
    bio: 'Twenty-two years across Awadhi and Punjabi kitchens, the last nine of them running this pass. Writes most of what appears on our journal.',
    photo: {
      src: u('photo-1577219491135-ce391730fb2c', 800),
      alt: 'Head Chef Ramesh Bhatt in whites at the Morsaab’s kitchen pass',
      width: 800,
      height: 800,
    },
  },
  {
    name: 'Sunita Rawat',
    role: 'Sous Chef, Tandoor & South Indian',
    bio: 'Runs the tandoor and the dosa griddle. The podi idli on the menu is hers and she will not share the ratio.',
    photo: {
      src: u('photo-1595273670150-bd0c3c392e46', 800),
      alt: 'Sous Chef Sunita Rawat working the tandoor section',
      width: 800,
      height: 800,
    },
  },
  {
    name: 'Vikram Chauhan',
    role: 'Restaurant Manager',
    bio: 'The person who calls you back within fifteen minutes of a reservation request. Has run the floor since we opened.',
    photo: {
      src: u('photo-1560250097-0b93528c311a', 800),
      alt: 'Restaurant Manager Vikram Chauhan on the dining room floor',
      width: 800,
      height: 800,
    },
  },
  {
    name: 'Farah Qureshi',
    role: 'Catering & Events Lead',
    bio: 'Costs every catering quote personally and has never sent an invoice that differed from it.',
    photo: {
      src: u('photo-1594744803329-e58b31de8bf5', 800),
      alt: 'Catering and Events Lead Farah Qureshi reviewing an event plan',
      width: 800,
      height: 800,
    },
  },
]

/** Feature 51 — before / after pairs for the fit-out and plating upgrades. */
export type BeforeAfter = {
  id: string
  title: string
  year: string
  caption: string
  before: Media
  after: Media
}

export const beforeAfter: BeforeAfter[] = [
  {
    id: 'mezzanine',
    title: 'The mezzanine',
    year: '2025 → 2026',
    caption:
      'We closed the first floor for six weeks and rebuilt it around six arched alcoves. Cover count dropped from 48 to 36 up here, and the average table now stays 40 minutes longer.',
    before: {
      src: u('photo-1571624436279-b272aff752b5', 1200),
      alt: 'The mezzanine before renovation: open rows of plain tables under flat ceiling lights',
      width: 1200,
      height: 800,
    },
    after: {
      src: u('photo-1550966871-3ed3cdb5ed0c', 1200),
      alt: 'The mezzanine after renovation: carved arched alcoves with brass sconces and maroon upholstery',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'thali-plating',
    title: 'The Royal Special thali',
    year: '2024 → 2026',
    caption:
      'Same price, same portions, rebuilt plate. Moving from a steel compartment tray to a brass thali with separate katoris changed nothing about the cooking and everything about how the food photographs and arrives.',
    before: {
      src: u('photo-1546833999-b9f581a1996d', 1200),
      alt: 'The thali as it was served in 2024: a steel compartment tray with food in fixed sections',
      width: 1200,
      height: 800,
    },
    after: {
      src: u('photo-1631452180775-9e3d0d9b3ac3', 1200),
      alt: 'The thali as served today: a brass platter with individual katoris, garnished breads and dessert',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'facade',
    title: 'The Rama Park Road frontage',
    year: '2025 → 2026',
    caption:
      'The old frontage was a flat backlit board. The new one is a carved jharokha arch with warm uplighting, and walk-in footfall on weekday evenings went up noticeably after it went in.',
    before: {
      src: u('photo-1517248135467-4c7edcad34c4', 1200),
      alt: 'The old storefront: a flat backlit signboard above a plain glass frontage',
      width: 1200,
      height: 800,
    },
    after: {
      src: u('photo-1590846406792-0adc7f938f1d', 1200),
      alt: 'The new storefront: a carved jharokha arch in maroon and gold with warm uplighting',
      width: 1200,
      height: 800,
    },
  },
]
