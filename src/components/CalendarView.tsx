import { useEffect, useRef, useState } from 'react'
import { useStore } from '../hooks/useStore'
import { allProgramDates, getTodayStr, getWeekdayShort } from '../utils/dateUtils'
import { getWeekNumber, getPhase, WEEKLY_SCHEDULE } from '../data/programma'

interface Props {
  store: ReturnType<typeof useStore>
  onDayClick: (date: string) => void
}

// Phase colors for done cells
const PHASE_COLORS = {
  tecnica:      { full: 'bg-blue-500',   partial: 'bg-blue-700/50',   text: 'text-white',     label: 'text-blue-400' },
  progressione: { full: 'bg-orange-500', partial: 'bg-orange-700/50', text: 'text-white',     label: 'text-orange-400' },
  picco:        { full: 'bg-rose-500',   partial: 'bg-rose-700/50',   text: 'text-white',     label: 'text-rose-400' },
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
  const pct = totalPast > 0 ? Math.round((totalDone / totalPast) * 100) : 0

  const weeks: string[][] = [[], [], [], []]
  dates.forEach(d => {
    const w = getWeekNumber(d) - 1
    weeks[w].push(d)
  })

  const phaseRows = [
    { label: 'Scuola tecnica', weeks: [0, 1], color: 'text-blue-400',   dotColor: 'bg-blue-500' },
    { label: 'Progressione',   weeks: [2],    color: 'text-orange-400', dotColor: 'bg-orange-500' },
    { label: 'Picco',          weeks: [3],    color: 'text-rose-400',   dotColor: 'bg-rose-500' },
  ]

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Header */}
      <div className="pt-2 flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="mono font-bold text-2xl text-accent tracking-tight">30 Giorni</h2>
            <p className="text-xs text-[#555] mt-0.5">4 giu – 3 lug 2026</p>
          </div>
          <div className="text-right">
            <p className="mono font-bold text-3xl text-accent">{totalDone}<span className="text-[#444] text-lg">/{totalPast}</span></p>
            <p className="text-xs text-[#555]">giorni mossi</p>
          </div>
        </div>

        {/* Global progress bar */}
        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2a2a2a]">
          <div
            className="h-full bg-accent rounded-full bar-animated"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[#555] text-right mono">{pct}% costanza</p>
      </div>

      {/* Phase labels */}
      <div className="flex gap-4 flex-wrap">
        {phaseRows.map(pr => (
          <div key={pr.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${pr.dotColor}`} />
            <span className={`text-xs mono ${pr.color}`}>{pr.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-600" />
          <span className="text-xs mono text-green-400">Riposo attivo</span>
        </div>
      </div>

      {/* Heatmap weeks */}
      <div className="flex flex-col gap-3">
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
      <div className="card p-3 flex flex-wrap gap-x-4 gap-y-2">
        <p className="w-full text-[10px] text-[#444] mono uppercase tracking-widest mb-0.5">Legenda</p>
        <span className="flex items-center gap-1.5 text-xs text-[#666]"><span className="w-3.5 h-3.5 rounded bg-blue-500 inline-block" /> Tecnica completo</span>
        <span className="flex items-center gap-1.5 text-xs text-[#666]"><span className="w-3.5 h-3.5 rounded bg-orange-500 inline-block" /> Progressione</span>
        <span className="flex items-center gap-1.5 text-xs text-[#666]"><span className="w-3.5 h-3.5 rounded bg-rose-500 inline-block" /> Picco</span>
        <span className="flex items-center gap-1.5 text-xs text-[#666]"><span className="w-3.5 h-3.5 rounded bg-green-600 inline-block" /> Riposo attivo</span>
        <span className="flex items-center gap-1.5 text-xs text-[#666]"><span className="w-3.5 h-3.5 rounded bg-blue-800/40 inline-block" /> Parziale</span>
        <span className="flex items-center gap-1.5 text-xs text-[#666]"><span className="w-3.5 h-3.5 rounded bg-[#1a1a1a] border border-[#333] inline-block" /> Non fatto / futuro</span>
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
  const phase = week[0] ? getPhase(week[0]) : 'tecnica'
  const phaseColor = PHASE_COLORS[phase]
  const phaseLabels = ['S1 · Scuola tecnica', 'S2 · Scuola tecnica', 'S3 · Progressione', 'S4 · Picco']

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 px-0.5">
        <span className={`mono text-[10px] font-bold uppercase tracking-wide ${phaseColor.label}`}>
          {phaseLabels[weekNum - 1]}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {week.map(d => (
          <DayCell key={d} date={d} today={today} log={logs[d] ?? null} onClick={() => onDayClick(d)} />
        ))}
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
  const phase = getPhase(date)
  const phaseColor = PHASE_COLORS[phase]

  const [justDone, setJustDone] = useState(false)
  const prevLogRef = useRef(log)

  useEffect(() => {
    const wasDone = prevLogRef.current && (
      prevLogRef.current.sessionDone || prevLogRef.current.cardioDone || prevLogRef.current.escapedHatch
    )
    const isDone = log && (log.sessionDone || log.cardioDone || log.escapedHatch)
    if (isDone && !wasDone) {
      setJustDone(true)
      const t = setTimeout(() => setJustDone(false), 550)
      prevLogRef.current = log
      return () => clearTimeout(t)
    }
    prevLogRef.current = log
  }, [log])

  let bg = 'bg-[#111] border border-[#1e1e1e]'
  let textColor = 'text-[#555]'

  if (log?.escapedHatch) {
    bg = 'bg-green-700/60 border-green-600/50'
    textColor = 'text-green-200'
  } else if (log?.sessionDone && log?.cardioDone) {
    bg = `${phaseColor.full} border-transparent shadow-lg`
    textColor = phaseColor.text
  } else if (log?.sessionDone || log?.cardioDone) {
    bg = `${phaseColor.partial} border-transparent`
    textColor = 'text-[#ccc]'
  } else if (isPast && !isToday) {
    bg = 'bg-[#141414] border border-[#222]'
    textColor = 'text-[#444]'
  } else if (isToday) {
    bg = 'bg-[#1a1a1a] border border-[#444]'
    textColor = 'text-[#ccc]'
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 ${bg} ${
        isToday ? 'ring-2 ring-accent ring-offset-1 ring-offset-[#0a0a0a]' : ''
      } ${justDone ? 'animate-cell-light' : ''}`}
      style={{ minHeight: '56px' }}
    >
      <span className={`mono text-[9px] font-semibold leading-none ${textColor}`}>
        {getWeekdayShort(date)}
      </span>
      <span className={`mono text-sm font-bold leading-none ${textColor}`}>
        {new Date(date).getDate()}
      </span>
      {sessionId && (
        <span className={`text-[8px] leading-none font-mono ${textColor} opacity-70`}>
          {sessionId}
        </span>
      )}
    </button>
  )
}
