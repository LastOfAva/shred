import { useEffect, useRef, useState } from 'react'
import { useStore, getNewBadges } from '../hooks/useStore'
import { Badge } from '../data/programma'

interface Props {
  store: ReturnType<typeof useStore>
}

export default function BadgeToast({ store }: Props) {
  const [toast, setToast] = useState<Badge | null>(null)
  const [visible, setVisible] = useState(false)
  const prevBadges = useRef<string[]>(store.state.earnedBadges)

  useEffect(() => {
    const newOnes = getNewBadges(prevBadges.current, store.state.earnedBadges)
    if (newOnes.length > 0) {
      setToast(newOnes[0])
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 3200)
      const t2 = setTimeout(() => setToast(null), 3600)
      prevBadges.current = store.state.earnedBadges
      return () => { clearTimeout(t); clearTimeout(t2) }
    }
    prevBadges.current = store.state.earnedBadges
  }, [store.state.earnedBadges])

  if (!toast) return null

  return (
    <div
      className={`fixed top-4 left-0 right-0 max-w-sm mx-auto px-4 z-50 transition-all duration-300 ${
        visible ? 'animate-bounce-in opacity-100' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-[#1a1a1a] border border-accent/40 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl shadow-black/50">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl flex-shrink-0">
          {toast.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-accent font-mono uppercase tracking-widest">Badge sbloccato</p>
          <p className="text-sm font-bold text-[#eee] leading-tight">{toast.name}</p>
          <p className="text-xs text-[#666] truncate mt-0.5">{toast.desc}</p>
        </div>
        <div className="text-accent text-xl flex-shrink-0">✦</div>
      </div>
    </div>
  )
}
