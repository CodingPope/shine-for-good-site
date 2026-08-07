'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.rv:not(.is-in)'))
    if (!items.length) return

    if (!('IntersectionObserver' in window)) {
      items.forEach(e => e.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    items.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [pathname])

  return null
}
