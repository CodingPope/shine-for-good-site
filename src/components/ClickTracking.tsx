'use client'
import { useEffect } from 'react'
import { track } from '@/lib/track'

// Catches clicks on any tel: link sitewide so call/text CTAs don't need
// to be individually wired up — new ones just work automatically.
export function ClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest('a[href^="tel:"]')
      if (link) track('call-click')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
