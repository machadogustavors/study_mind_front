import { AnimatePresence } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'

export function AnimatedOutlet() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={location.pathname}>{element}</div>
    </AnimatePresence>
  )
}
