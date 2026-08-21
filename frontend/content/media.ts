/**
 * Central image registry.
 *
 * Every image on the site is declared here with its alt text (feature 16), so
 * alt copy is reviewed in one place rather than scattered through JSX.
 *
 * ⚠️ PLACEHOLDER PHOTOGRAPHY — these are stock images, not Morsaab's own.
 * Replace each with real photography before launch; the alt text is already
 * written for the real subject.
 *
 * There are deliberately no photographs of people here. Stock faces presented
 * as named staff, with written biographies, is a claim about real individuals
 * that none of them agreed to; the team section that did that was removed.
 */

export type Media = { src: string; alt: string; width: number; height: number }

const BLOB_BASE = 'https://euzy3uln8hrj0lj1.public.blob.vercel-storage.com/site'

/**
 * Images are served from the restaurant's own Blob store, not hotlinked.
 *
 * They were hotlinked from Unsplash until one of them — the "after" shot in the
 * thali before/after — started returning 404 and had been showing as a broken
 * image on the live site. Stock URLs are not a stable dependency; several
 * others 404'd within minutes of being verified.
 *
 * The name is the filename: `site/<name>.jpg`, uploaded with allowOverwrite, so
 * replacing any one of these with a real photograph is a single upload and no
 * code change.
 */
const u = (name: string) => `${BLOB_BASE}/${name}.jpg`

export const media = {
  heroAmbience: {
    src: u('heroAmbience'),
    alt: 'The Morsaab’s dining room at dinner service, warm lamps over occupied tables beneath carved arches',
    width: 1920,
    height: 1280,
  },
  interiorArches: {
    src: u('interiorArches'),
    alt: 'Arched alcove seating on the Morsaab’s mezzanine, laid for a table of four',
    width: 1600,
    height: 1067,
  },
  kitchenPass: {
    src: u('kitchenPass'),
    alt: 'Chefs plating at the Morsaab’s kitchen pass under service lights',
    width: 1600,
    height: 1067,
  },
  tandoor: {
    src: u('tandoor'),
    alt: 'Paneer tikka skewers being lifted from the charcoal tandoor',
    width: 1600,
    height: 1067,
  },
  thali: {
    src: u('thali'),
    alt: 'The Morsaab’s Royal Special thali with paneer, dal makhani, mix veg, naan, rice and dessert',
    width: 1600,
    height: 1067,
  },
  paneerButterMasala: {
    src: u('paneerButterMasala'),
    alt: 'Paneer butter masala in a copper handi, finished with cream and crushed kasuri methi',
    width: 1600,
    height: 1067,
  },
  chilliPaneer: {
    src: u('chilliPaneer'),
    alt: 'Indo-Chinese chilli paneer tossed with capsicum and onion in a dark chilli glaze',
    width: 1600,
    height: 1067,
  },
  dosa: {
    src: u('dosa'),
    alt: 'A crisp masala dosa served with sambhar and three chutneys',
    width: 1600,
    height: 1067,
  },
  dessert: {
    src: u('dessert'),
    alt: 'Warm gulab jamun in rose syrup, plated with crushed pistachio',
    width: 1600,
    height: 1067,
  },
  cateringCounter: {
    src: u('cateringCounter'),
    alt: 'A live catering counter set up at an outdoor event, chafing dishes lit and staffed',
    width: 1600,
    height: 1067,
  },
  banquetHall: {
    src: u('banquetHall'),
    alt: 'The first-floor banquet hall laid for a seated dinner of 120 guests',
    width: 1600,
    height: 1067,
  },
  delivery: {
    src: u('delivery'),
    alt: 'A Morsaab’s rider loading an insulated hot-bag for a home delivery',
    width: 1600,
    height: 1067,
  },
  storefront: {
    src: u('storefront'),
    alt: 'The Morsaab’s storefront on Rama Park Road, lit at dusk',
    width: 1600,
    height: 1067,
  },
} satisfies Record<string, Media>

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
      src: u('mezzanine-before'),
      alt: 'The mezzanine before renovation: open rows of plain tables under flat ceiling lights',
      width: 1200,
      height: 800,
    },
    after: {
      src: u('mezzanine-after'),
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
      src: u('thali-plating-before'),
      alt: 'The thali as it was served in 2024: a steel compartment tray with food in fixed sections',
      width: 1200,
      height: 800,
    },
    after: {
      src: u('thali-plating-after'),
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
      src: u('facade-before'),
      alt: 'The old storefront: a flat backlit signboard above a plain glass frontage',
      width: 1200,
      height: 800,
    },
    after: {
      src: u('facade-after'),
      alt: 'The new storefront: a carved jharokha arch in maroon and gold with warm uplighting',
      width: 1200,
      height: 800,
    },
  },
]
