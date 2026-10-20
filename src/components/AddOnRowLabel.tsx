'use client'
import { useRowLabel } from '@payloadcms/ui'

// Shows "Inside the fridge — $45" on each collapsed add-on row in the Pricing admin,
// so prices can be scanned without opening every row.
export function AddOnRowLabel() {
  const { data, rowNumber } = useRowLabel<{ name?: string; price?: number; perHour?: boolean }>()
  if (!data?.name) return <span>Add-on {(rowNumber ?? 0) + 1}</span>
  const price = data.price != null ? ` — $${data.price}${data.perHour ? '/hour' : ''}` : ''
  return <span>{data.name}{price}</span>
}
