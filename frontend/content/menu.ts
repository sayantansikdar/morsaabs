/**
 * The full carte. Kept in code rather than the database — the menu changes a
 * few times a year and every render needs all of it, so a round trip buys
 * nothing and costs us static rendering.
 *
 * `spice` and `chefSpecial` drive the tooltips on each dish (feature 42).
 */

export type SpiceLevel = 0 | 1 | 2 | 3

export type MenuItem = {
  name: string
  price: number
  description: string
  /** 0 = not spiced, 1 = mild, 2 = medium, 3 = fiery */
  spice: SpiceLevel
  chefSpecial?: boolean
  bestseller?: boolean
  jain?: boolean
  vegan?: boolean
  contains?: string[]
  /**
   * Photography, when there is any. Set from the database rather than here —
   * staff attach photos through the dashboard, and this file is only the
   * fallback for a build with no database. See lib/menu-source.ts.
   */
  imageUrl?: string | null
  imageAlt?: string | null
}

export type MenuCategory = {
  slug: string
  name: string
  blurb: string
  items: MenuItem[]
}

export const SPICE_LABEL: Record<SpiceLevel, string> = {
  0: 'Not spiced',
  1: 'Mild — gentle warmth',
  2: 'Medium — a proper kick',
  3: 'Fiery — ask for less if unsure',
}

export const menu: MenuCategory[] = [
  {
    slug: 'starters',
    name: 'Starters',
    blurb: 'Tandoor-charred and pan-crisped plates to open the meal.',
    items: [
      { name: 'Roasted Peanuts', price: 99, description: 'Crisp peanuts tossed with rock salt, lime and green chilli', spice: 1, vegan: true, contains: ['Peanuts'] },
      { name: 'Veg Seekh Kebab', price: 199, description: 'Smoky minced-vegetable skewers finished over charcoal', spice: 2 },
      { name: 'Achari Soya Chaap', price: 219, description: 'Soya chaap in a tangy five-seed pickle marinade', spice: 2, contains: ['Soy', 'Gluten'] },
      { name: 'Dal Ke Kebab', price: 299, description: 'Chana dal patties with mint and roasted cumin', spice: 1, jain: true },
      { name: 'Achari Paneer Tikka', price: 310, description: 'Cottage cheese in mustard-oil pickle masala', spice: 2, contains: ['Dairy'] },
      { name: 'Hariyali Paneer Tikka', price: 310, description: 'Mint, coriander and spinach marinade, tandoor-blistered', spice: 1, contains: ['Dairy'] },
      { name: 'Paneer Malai Tikka', price: 349, description: 'Cream, cardamom and white pepper — the mildest of the tikkas', spice: 0, chefSpecial: true, bestseller: true, contains: ['Dairy', 'Nuts'] },
    ],
  },
  {
    slug: 'main-course',
    name: 'Main Course',
    blurb: 'Slow-simmered North Indian gravies from the royal kitchens.',
    items: [
      { name: 'Dal Tadka', price: 199, description: 'Yellow lentils tempered with ghee, cumin and dried chilli', spice: 1, contains: ['Dairy'] },
      { name: 'Jeera Aloo', price: 199, description: 'Potatoes tossed with toasted cumin and amchur', spice: 1, jain: true, vegan: true },
      { name: 'Aloo Gobi Adraki', price: 219, description: 'Potato and cauliflower with julienned ginger', spice: 1, vegan: true },
      { name: 'Punjabi Kadhi', price: 229, description: 'Yogurt and gram-flour curry with soft pakoras', spice: 1, contains: ['Dairy', 'Gluten'] },
      { name: 'Mix Veg', price: 219, description: 'Seasonal vegetables in a light onion-tomato masala', spice: 1, vegan: true },
      { name: 'Pindi Chana', price: 229, description: 'Rawalpindi-style chickpeas, dark with tea and pomegranate seed', spice: 2, vegan: true },
      { name: 'Kadhai Paneer', price: 349, description: 'Wok-tossed paneer with crushed coriander and bell pepper', spice: 2, contains: ['Dairy'] },
      { name: 'Shahi Paneer', price: 349, description: 'Cashew and cream gravy scented with green cardamom', spice: 0, chefSpecial: true, contains: ['Dairy', 'Nuts'] },
      { name: 'Palak Paneer', price: 349, description: 'Stone-ground spinach, garlic and fresh paneer', spice: 1, bestseller: true, contains: ['Dairy'] },
      { name: 'Paneer Tikka Masala', price: 349, description: 'Tandoori paneer folded into a smoked tomato gravy', spice: 2, contains: ['Dairy'] },
      { name: 'Paneer Butter Masala', price: 349, description: 'The house classic — butter, tomato and a whisper of honey', spice: 1, bestseller: true, chefSpecial: true, contains: ['Dairy', 'Nuts'] },
    ],
  },
  {
    slug: 'south-indian',
    name: 'South Indian',
    blurb: 'Fermented overnight, griddled to order, served with three chutneys.',
    items: [
      { name: 'Vada', price: 109, description: 'Urad dal doughnuts, crisp outside and airy within', spice: 1, vegan: true },
      { name: 'Plain Dosa', price: 119, description: 'Paper-thin rice and lentil crepe', spice: 0, vegan: true },
      { name: 'Plain Butter Dosa', price: 139, description: 'The plain dosa, lacquered with white butter', spice: 0, contains: ['Dairy'] },
      { name: 'Masala Dosa', price: 139, description: 'Filled with turmeric potato and curry leaf', spice: 1, bestseller: true },
      { name: 'Utthappam Masala', price: 139, description: 'Thick pancake studded with onion, tomato and chilli', spice: 2, vegan: true },
      { name: 'Plain Idli (3 pcs)', price: 139, description: 'Steamed rice cakes with sambhar and coconut chutney', spice: 0, vegan: true },
      { name: 'Masala Idli', price: 209, description: 'Idli wok-tossed in a tangy onion masala', spice: 2 },
      { name: 'Podi Idli', price: 249, description: 'Idli rolled in gunpowder podi and sesame oil', spice: 3, chefSpecial: true, vegan: true, contains: ['Sesame'] },
    ],
  },
  {
    slug: 'chinese',
    name: 'Indo-Chinese',
    blurb: 'High-flame wok cooking, Delhi-style — sharp, glossy, unapologetic.',
    items: [
      { name: 'Veg Spring Roll', price: 199, description: 'Shredded cabbage and carrot in a crackling wrapper', spice: 1, contains: ['Gluten', 'Soy'] },
      { name: 'Chili Potato', price: 199, description: 'Twice-fried potato batons in a chilli-garlic glaze', spice: 3, bestseller: true, contains: ['Gluten', 'Soy'] },
      { name: 'Honey Chili Potato', price: 199, description: 'The same crunch, balanced with wild honey', spice: 2, contains: ['Gluten', 'Soy'] },
      { name: 'Veg Crispy Corn', price: 199, description: 'Sweetcorn tossed with curry leaf and pepper', spice: 2 },
      { name: 'Dry Manchurian', price: 249, description: 'Hand-rolled vegetable dumplings, wok-seared', spice: 2, contains: ['Gluten', 'Soy'] },
      { name: 'Salt and Pepper', price: 209, description: 'Vegetables in a crisp batter with cracked peppercorn', spice: 2, contains: ['Gluten'] },
      { name: 'Chili Paneer', price: 249, description: 'Paneer, capsicum and onion in a dark chilli sauce', spice: 3, bestseller: true, contains: ['Dairy', 'Soy'] },
      { name: 'Chili Mushroom', price: 299, description: 'Button mushrooms seared hard, then glazed', spice: 3, contains: ['Soy'] },
      { name: 'Paneer 65', price: 299, description: 'Curry leaf, yogurt and Kashmiri chilli — Chennai by way of Delhi', spice: 3, chefSpecial: true, contains: ['Dairy'] },
    ],
  },
  {
    slug: 'pizza',
    name: 'Pizza',
    blurb: '48-hour cold-proved dough, stone-baked to order.',
    items: [
      { name: 'Margherita', price: 299, description: 'San Marzano tomato, mozzarella, torn basil', spice: 0, contains: ['Dairy', 'Gluten'] },
      { name: 'Fresh Farmhouse', price: 299, description: 'Capsicum, onion, corn, olive and mushroom', spice: 1, contains: ['Dairy', 'Gluten'] },
      { name: 'Mexican', price: 319, description: 'Jalapeño, red paprika and a smoked chilli base', spice: 3, contains: ['Dairy', 'Gluten'] },
      { name: 'Sizzling Chilli Paneer', price: 349, description: 'Indo-Chinese chilli paneer on a pizza — it works', spice: 3, bestseller: true, contains: ['Dairy', 'Gluten', 'Soy'] },
      { name: 'Paneer Tikka Pizza', price: 349, description: 'Tandoori paneer, red onion and mint drizzle', spice: 2, contains: ['Dairy', 'Gluten'] },
      { name: 'Spinach & Sun-Dried Tomato', price: 399, description: 'Wilted spinach, sun-dried tomato, kalamata olive', spice: 0, contains: ['Dairy', 'Gluten'] },
      { name: "Chef's Special Mushroom", price: 399, description: 'Three mushrooms with a truffle-oil finish', spice: 0, chefSpecial: true, contains: ['Dairy', 'Gluten'] },
    ],
  },
  {
    slug: 'pasta',
    name: 'Pasta',
    blurb: 'Cooked to order, finished in the pan with its sauce.',
    items: [
      { name: 'Arrabiata', price: 199, description: 'Tomato, garlic and a generous hand of chilli flakes', spice: 2, vegan: true, contains: ['Gluten'] },
      { name: 'Alfredo', price: 219, description: 'Butter, cream and aged parmesan', spice: 0, contains: ['Dairy', 'Gluten'] },
      { name: 'Mix Sauce', price: 219, description: 'Arrabiata and alfredo, married into a pink sauce', spice: 1, contains: ['Dairy', 'Gluten'] },
      { name: 'Pesto Sauce', price: 249, description: 'Basil, pine nut and parmesan, blended cold', spice: 0, contains: ['Dairy', 'Gluten', 'Nuts'] },
      { name: 'Aglio e Olio', price: 249, description: 'Slow-toasted garlic, olive oil, parsley, chilli', spice: 2, vegan: true, contains: ['Gluten'] },
      { name: 'Mac and Cheese', price: 249, description: 'Four cheeses, baked with a herbed crumb', spice: 0, bestseller: true, contains: ['Dairy', 'Gluten'] },
    ],
  },
  {
    slug: 'beverages',
    name: 'Beverages',
    blurb: 'Coffees pulled to order, lassis churned in-house.',
    items: [
      { name: 'Espresso', price: 99, description: 'Single-origin Chikmagalur, double shot', spice: 0, vegan: true },
      { name: 'Cappuccino', price: 179, description: 'Espresso under a thick cap of steamed milk', spice: 0, contains: ['Dairy'] },
      { name: 'Cafe Latte', price: 169, description: 'Longer milk, gentler roast', spice: 0, contains: ['Dairy'] },
      { name: 'Mocha Frappe', price: 169, description: 'Cold-blended coffee, cocoa and ice', spice: 0, contains: ['Dairy'] },
      { name: 'Classic Sweet Lassi', price: 99, description: 'Hand-churned curd, sugar, a dusting of cardamom', spice: 0, contains: ['Dairy'] },
      { name: 'Mango Saffron Lassi', price: 119, description: 'Alphonso pulp with Kashmiri saffron', spice: 0, contains: ['Dairy'] },
      { name: 'Chilli Guava Cooler', price: 229, description: "Morsaab's signature — guava, lime, black salt, green chilli", spice: 2, chefSpecial: true, vegan: true },
      { name: 'Mix Berry Smoothie', price: 199, description: 'Strawberry, blueberry and curd, blended thick', spice: 0, contains: ['Dairy'] },
    ],
  },
  {
    slug: 'desserts',
    name: 'Desserts',
    blurb: 'Mithai and sundaes to close the durbar.',
    items: [
      { name: 'Assorted Ice Cream', price: 79, description: 'Two scoops, your choice of flavour', spice: 0, contains: ['Dairy'] },
      { name: 'Rasmalai (2 pcs)', price: 79, description: 'Chenna discs in saffron-thickened milk', spice: 0, contains: ['Dairy', 'Nuts'] },
      { name: 'Gulab Jamun', price: 99, description: 'Khoya dumplings soaked warm in rose syrup', spice: 0, bestseller: true, contains: ['Dairy', 'Gluten'] },
      { name: 'Assorted Pastry', price: 159, description: "From the day's bakery selection", spice: 0, contains: ['Dairy', 'Gluten'] },
      { name: 'Butterscotch Sundae', price: 179, description: 'Praline shards, caramel, whipped cream', spice: 0, contains: ['Dairy', 'Nuts'] },
      { name: 'Oreo Overload Sundae', price: 179, description: 'Cookie crumble through vanilla soft-serve', spice: 0, contains: ['Dairy', 'Gluten'] },
      { name: 'Nutty Nutella Sundae', price: 179, description: 'Hazelnut chocolate, toasted nuts, sea salt', spice: 0, chefSpecial: true, contains: ['Dairy', 'Nuts', 'Gluten'] },
    ],
  },
  {
    slug: 'thali',
    name: 'Royal Thali',
    blurb: 'The full court on one platter — our most ordered plate at lunch.',
    items: [
      { name: 'Deluxe Thali', price: 299, description: 'Two paratha, paneer, dal makhani, pulao, dal, salad, raita', spice: 1, contains: ['Dairy', 'Gluten'] },
      { name: "Morsaab's Royal Special", price: 349, description: 'Paneer, dal makhani, mix veg, naan, rice, sweet, salad, raita', spice: 1, bestseller: true, chefSpecial: true, contains: ['Dairy', 'Gluten', 'Nuts'] },
    ],
  },
]

export const allMenuItems: (MenuItem & { category: string; categorySlug: string })[] =
  menu.flatMap((c) => c.items.map((i) => ({ ...i, category: c.name, categorySlug: c.slug })))

export function getCategory(slug: string): MenuCategory | undefined {
  return menu.find((c) => c.slug === slug)
}
