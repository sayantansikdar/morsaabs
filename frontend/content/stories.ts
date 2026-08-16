/**
 * Case studies for the catering and banquet side of the business.
 *
 * PLACEHOLDER CONTENT — these are representative of the events Morsaab's runs,
 * written to show the section's shape. Replace each entry with a real event
 * (and get the client's written permission to name them) before launch.
 */

export type Story = {
  slug: string
  title: string
  client: string
  eventType: 'Wedding' | 'Corporate' | 'Society' | 'Private'
  guests: number
  date: string
  summary: string
  challenge: string
  approach: string[]
  outcome: string
  metrics: { label: string; value: string }[]
  quote: { text: string; attribution: string }
}

export const stories: Story[] = [
  {
    slug: 'najafgarh-road-wedding-800',
    title: '800 guests, one kitchen, zero queues',
    client: 'The Sethi–Bajaj wedding',
    eventType: 'Wedding',
    guests: 800,
    date: '2026-02-14',
    summary:
      'A February farmhouse wedding on Najafgarh Road with an 800-guest reception, six live counters and a hard 90-minute dinner window.',
    challenge:
      'The couple had been quoted by two caterers who both wanted to open dinner service at 9 PM and run it until midnight. The family wanted everyone fed inside 90 minutes so the dancing could start, without the buffet queues that make that impossible.',
    approach: [
      'Split one long buffet into six island counters placed around the lawn, so no guest walked more than 20 metres or queued behind more than eight people.',
      'Put the two slowest items — live dosa and tandoor — on their own counters at opposite ends, which is where queues normally form.',
      'Pre-plated the chaat course entirely, so the first fifteen minutes of service needed no assembly at all.',
      'Staffed at 1:20 rather than our usual 1:25 for the dinner hour only, then dropped back for dessert.',
    ],
    outcome:
      'Dinner opened at 8:40 PM and the last hot counter closed at 10:05 PM. The longest queue anyone measured was eleven people at the dosa counter, for about four minutes.',
    metrics: [
      { label: 'Guests served', value: '800' },
      { label: 'Service window', value: '85 min' },
      { label: 'Live counters', value: '6' },
      { label: 'Food cost variance', value: '+0%' },
    ],
    quote: {
      text: 'We were braced for the buffet to be a disaster and it simply was not. My father still talks about the dosa counter.',
      attribution: 'Ritu Sethi, mother of the bride',
    },
  },
  {
    slug: 'quarterly-offsite-jain-menu',
    title: 'A corporate offsite where the Jain menu was not an afterthought',
    client: 'A Gurugram fintech, 140 staff',
    eventType: 'Corporate',
    guests: 140,
    date: '2026-04-09',
    summary:
      'A full-day offsite where 38 of 140 attendees needed Jain or no-onion-no-garlic food, and the previous year’s caterer had served them all the same plate of plain dal and rice.',
    challenge:
      'The HR team told us plainly that a third of the room had spent the previous offsite eating apology food while everyone else ate properly. They wanted parity, not accommodation.',
    approach: [
      'Built two complete menus of equal length rather than one menu with substitutions — same number of starters, same number of mains, same desserts.',
      'Cooked the Jain menu in a separate section with its own pans, boards and staff, and labelled every chafing dish on both sides.',
      'Ran the counters side by side with identical signage, so nobody had to ask which line was theirs.',
    ],
    outcome:
      'The feedback form came back with the Jain paneer lababdar as the single highest-rated dish of the day, across both menus.',
    metrics: [
      { label: 'Attendees', value: '140' },
      { label: 'Jain / satvik covers', value: '38' },
      { label: 'Menus built', value: '2 full' },
      { label: 'Satisfaction', value: '4.8 / 5' },
    ],
    quote: {
      text: 'Nobody at my table had to negotiate with a serving spoon. That is a low bar and you are the first caterer to clear it.',
      attribution: 'Head of People Operations',
    },
  },
  {
    slug: 'society-diwali-mela',
    title: 'Feeding a housing society’s Diwali mela in four-hour shifts',
    client: 'Mohan Garden RWA',
    eventType: 'Society',
    guests: 450,
    date: '2025-10-20',
    summary:
      'A neighbourhood Diwali mela with 450 residents drifting through across four hours rather than sitting down together — a service pattern that ruins most catering plans.',
    challenge:
      'Nobody eats at the same time at a mela. Cook everything upfront and the last hundred people get cold food; cook to order and the queue never clears.',
    approach: [
      'Moved the whole menu to items that hold or cook fast: chaat, tikkas off a live tandoor, and dosa.',
      'Cooked in 45-minute batches against a live headcount at the gate rather than a fixed plan.',
      'Kept one sweet counter deliberately over-stocked, since that is where the drift concentrates at the end.',
    ],
    outcome:
      'Served 450 residents across four hours with 6% food wastage — roughly a third of what the RWA had budgeted for.',
    metrics: [
      { label: 'Residents served', value: '450' },
      { label: 'Service window', value: '4 hrs' },
      { label: 'Food wastage', value: '6%' },
      { label: 'Repeat booking', value: 'Yes' },
    ],
    quote: {
      text: 'Third year running. The committee stopped taking other quotes after the first one.',
      attribution: 'RWA General Secretary',
    },
  },
]

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug)
}
