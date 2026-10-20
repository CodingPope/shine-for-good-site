import { ValidationError, type Field, type GlobalConfig } from 'payload'
import { DEFAULT_PRICING, SERVICE_NAMES, SERVICE_ORDER, type PricedService } from '../lib/pricing'

const serviceGroup = (svc: PricedService, description: string): Field => ({
  type: 'group',
  name: svc,
  label: SERVICE_NAMES[svc],
  admin: { description },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'perSqFt',
          type: 'number',
          label: 'Price per square foot ($)',
          required: true,
          min: 0,
          defaultValue: DEFAULT_PRICING.services[svc].perSqFt,
          admin: { step: 0.01, width: '50%', description: 'Example: 0.27 means 27 cents a square foot, so a 2,000 sq ft home starts at $540.' },
        },
        {
          name: 'minimum',
          type: 'number',
          label: 'Minimum price ($)',
          required: true,
          min: 0,
          defaultValue: DEFAULT_PRICING.services[svc].minimum,
          admin: { step: 5, width: '50%', description: 'The lowest this clean ever quotes, before bedrooms, bathrooms and add-ons. Also shown as "From $___" on the site.' },
        },
      ],
    },
  ],
})

const percent = (name: string, label: string, defaultValue: number): Field => ({
  name, label, type: 'number', required: true, min: 0, max: 100, defaultValue,
  admin: { step: 1, width: '33%' },
})

export const Pricing: GlobalConfig = {
  slug: 'pricing',
  label: 'Pricing',
  admin: {
    group: 'Site',
    description: 'Every price the quote calculator uses, and the "From $___" prices shown on the service pages. Click Save and the website updates within about a minute.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    // Services have to stay in cost order — a move-out quoting under a deep clean
    // is the bug this exists to prevent.
    beforeValidate: [
      ({ data }) => {
        const services = data?.services as Record<PricedService, { perSqFt?: number; minimum?: number }> | undefined
        if (!services) return data
        const errors: { path: string; message: string }[] = []
        for (const key of ['perSqFt', 'minimum'] as const) {
          for (let i = 1; i < SERVICE_ORDER.length; i++) {
            const lower = SERVICE_ORDER[i - 1]
            const higher = SERVICE_ORDER[i]
            const a = services[lower]?.[key]
            const b = services[higher]?.[key]
            if (a != null && b != null && b < a) {
              errors.push({
                path: `services.${higher}.${key}`,
                message: `${SERVICE_NAMES[higher]} can't be lower than ${SERVICE_NAMES[lower]} ($${a}). Services go cheapest to most expensive in the order shown on this page.`,
              })
            }
          }
        }
        if (errors.length) throw new ValidationError({ errors, global: 'pricing' })
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cleaning prices',
          description: 'How the calculator prices a clean: square footage × the price per square foot, never less than the minimum. Then bedrooms, bathrooms and add-ons are added on top. Services must go cheapest to most expensive, top to bottom.',
          fields: [
            {
              type: 'group',
              name: 'services',
              label: false,
              fields: [
                serviceGroup('standard', 'Regular house cleaning. Also the price for recurring visits before the frequency discount.'),
                serviceGroup('biz', 'Offices, salons, studios and shops.'),
                serviceGroup('deep', 'First-time and top-to-bottom cleans.'),
                serviceGroup('move', 'Empty-house cleans. The add-ons marked "included with move-in / move-out" are already in this price.'),
                serviceGroup('post', 'After a build or renovation.'),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bedroom', type: 'number', label: 'Each bedroom ($)', required: true, min: 0,
                  defaultValue: DEFAULT_PRICING.bedroom,
                  admin: { step: 5, width: '33%', description: 'Added for every bedroom. A 4 bedroom home adds 4 × this.' },
                },
                {
                  name: 'bathroom', type: 'number', label: 'Each bathroom after the first ($)', required: true, min: 0,
                  defaultValue: DEFAULT_PRICING.bathroom,
                  admin: { step: 5, width: '33%', description: 'A 3 bathroom home adds 2 × this.' },
                },
                {
                  name: 'orgHourly', type: 'number', label: 'Home organization, per hour ($)', required: true, min: 0,
                  defaultValue: DEFAULT_PRICING.orgHourly,
                  admin: { step: 5, width: '33%', description: 'Organization is quoted by the hour, not by square foot.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Add-ons',
          description: 'The extras customers can tick in the calculator. You can change names and prices, add new ones, remove ones you no longer offer, and drag to reorder.',
          fields: [
            {
              name: 'addOns',
              type: 'array',
              label: 'Add-ons',
              labels: { singular: 'Add-on', plural: 'Add-ons' },
              admin: { initCollapsed: true, components: { RowLabel: '@/components/AddOnRowLabel#AddOnRowLabel' } },
              defaultValue: DEFAULT_PRICING.addOns,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '50%', description: 'What the customer sees, e.g. "Inside the fridge".' } },
                    { name: 'price', type: 'number', label: 'Price ($)', required: true, min: 0, admin: { step: 5, width: '25%' } },
                    { name: 'perHour', type: 'checkbox', label: 'Priced per hour', defaultValue: false, admin: { width: '25%', description: 'Shows as "+$50/hour" instead of "+$50".' } },
                  ],
                },
                {
                  name: 'includedWith',
                  type: 'select',
                  hasMany: true,
                  label: 'Already included free with',
                  options: SERVICE_ORDER.map(svc => ({ label: SERVICE_NAMES[svc], value: svc })),
                  admin: { description: 'For these cleans the add-on shows as "Included" and is not charged. Leave empty if it is always extra. If you change this, the "What\'s included" list on that service page may need updating too — ask Jokwon.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Discounts & range',
          fields: [
            {
              type: 'group',
              name: 'discounts',
              label: 'Recurring discounts (%)',
              admin: { description: 'Taken off residential, deep and business cleans booked on a schedule. Enter 15 for 15% off.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    percent('weekly', 'Weekly', DEFAULT_PRICING.discounts.weekly),
                    percent('biweekly', 'Every 2 weeks', DEFAULT_PRICING.discounts.biweekly),
                    percent('monthly', 'Monthly', DEFAULT_PRICING.discounts.monthly),
                  ],
                },
              ],
            },
            {
              name: 'rangeSpread', type: 'number', label: 'Quote range spread (%)', required: true, min: 0, max: 100,
              defaultValue: DEFAULT_PRICING.rangeSpread,
              admin: { step: 1, description: 'The calculator shows a range, like "$500 to $550". The low end is the price for a home in good condition; the high end is this many percent more, for extra scrubbing. Enter 0 to show a single price.' },
            },
          ],
        },
      ],
    },
  ],
}
