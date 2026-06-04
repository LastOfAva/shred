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
    <div className="flex flex-col min-h-dvh bg-[#0a0a0a] text-[#e8e8e8] max-w-lg mx-auto relative">
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
