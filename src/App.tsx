import { useState } from 'react'
import { useStore } from './hooks/useStore'
import TodayView from './components/TodayView'
import CalendarView from './components/CalendarView'
import StatsView from './components/StatsView'
import SettingsView from './components/SettingsView'
import NavBar from './components/NavBar'
import BadgeToast from './components/BadgeToast'
import { getTodayStr, isInProgram } from './utils/dateUtils'

export type Tab = 'today' | 'calendar' | 'stats' | 'settings'

export default function App() {
  const [tab, setTab] = useState<Tab>('today')
  const [viewingDate, setViewingDate] = useState<string>(getTodayStr())
  const store = useStore()

  const inProgram = isInProgram(getTodayStr())

  function handleCalendarDayClick(date: string) {
    setViewingDate(date)
    setTab('today')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#0a0a0a] text-[#e8e8e8] max-w-lg mx-auto relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 max-w-lg mx-auto" aria-hidden>
        <div
          className="bg-blob animate-blob-a"
          style={{
            width: '45%', height: '45%',
            top: '5%', left: '5%',
            background: '#d946ef',
            opacity: 0.08,
            animation: 'blobA 22s ease-in-out infinite',
          }}
        />
        <div
          className="bg-blob"
          style={{
            width: '50%', height: '50%',
            bottom: '10%', right: '5%',
            background: '#0ea5e9',
            opacity: 0.08,
            animation: 'blobB 28s ease-in-out infinite',
          }}
        />
        <div
          className="bg-blob"
          style={{
            width: '30%', height: '30%',
            top: '40%', left: '35%',
            background: '#e8ff3c',
            opacity: 0.04,
            animation: 'blobC 18s ease-in-out infinite',
          }}
        />
      </div>

      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'today' && (
          <TodayView
            date={viewingDate}
            store={store}
            onGoToToday={() => setViewingDate(getTodayStr())}
          />
        )}
        {tab === 'calendar' && (
          <CalendarView
            store={store}
            onDayClick={handleCalendarDayClick}
          />
        )}
        {tab === 'stats' && <StatsView store={store} />}
        {tab === 'settings' && <SettingsView store={store} />}
      </main>

      <NavBar tab={tab} setTab={(t) => { setTab(t); if (t === 'today') setViewingDate(getTodayStr()) }} inProgram={inProgram} />
      <BadgeToast store={store} />
    </div>
  )
}
