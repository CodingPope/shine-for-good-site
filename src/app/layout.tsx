// This project uses separate root layouts per route group — (frontend) and
// (payload) each declare their own <html>/<body>. This file exists only so
// the top-level not-found.tsx (for genuinely unmatched routes) has a root
// layout to attach to; it renders nothing of its own.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
