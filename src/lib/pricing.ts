// Prices for the quote estimator and every "From $X" on the site. Chelsea edits these
// in the admin (Site → Pricing); the values here are the fallback when the database is
// unreachable or a field has never been saved. Kept free of server imports so the
// client-side estimator can use the same types and defaults.

export type PricedService = 'standard' | 'biz' | 'deep' | 'move' | 'post'

// Cheapest to most expensive. A move-out does deep-clean work and then opens every
// cabinet and appliance, so it has to sit above a deep clean, and post-construction
// above that. The Pricing global refuses a save that breaks this order.
export const SERVICE_ORDER: readonly PricedService[] = ['standard', 'biz', 'deep', 'move', 'post']

export const SERVICE_NAMES: Record<PricedService, string> = {
  standard: 'Residential (standard) clean',
  biz: 'Small business clean',
  deep: 'Deep clean',
  move: 'Move-in / move-out clean',
  post: 'Post-construction clean',
}

export interface AddOn {
  name: string
  price: number
  perHour: boolean
  // Services that already cover this add-on, so it is shown as "Included" and never
  // billed twice. Should match the "what is included" list on that service's page.
  includedWith: PricedService[]
}

export interface Pricing {
  // Price per square foot and minimum price for each kind of clean. The minimum is
  // also the "From $X" shown on that service's page and cards.
  services: Record<PricedService, { perSqFt: number; minimum: number }>
  bedroom: number
  // Charged for each bathroom after the first.
  bathroom: number
  orgHourly: number
  discounts: { weekly: number; biweekly: number; monthly: number }
  // How far above the base estimate the top of the quoted range sits, in percent.
  rangeSpread: number
  addOns: AddOn[]
}

// Per-square-foot rates are the old base rate (11¢) times each service's old
// multiplier, rounded to the cent.
export const DEFAULT_PRICING: Pricing = {
  services: {
    standard: { perSqFt: 0.11, minimum: 125 },
    biz: { perSqFt: 0.12, minimum: 130 },
    deep: { perSqFt: 0.18, minimum: 205 },
    move: { perSqFt: 0.27, minimum: 335 },
    post: { perSqFt: 0.3, minimum: 385 },
  },
  bedroom: 30,
  bathroom: 50,
  orgHourly: 60,
  discounts: { weekly: 20, biweekly: 15, monthly: 10 },
  rangeSpread: 10,
  // Baseboards by hand is never included with anything — Chelsea asks the customer
  // directly rather than bundling it, even on a move-out.
  addOns: [
    { name: 'Inside the fridge', price: 45, perHour: false, includedWith: ['move'] },
    { name: 'Inside the oven', price: 45, perHour: false, includedWith: ['move'] },
    { name: 'Interior windows', price: 45, perHour: false, includedWith: ['move', 'post'] },
    { name: 'Baseboards by hand', price: 50, perHour: true, includedWith: [] },
    { name: 'Inside cabinets', price: 40, perHour: false, includedWith: ['move'] },
    { name: 'Wash and fold', price: 25, perHour: false, includedWith: [] },
    { name: 'Heavy pet hair', price: 25, perHour: false, includedWith: [] },
    { name: 'Garage or lanai', price: 50, perHour: false, includedWith: ['move'] },
  ],
}

export function money(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function fromPrice(p: Pricing, svc: PricedService) {
  return `From ${money(p.services[svc].minimum)}`
}

export function hourlyPrice(p: Pricing) {
  return `${money(p.orgHourly)} / hour`
}

// Price of a named add-on for use in page copy, falling back to the default if Chelsea
// has renamed or removed it.
export function addOnPrice(p: Pricing, name: string) {
  const a = p.addOns.find(x => x.name === name) ?? DEFAULT_PRICING.addOns.find(x => x.name === name)
  return money(a?.price ?? 0)
}

// The estimator's base for a priced service: square footage at that service's rate,
// raised to its minimum.
export function serviceBase(p: Pricing, svc: PricedService, sqft: number) {
  const s = p.services[svc]
  return Math.max(s.minimum, sqft * s.perSqFt)
}
