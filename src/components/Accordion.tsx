'use client'
import { useState } from 'react'

export interface AccordionItem {
  id?: string
  question: string
  answer: React.ReactNode
}

export function FaqAccordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null)
  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = openId === i
        return (
          <div key={i} className={`faq-i${isOpen ? ' is-open' : ''}`} id={item.id}>
            <button
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : i)}
            >
              <span>{item.question}</span>
              <span className="svc-plus" aria-hidden="true" />
            </button>
            <div
              className="faq-a"
              style={isOpen ? { height: 'auto' } : { height: 0, overflow: 'hidden' }}
            >
              {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}
