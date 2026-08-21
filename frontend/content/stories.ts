/**
 * How the catering side approaches three genuinely different jobs.
 *
 * These are **capability briefs, not case studies**. They describe how an event
 * of each shape is planned and staffed — which is the useful thing for someone
 * deciding whether to ask for a quote — and they deliberately claim no past
 * event, no client and no result.
 *
 * They used to be case studies, and they were invented ones: a named couple's
 * wedding, a named residents' association in the restaurant's own
 * neighbourhood, three testimonials attributed to identifiable people, and
 * figures like "+0% food cost variance" and "6% food wastage" presented as
 * measured outcomes. A caterer is asked to prove numbers like those, and none
 * of it had happened.
 *
 * When there are real events to write up: get the client's written permission
 * before naming them, quote only what they actually said, and publish only
 * figures somebody recorded on the day.
 */

export type Story = {
  slug: string
  title: string
  /** The shape of the job, not a customer. */
  scale: string
  eventType: 'Wedding' | 'Corporate' | 'Society' | 'Private'
  summary: string
  challenge: string
  approach: string[]
  /** What the approach is designed to achieve — a plan, not a result. */
  outcome: string
  /** Capacities and choices, never outcomes nobody measured. */
  metrics: { label: string; value: string }[]
}

export const stories: Story[] = [
  {
    slug: 'najafgarh-road-wedding-800',
    title: 'A large wedding without the buffet queue',
    scale: 'Weddings up to 800 guests',
    eventType: 'Wedding',
    summary:
      'A farmhouse reception at full scale, six live counters, and a dinner service planned to finish inside ninety minutes rather than run to midnight.',
    challenge:
      'Most quotes for an 800-guest reception open dinner at 9 PM and run it until midnight, because one long buffet cannot move that many people any faster. Families who want the dancing to start are told the queue is unavoidable. It is not — it is a layout problem.',
    approach: [
      'Split the buffet into island counters placed around the lawn, so no guest walks more than about twenty metres or stands behind more than a handful of people.',
      'Put the two slowest items — live dosa and tandoor — on their own counters at opposite ends, which is where queues otherwise form.',
      'Pre-plate the chaat course, so the opening minutes of service need no assembly at all.',
      'Staff the dinner hour more heavily than the rest of the evening, then drop back for dessert.',
    ],
    outcome:
      'The plan is built backwards from the time the family wants dinner to end, and the counter count follows from that rather than from a price list.',
    metrics: [
      { label: 'Guests', value: 'Up to 800' },
      { label: 'Live counters', value: '6' },
      { label: 'Target service window', value: '90 min' },
      { label: 'Menu', value: 'Pure veg' },
    ],
  },
  {
    slug: 'quarterly-offsite-jain-menu',
    title: 'A corporate offsite where the Jain menu is not an afterthought',
    scale: 'Offsites and conferences, 50–200 staff',
    eventType: 'Corporate',
    summary:
      'A full-day offsite where a large minority of the room eats Jain or no-onion-no-garlic, planned so that group is not handed apology food while everyone else eats properly.',
    challenge:
      'The usual arrangement is one menu with substitutions, which in practice means plain dal and rice for anyone with a restriction. People notice being catered to as an exception, and they remember it.',
    approach: [
      'Build two complete menus of equal length rather than one with substitutions — same number of starters, same number of mains, same desserts.',
      'Cook the Jain menu in a separate section with its own pans, boards and staff, and label every chafing dish on both sides.',
      'Run the counters side by side with identical signage, so nobody has to ask which line is theirs.',
    ],
    outcome:
      'Parity is the design goal rather than accommodation: both menus are written to be worth choosing on their own terms.',
    metrics: [
      { label: 'Attendees', value: '50–200' },
      { label: 'Menus built', value: '2 full' },
      { label: 'Jain / satvik', value: 'Separate section' },
      { label: 'Labelling', value: 'Both sides' },
    ],
  },
  {
    slug: 'society-diwali-mela',
    title: 'Feeding a housing-society mela in shifts',
    scale: 'Society events, 200–500 residents',
    eventType: 'Society',
    summary:
      'A neighbourhood mela where residents drift through across several hours rather than sitting down together — a service pattern that defeats most catering plans.',
    challenge:
      'Nobody eats at the same time at a mela. Cook everything upfront and the last hundred people get cold food; cook strictly to order and the queue never clears.',
    approach: [
      'Move the menu towards items that hold well or cook fast: chaat, tikkas off a live tandoor, and dosa.',
      'Cook in short batches against a live headcount at the gate rather than a fixed plan.',
      'Keep one sweet counter deliberately over-stocked, since that is where the drift concentrates at the end.',
    ],
    outcome:
      'Batch cooking against an actual headcount is what keeps the last hour as good as the first, and keeps what is thrown away down.',
    metrics: [
      { label: 'Residents', value: '200–500' },
      { label: 'Service window', value: 'Up to 4 hrs' },
      { label: 'Cooking', value: 'Live, in batches' },
      { label: 'Menu', value: 'Hold-and-serve' },
    ],
  },
]

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug)
}
