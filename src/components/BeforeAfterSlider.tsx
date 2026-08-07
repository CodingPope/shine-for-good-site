'use client'
import { useRef, useState, useEffect, useCallback } from 'react'

interface Props {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
}

export function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt = 'Before', afterAlt = 'After' }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const setFromX = useCallback((clientX: number) => {
    const box = boxRef.current
    if (!box) return
    const r = box.getBoundingClientRect()
    const v = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100))
    setPos(v)
    if (rangeRef.current) rangeRef.current.value = String(v)
  }, [])

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true
      box.setPointerCapture(e.pointerId)
      setFromX(e.clientX)
    }
    const onPointerMove = (e: PointerEvent) => { if (dragging.current) setFromX(e.clientX) }
    const onPointerUp = (e: PointerEvent) => {
      dragging.current = false
      if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId)
    }
    box.addEventListener('pointerdown', onPointerDown)
    box.addEventListener('pointermove', onPointerMove)
    box.addEventListener('pointerup', onPointerUp)
    box.addEventListener('pointercancel', onPointerUp)
    return () => {
      box.removeEventListener('pointerdown', onPointerDown)
      box.removeEventListener('pointermove', onPointerMove)
      box.removeEventListener('pointerup', onPointerUp)
      box.removeEventListener('pointercancel', onPointerUp)
    }
  }, [setFromX])

  return (
    <div
      ref={boxRef}
      className="ba"
      style={{ '--sp': `${pos}%` } as React.CSSProperties}
    >
      <div className="ba-img ba-before" style={{ backgroundImage: `url(${beforeSrc})` }} />
      <div className="ba-img ba-after" style={{ backgroundImage: `url(${afterSrc})` }} />
      <span className="ba-tag ba-tag--b">Before</span>
      <span className="ba-tag ba-tag--a">After</span>
      <div className="ba-handle"><div className="ba-knob"><i /><i /></div></div>
      <input
        ref={rangeRef}
        className="ba-range"
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        aria-label="Compare before and after"
        onChange={e => setPos(Number(e.target.value))}
      />
    </div>
  )
}
