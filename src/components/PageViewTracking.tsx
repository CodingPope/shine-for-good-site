'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/track'

export function PageViewTracking() {
  const pathname = usePathname()

  useEffect(() => {
    track('page-view')
  }, [pathname])

  return null
}
