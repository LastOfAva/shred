import { Tab } from '../App'

interface Props {
  tab: Tab
  setTab: (t: Tab) => void
  inProgram: boolean
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today',    label: 'Oggi',      icon: '◉' },
  { id: 'calendar', label: 'Calendario', icon: '▦' },
  { id: 'stats',    label: 'Stats',     icon: '∿' },
  { id: 'settings', label: 'Config',    icon: '⚙' },
]

export default function NavBar({ tab, setTab }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0f0f0f] border-t border-[#2a2a2a] flex safe-bottom"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
            tab === t.id ? 'text-accent' : 'text-[#555]'
          }`}
        >
          <span className="text-lg leading-none font-mono">{t.icon}</span>
          <span className="text-[10px] uppercase tracking-widest">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
