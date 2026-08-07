const ICONS = {
  residential: [
    'M3 11l9-8 9 8',
    'M5.5 9.5V20h13V9.5',
    'M10 20v-5.5h4V20',
  ],
  deep: [
    'M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6z',
    'M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
    'M5.5 15l.6 1.6 1.6.6-1.6.6L5.5 20l-.6-1.6L3.3 17.8l1.6-.6z',
  ],
  organize: [
    'M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z',
    'M2.5 5.5h19V8h-19z',
    'M10 12h4',
  ],
  move: [
    'M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17',
    'M15 8h4a1 1 0 0 1 1 1v12',
    'M2 21h20',
  ],
  biz: [
    'M3 21V8l9-5 9 5v13',
    'M3 21h18',
  ],
  post: [
    'M2 3h20v4H2z',
    'M4 7v14',
    'M20 7v14',
    'M4 21h16',
    'M8 11h8',
    'M8 15h5',
  ],
  airbnb: [
    'M7 2h10l1 5H6z',
    'M6 7v15h12V7',
    'M11 22v-3a1 1 0 0 1 2 0v3',
  ],
} as const

export type ServiceIconName = keyof typeof ICONS

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  return (
    <svg className="svc-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name].map((d, i) => <path key={i} d={d} />)}
      {name === 'move' && <circle cx="11.5" cy="12.5" r=".9" fill="currentColor" stroke="none" />}
      {name === 'biz' && <>
        <rect x="7" y="12" width="4" height="4" />
        <rect x="13" y="12" width="4" height="4" />
      </>}
    </svg>
  )
}
