import { useStore } from '../hooks/useStore'
import { allProgramDates, getTodayStr, getWeekdayShort } from '../utils/dateUtils'
import { getWeekNumber, WEEKLY_SCHEDULE } from '../data/programma'

interface Props {
  store: ReturnType<typeof useStore>
  onDayClick: (date: string) => void
}

export default function CalendarView({ store, onDayClick }: Props) {
  const today = getTodayStr()
  const dates = allProgramDates()
  const { state } = store

  const totalDone = dates.filter(d => {
    const log = state.days[d]
    return log && (log.sessionDone || log.cardioDone || log.escapedHatch)
  }).length

  const totalPast = dates.filter(d => d <= today).length

  // Group by week
  const weeks: string[][] = [[], [], [], []]
  dates.forEach(d => {
    const w = getWeekNumber(d) - 1
    weeks[w].push(d)
  })

  return (
    <div className="p-4 flex flex-col gap-5">
      <div className="flex items-center justify-between pt-2">
        <h2 className="mono font-bold text-xl text-accent">Calendario</h2>
        <span className="mono text-sm text-[#555]">
          <span className="text-accent font-bold">{totalDone}</span>/{totalPast} mossi
        </span>
      </div>

      {/* Heatmap */}
      <div className="flex flex-col gap-4">
        {weeks.map((week, wi) => (
          <WeekRow
            key={wi}
            week={week}
            weekNum={wi + 1}
            today={today}
            logs={state.days}
            onDayClick={onDayClick}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#555]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent inline-block" /> Completo</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent/40 inline-block" /> Parziale</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-800 inline-block" /> Riposo attivo</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#222] border border-[#333] inline-block" /> Saltato</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#1a1a1a] border border-[#2a2a2a] inline-block" /> Futuro</span>
      </div>
    </div>
  )
}

function WeekRow({ week, weekNum, today, logs, onDayClick }: {
  week: string[]
  weekNum: number
  today: string
  logs: ReturnType<typeof useStore>['state']['days']
  onDayClick: (d: string) => void
}) {
  const phaseLabels = ['Scuola tecnica', 'Scuola tecnica', 'Progressione', 'Picco']
  const phaseLabel = phaseLabels[weekNum - 1]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="mono text-xs text-[#555] uppercase tracking-wide">S{weekNum}</span>
        <span className="text-[10px] text-[#444]">{phaseLabel}</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {week.map(d => <DayCell key={d} date={d} today={today} log={logs[d] ?? null} onClick={() => onDayClick(d)} />)}
        {/* Pad if week is shorter (S4 has extra days) */}
        {Array.from({ length: Math.max(0, 7 - week.length) }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
      </div>
    </div>
  )
}

function DayCell({ date, today, log, onClick }: {
  date: string
  today: string
  log: ReturnType<typeof useStore>['state']['days'][string] | null
  onClick: () => void
}) {
  const isPast = date <= today
  const isToday = date === today
  const dow = new Date(date).getDay()
  const sessionId = WEEKLY_SCHEDULE[dow]

  let bg = 'bg-[#1a1a1a] border border-[#2a2a2a]'
  if (!isPast) bg = 'bg-[#111] border border-[#1e1e1e]'
  if (log?.escapedHatch) bg = 'bg-green-900/50 border border-green-800/50'
  else if (log?.sessionDone && log?.cardioDone) bg = 'bg-accent border-accent'
  else if (log?.sessionDone || log?.cardioDone) bg = 'bg-accent/40 border-accent/30'
  else if (isPast && !isToday) bg = 'bg-[#1a1a1a] border border-[#2a2a2a]'

  const textColor = (log?.sessionDone && log?.cardioDone) ? 'text-black' : 'text-[#ccc]'

  return (
    <button
      onClick={onClick}
      className={`rounded-lg aspect-square flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95 ${bg} ${isToday ? 'ring-1 ring-accent ring-offset-1 ring-offset-[#0a0a0a]' : ''}`}
    >
      <span className={`mono text-[10px] font-bold leading-none ${textColor}`}>
        {getWeekdayShort(date)}
      </span>
      <span className={`mono text-xs font-bold leading-none ${textColor}`}>
        {new Date(date).getDate()}
      </span>
      {sessionId && (
        <span className={`text-[8px] leading-none font-mono ${textColor} opacity-60`}>
          {sessionId}
        </span>
      )}
    </button>
  )
}
