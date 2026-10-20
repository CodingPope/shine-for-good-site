import { getPayload } from 'payload'
import config from '@payload-config'
import { DEFAULT_PRICING, SERVICE_ORDER, type AddOn, type Pricing } from './pricing'

const num = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)

export async function getPricing(): Promise<Pricing> {
  try {
    const payload = await getPayload({ config })
    const g = await payload.findGlobal({ slug: 'pricing' })
    const d = DEFAULT_PRICING
    const services = Object.fromEntries(SERVICE_ORDER.map(svc => [svc, {
      perSqFt: num(g.services?.[svc]?.perSqFt, d.services[svc].perSqFt),
      minimum: num(g.services?.[svc]?.minimum, d.services[svc].minimum),
    }])) as Pricing['services']
    // An add-on list that has never been saved comes back empty; an empty list that
    // was saved on purpose is indistinguishable, so both fall back to the defaults.
    const addOns: AddOn[] = g.addOns?.length
      ? g.addOns.map(a => ({
          name: a.name,
          price: num(a.price, 0),
          perHour: Boolean(a.perHour),
          includedWith: (a.includedWith ?? []) as AddOn['includedWith'],
        }))
      : d.addOns
    return {
      services,
      bedroom: num(g.bedroom, d.bedroom),
      bathroom: num(g.bathroom, d.bathroom),
      orgHourly: num(g.orgHourly, d.orgHourly),
      discounts: {
        weekly: num(g.discounts?.weekly, d.discounts.weekly),
        biweekly: num(g.discounts?.biweekly, d.discounts.biweekly),
        monthly: num(g.discounts?.monthly, d.discounts.monthly),
      },
      rangeSpread: num(g.rangeSpread, d.rangeSpread),
      addOns,
    }
  } catch {
    return DEFAULT_PRICING
  }
}
