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

    // Reveal anything already in the viewport immediately on load, rather
    // than waiting on IntersectionObserver's async initial callback — that
    // callback can lag behind hydration enough that above-the-fold content
    // sits invisible until the user scrolls, making the page look empty.
    const vh = window.innerHeight
    const toObserve: HTMLElement[] = []
    for (const el of items) {
      const r = el.getBoundingClientRect()
      if (r.top < vh && r.bottom > 0) {
        el.classList.add('is-in')
      } else {
        toObserve.push(el)
      }
    }
    if (!toObserve.length) return

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    toObserve.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [pathname])

  return null
}
