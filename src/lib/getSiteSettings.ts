import { getPayload } from 'payload'
import config from '@payload-config'

const DEFAULTS = {
  phone: '305-304-9579',
  email: 'cmsawyer12@gmail.com',
  areas: [
    'St. Petersburg', 'Tampa', 'Clearwater', 'Gulfport', 'St. Pete Beach',
    'Treasure Island', 'Pinellas Park', 'Seminole', 'South Tampa', 'Kenneth City',
  ],
}

export async function getSiteSettings() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    return {
      phone: settings.contact?.phone || DEFAULTS.phone,
      email: settings.contact?.email || DEFAULTS.email,
      areas: settings.serviceAreas?.length ? settings.serviceAreas.map(a => a.city) : DEFAULTS.areas,
    }
  } catch {
    return DEFAULTS
  }
}
