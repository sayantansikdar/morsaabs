/**
 * Guest reviews mirrored from the Google Business Profile.
 * Refresh these against the live listing when the rating summary changes —
 * the AggregateRating in the JSON-LD must match what Google itself shows.
 */

export type Review = {
  id: string
  author: string
  initials: string
  rating: 1 | 2 | 3 | 4 | 5
  date: string
  source: 'Google' | 'Zomato' | 'In-store'
  dish?: string
  text: string
}

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Aarti Malhotra',
    initials: 'AM',
    rating: 5,
    date: '2026-07-28',
    source: 'Google',
    dish: 'Paneer Butter Masala',
    text: 'Took my parents here for their anniversary and the mezzanine alcove made it feel like a proper occasion. The paneer butter masala is the closest I have had in Delhi to my grandmother’s. Staff noticed it was an anniversary and sent out a rasmalai without being asked.',
  },
  {
    id: 'r2',
    author: 'Rohit Verma',
    initials: 'RV',
    rating: 5,
    date: '2026-07-12',
    source: 'Google',
    dish: 'Chilli Paneer',
    text: 'I order the chilli paneer and chilli potato at least twice a month. It arrives hot, which sounds like a low bar until you order from anywhere else around Dwarka Mor. 38 minutes door to door on a Saturday night.',
  },
  {
    id: 'r3',
    author: 'Sneha Kapoor',
    initials: 'SK',
    rating: 5,
    date: '2026-06-30',
    source: 'Zomato',
    dish: "Morsaab's Royal Special Thali",
    text: 'The royal thali at ₹349 is genuinely unbeatable value. Two of us shared one and still could not finish. Also the only place nearby where I did not have to explain three times that Jain food means no onion.',
  },
  {
    id: 'r4',
    author: 'Imran Sheikh',
    initials: 'IS',
    rating: 4,
    date: '2026-06-18',
    source: 'Google',
    dish: 'Masala Dosa',
    text: 'Dosa is crisp and the sambhar has actual body to it. Marked one star off only because the wait on Sunday lunch was 25 minutes even with a booking. Food was worth it though.',
  },
  {
    id: 'r5',
    author: 'Priya Nair',
    initials: 'PN',
    rating: 5,
    date: '2026-05-22',
    source: 'In-store',
    dish: 'Catering — 220 guests',
    text: 'They catered my brother’s wedding reception for 220 people. Live dosa counter was the hit of the evening and the team cleared everything without us having to chase anyone. Invoiced exactly what was quoted.',
  },
  {
    id: 'r6',
    author: 'Deepak Chauhan',
    initials: 'DC',
    rating: 5,
    date: '2026-05-04',
    source: 'Google',
    dish: 'Chilli Guava Cooler',
    text: 'Came for the food, stayed for the chilli guava cooler. I have tried to reverse-engineer it at home four times and failed. Whoever put green chilli in a guava drink deserves a raise.',
  },
]

export const ratingBreakdown = [
  { stars: 5, count: 54 },
  { stars: 4, count: 12 },
  { stars: 3, count: 3 },
  { stars: 2, count: 1 },
  { stars: 1, count: 1 },
]
