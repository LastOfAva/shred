import { useEffect, useRef, useState } from 'react'
import { useStore, getNewBadges } from '../hooks/useStore'
import { Badge } from '../data/programma'

interface Props {
  store: ReturnType<typeof useStore>
}

export default function BadgeToast({ store }: Props) {
  const [toast, setToast] = useState<Badge | null>(null)
  const prevBadges = useRef<string[]>(store.state.earnedBadges)

  useEffect(() => {
    const newOnes = getNewBadges(prevBadges.current, store.state.earnedBadges)
    if (newOnes.length > 0) {
      setToast(newOnes[0])
      setTimeout(() => setToast(null), 3500)
    }
    prevBadges.current = store.state.earnedBadges
  }, [store.state.earnedBadges])

  if (!toast) return null

  return (
    <div className="fixed top-4 left-0 right-0 max-w-sm mx-auto px-4 z-50 animate-bounce-in">
      <div className="card bg-[#1a1a1a] border-accent/30 p-3 flex items-center gap-3 shadow-2xl">
        <span className="text-2xl">{toast.icon}</span>
        <div>
          <p className="text-xs text-accent font-mono uppercase tracking-wide">Badge sbloccato</p>
          <p className="text-sm font-semibold">{toast.name}</p>
          <p className="text-xs text-[#555]">{toast.desc}</p>
        </div>
      </div>
    </div>
  )
}
