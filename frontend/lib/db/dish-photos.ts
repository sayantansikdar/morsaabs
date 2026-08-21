/**
 * Placeholder photography for the menu.
 *
 * ⚠️ These are stock images, not photographs of Morsaab's food. They exist so
 * the menu does not read as half-finished while real photography is being
 * shot, and every one of them should be replaced through the dashboard. A
 * photograph attached to a priced dish is a promise about what arrives at the
 * table, and stock cannot keep it.
 *
 * Two rules were applied when choosing them, and both matter:
 *
 *  1. Every image was opened and looked at, not chosen by id. Several
 *     otherwise-plausible candidates turned out to contain chicken, lamb or
 *     salmon — on the menu of a restaurant whose entire proposition is pure
 *     vegetarian, that is the worst possible error, and no amount of checking
 *     that a URL returns 200 would have caught it.
 *  2. No branded packaging (a Coca-Cola can, a pile of chocolate bars) and no
 *     cocktail glassware, which would misrepresent a family restaurant that
 *     serves no alcohol.
 *
 * Alt text describes the dish rather than the stock image, following the
 * convention in content/media.ts: it is written for the real photograph that
 * will replace this one.
 */

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

/** Verified, vegetarian, unbranded. */
const IMG = {
  paneerCurry: u('photo-1631452180519-c014fe946bc7'),
  chana: u('photo-1585937421612-70a008356fbe'),
  darkCurry: u('photo-1565557623262-b51c2513a641'),
  tikka: u('photo-1567188040759-fb8a883dc6d8'),
  mushroom: u('photo-1596797038530-2c107229654b'),
  samosa: u('photo-1601050690597-df0568f70950'),
  samosaBoard: u('photo-1553787499-6f9133860278'),
  papadDal: u('photo-1567337710282-00832b415979'),
  fries: u('photo-1541592106381-b31e9677c0e5'),
  almonds: u('photo-1596040033229-a9821ebd058d'),
  dosa: u('photo-1668236543090-82eba5ee5976'),
  idli: u('photo-1603133872878-684f208fb84b'),
  bananaLeaf: u('photo-1601050690117-94f5f6fa8bd7'),
  thali: u('photo-1626777552726-4a6b54c97e46'),
  noodles: u('photo-1585032226651-759b368d7246'),
  pizza: u('photo-1513104890138-7c749659a591'),
  pizza2: u('photo-1630383249896-424e482df921'),
  pasta: u('photo-1621996346565-e3dbc646d9a9'),
  creamyPasta: u('photo-1476124369491-e7addf5db371'),
  cappuccino: u('photo-1509042239860-f550ce710b93'),
  coffeeCup: u('photo-1572442388796-11668a67e53d'),
  icedCoffee: u('photo-1461023058943-07fcbe16d735'),
  latte: u('photo-1541167760496-1628856ab772'),
  milkshake: u('photo-1615832494873-b0c52d519696'),
  shakeJar: u('photo-1625398407796-82650a8c135f'),
  berryShake: u('photo-1544145945-f90425340c7e'),
  cooler: u('photo-1551024506-0bccd828d307'),
  juice: u('photo-1600271886742-f049cd451bba'),
  iceCream: u('photo-1560008581-09826d1de69e'),
  kulfi: u('photo-1590080875515-8a3a8dc5735e'),
  butterscotch: u('photo-1570197788417-0e82375c9371'),
  oreoSundae: u('photo-1563805042-7684c019e1cb'),
  brownieSundae: u('photo-1563729784474-d77dbb933a9e'),
  pastry: u('photo-1606313564200-e75d5e30476c'),
} as const

export type DishPhoto = { src: string; alt: string }

/** Keyed on the dish name exactly as it appears in menu_items. */
export const DISH_PHOTOS: Record<string, DishPhoto> = {
  /* -- Starters ------------------------------------------------------------ */
  'Roasted Peanuts': { src: IMG.almonds, alt: 'Roasted peanuts tossed with rock salt, lime and green chilli' },
  'Veg Seekh Kebab': { src: IMG.tikka, alt: 'Smoky minced-vegetable seekh kebabs finished over charcoal' },
  'Achari Soya Chaap': { src: IMG.tikka, alt: 'Soya chaap in a tangy five-seed pickle marinade' },
  'Dal Ke Kebab': { src: IMG.samosaBoard, alt: 'Chana dal patties with mint and roasted cumin' },
  'Achari Paneer Tikka': { src: IMG.tikka, alt: 'Cottage cheese cubes in mustard-oil pickle masala, off the tandoor' },
  'Hariyali Paneer Tikka': { src: IMG.tikka, alt: 'Paneer in a mint, coriander and spinach marinade, tandoor-blistered' },
  'Paneer Malai Tikka': { src: IMG.tikka, alt: 'Creamy malai paneer tikka with cardamom and white pepper' },

  /* -- Main Course --------------------------------------------------------- */
  'Dal Tadka': { src: IMG.papadDal, alt: 'Yellow dal tadka finished with a ghee and cumin tempering' },
  'Jeera Aloo': { src: IMG.chana, alt: 'Cumin-tossed potatoes, crisp at the edges' },
  'Aloo Gobi Adraki': { src: IMG.chana, alt: 'Potato and cauliflower cooked with fresh ginger' },
  'Punjabi Kadhi': { src: IMG.darkCurry, alt: 'Punjabi kadhi with gram-flour dumplings in a yoghurt gravy' },
  'Mix Veg': { src: IMG.chana, alt: 'Seasonal vegetables in a light onion-tomato masala' },
  'Pindi Chana': { src: IMG.chana, alt: 'Pindi chana, dark and dry-spiced, with pomegranate and cumin' },
  'Kadhai Paneer': { src: IMG.paneerCurry, alt: 'Kadhai paneer with peppers and crushed coriander seed' },
  'Shahi Paneer': { src: IMG.paneerCurry, alt: 'Shahi paneer in a cashew and cream gravy' },
  'Palak Paneer': { src: IMG.mushroom, alt: 'Paneer in a smooth spinach gravy' },
  'Paneer Tikka Masala': { src: IMG.paneerCurry, alt: 'Tandoor-charred paneer folded into a spiced tomato masala' },
  'Paneer Butter Masala': { src: IMG.paneerCurry, alt: 'Paneer butter masala in a copper karahi, with rice and papad' },

  /* -- South Indian -------------------------------------------------------- */
  'Vada': { src: IMG.idli, alt: 'Medu vada, crisp outside and soft within, with sambar and chutney' },
  'Plain Dosa': { src: IMG.dosa, alt: 'A plain dosa with sambar and coconut chutney' },
  'Plain Butter Dosa': { src: IMG.dosa, alt: 'Butter-roasted dosa, golden and crisp' },
  'Masala Dosa': { src: IMG.dosa, alt: 'Masala dosa filled with spiced potato, with sambar and chutneys' },
  'Utthappam Masala': { src: IMG.idli, alt: 'Masala uttapam thick with onion, tomato and chilli' },
  'Plain Idli (3 pcs)': { src: IMG.idli, alt: 'Steamed idli with sambar and coconut chutney' },
  'Masala Idli': { src: IMG.idli, alt: 'Idli tossed in a dry masala with curry leaves' },
  'Podi Idli': { src: IMG.bananaLeaf, alt: 'Idli rolled in gunpowder podi and sesame oil' },

  /* -- Indo-Chinese -------------------------------------------------------- */
  'Veg Spring Roll': { src: IMG.samosa, alt: 'Crisp vegetable spring rolls with a dipping sauce' },
  'Chili Potato': { src: IMG.fries, alt: 'Crisp chilli potato tossed in a sweet-hot sauce' },
  'Honey Chili Potato': { src: IMG.fries, alt: 'Honey chilli potato, glazed and sesame-flecked' },
  'Veg Crispy Corn': { src: IMG.fries, alt: 'Crispy fried corn kernels with pepper and curry leaf' },
  'Dry Manchurian': { src: IMG.noodles, alt: 'Dry vegetable manchurian in a dark garlic sauce' },
  'Salt and Pepper': { src: IMG.noodles, alt: 'Salt-and-pepper vegetables with spring onion' },
  'Chili Paneer': { src: IMG.tikka, alt: 'Chilli paneer with peppers and onion in a glossy sauce' },
  'Chili Mushroom': { src: IMG.mushroom, alt: 'Chilli mushroom tossed with peppers and spring onion' },
  'Paneer 65': { src: IMG.tikka, alt: 'Paneer 65, red-spiced and curry-leaf tempered' },

  /* -- Pizza --------------------------------------------------------------- */
  'Margherita': { src: IMG.pizza2, alt: 'Margherita pizza with tomato, mozzarella and basil' },
  'Fresh Farmhouse': { src: IMG.pizza, alt: 'Farmhouse pizza loaded with peppers, onion, corn and mushroom' },
  'Mexican': { src: IMG.pizza2, alt: 'Mexican pizza with jalapeño, peppers and red onion' },
  'Sizzling Chilli Paneer': { src: IMG.pizza, alt: 'Chilli paneer pizza with peppers and spring onion' },
  'Paneer Tikka Pizza': { src: IMG.pizza, alt: 'Paneer tikka pizza with tandoori-spiced cottage cheese' },
  'Spinach & Sun-Dried Tomato': { src: IMG.pizza2, alt: 'Spinach and sun-dried tomato pizza on a thin crust' },
  "Chef's Special Mushroom": { src: IMG.pizza, alt: 'Chef’s special mushroom pizza with herbs and mozzarella' },

  /* -- Pasta --------------------------------------------------------------- */
  'Arrabiata': { src: IMG.pasta, alt: 'Penne arrabiata in a chilli-hot tomato sauce' },
  'Alfredo': { src: IMG.creamyPasta, alt: 'Alfredo pasta in a cream and parmesan sauce' },
  'Mix Sauce': { src: IMG.pasta, alt: 'Pasta in a blend of tomato and cream sauces' },
  'Pesto Sauce': { src: IMG.creamyPasta, alt: 'Pasta in a basil pesto with pine nuts' },
  'Aglio e Olio': { src: IMG.creamyPasta, alt: 'Aglio e olio with garlic, olive oil and chilli flakes' },
  'Mac and Cheese': { src: IMG.creamyPasta, alt: 'Macaroni baked in a cheese sauce' },

  /* -- Beverages ----------------------------------------------------------- */
  'Espresso': { src: IMG.coffeeCup, alt: 'A short black espresso in a white cup' },
  'Cappuccino': { src: IMG.cappuccino, alt: 'Cappuccino with latte art on a saucer' },
  'Cafe Latte': { src: IMG.latte, alt: 'Café latte with milk poured into a rosetta' },
  'Mocha Frappe': { src: IMG.icedCoffee, alt: 'Iced mocha frappe in a tall glass' },
  'Classic Sweet Lassi': { src: IMG.milkshake, alt: 'Sweet lassi, thick and chilled, in a tall glass' },
  'Mango Saffron Lassi': { src: IMG.shakeJar, alt: 'Mango and saffron lassi topped with cream' },
  'Chilli Guava Cooler': { src: IMG.cooler, alt: 'Chilli guava cooler over ice with lime and mint' },
  'Mix Berry Smoothie': { src: IMG.berryShake, alt: 'Mixed berry smoothie, deep purple and thick' },

  /* -- Desserts ------------------------------------------------------------ */
  'Assorted Ice Cream': { src: IMG.iceCream, alt: 'Scoops of assorted ice cream with sprinkles' },
  'Rasmalai (2 pcs)': { src: IMG.kulfi, alt: 'Rasmalai in saffron milk, dusted with pistachio' },
  'Gulab Jamun': { src: IMG.kulfi, alt: 'Warm gulab jamun soaked in rose syrup' },
  'Assorted Pastry': { src: IMG.pastry, alt: 'Assorted cream pastries from the counter' },
  'Butterscotch Sundae': { src: IMG.butterscotch, alt: 'Butterscotch sundae with praline and caramel' },
  'Oreo Overload Sundae': { src: IMG.oreoSundae, alt: 'Oreo overload sundae layered with cream and crumb' },
  'Nutty Nutella Sundae': { src: IMG.brownieSundae, alt: 'Nutella sundae with brownie, nuts and hot fudge' },

  /* -- Royal Thali --------------------------------------------------------- */
  'Deluxe Thali': { src: IMG.thali, alt: 'The deluxe thali — dal, two vegetables, rice, breads and a sweet' },
  "Morsaab's Royal Special": { src: IMG.bananaLeaf, alt: 'Morsaab’s Royal Special thali laid out on a banana leaf' },
}
