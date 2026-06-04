import { useStore, DayLog } from '../hooks/useStore'
import {
  getTodayStr, isInProgram, getProgramDay, formatDate,
  getSessionForDate, getCardioForDate, getDayOfWeek
} from '../utils/dateUtils'
import {
  getPhase, getWeekNumber, PHASES, MOBILITY_EXERCISES,
  WorkoutSession, REST_DAY
} from '../data/programma'
import ExerciseCard from './ExerciseCard'
import CardioCard from './CardioCard'
import EscapeHatch from './EscapeHatch'
import ProgressBar from './ProgressBar'

interface Props {
  date: string
  store: ReturnType<typeof useStore>
  onGoToToday: () => void
}

export default function TodayView({ date, store, onGoToToday }: Props) {
  const today = getTodayStr()
  const isToday = date === today
  const inProgram = isInProgram(date)
  const log = store.state.days[date] ?? null
  const isRest = getDayOfWeek(date) === 0 // Domenica

  const session = getSessionForDate(date)
  const cardio = getCardioForDate(date)
  const phase = getPhase(date)
  const phaseInfo = PHASES[phase]
  const weekNum = getWeekNumber(date) as 1 | 2 | 3 | 4
  const dayNum = getProgramDay(date)

  // Overall completion %
  const checks = [log?.sessionDone, log?.cardioDone].filter(Boolean).length
  const totalChecks = isRest ? 1 : 2
  const completionPct = log?.escapedHatch ? 100 : Math.round((checks / totalChecks) * 100)

  if (!inProgram) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <Header date={date} isToday={isToday} onGoToToday={onGoToToday} />
        <div className="card p-6 text-center text-[#555]">
          <p className="mono text-2xl mb-2">—</p>
          <p>Fuori dal programma<br />(4 giu – 3 lug 2026)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Header date={date} isToday={isToday} onGoToToday={onGoToToday} />

      {/* Phase + day badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#555] uppercase tracking-widest mono">Giorno</span>
          <span className="mono text-accent font-bold text-lg">{dayNum}<span className="text-[#555] text-sm">/30</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wide ${
            phase === 'tecnica' ? 'bg-blue-950 text-blue-400' :
            phase === 'progressione' ? 'bg-orange-950 text-orange-400' :
            'bg-red-950 text-red-400'
          }`}>{phaseInfo.label}</span>
          <span className="text-xs text-[#555] mono">S{weekNum}</span>
        </div>
      </div>

      {/* Progress */}
      {!isRest && !log?.escapedHatch && (
        <ProgressBar value={completionPct} label={`${checks}/${totalChecks} completati`} />
      )}
      {(log?.escapedHatch) && (
        <div className="card px-4 py-2 flex items-center gap-2 border-[#2a2a2a]">
          <span className="text-green-400">✓</span>
          <span className="text-sm text-[#888]">Riposo attivo registrato. Streak attivo.</span>
        </div>
      )}

      {/* Riposo domenica */}
      {isRest ? (
        <RestDayCard
          log={log}
          isToday={isToday}
          onDone={() => store.updateDay(date, { sessionDone: true })}
        />
      ) : (
        <>
          {/* Cardio e-bike */}
          <CardioCard
            cardio={cardio}
            weekNum={weekNum}
            done={log?.cardioDone ?? false}
            disabled={!isToday && date > today}
            onToggle={() => store.updateDay(date, { cardioDone: !log?.cardioDone })}
          />

          {/* Mobility */}
          <MobilityCard
            completedExercises={log?.completedExercises ?? []}
            disabled={!isToday && date > today}
            onToggle={(id) => store.toggleExercise(date, id)}
          />

          {/* Session */}
          {session && (
            <SessionCard
              session={session}
              phase={phase}
              weekNum={weekNum}
              log={log}
              date={date}
              isToday={isToday}
              today={today}
              store={store}
            />
          )}

          {/* Session done toggle */}
          {session && (
            <div className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Sessione serale</p>
                <p className="text-xs text-[#555]">{session.name} completata</p>
              </div>
              <button
                onClick={() => store.updateDay(date, { sessionDone: !log?.sessionDone })}
                disabled={!isToday && date > today}
                className={`w-10 h-6 rounded-full transition-colors ${
                  log?.sessionDone ? 'bg-accent' : 'bg-[#2a2a2a]'
                } disabled:opacity-40`}
              >
                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${
                  log?.sessionDone ? 'translate-x-4' : ''
                }`} />
              </button>
            </div>
          )}

          {/* Escape hatch */}
          {isToday && !log?.escapedHatch && !log?.sessionDone && (
            <EscapeHatch onActivate={() => store.useEscapeHatch(date)} />
          )}
        </>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────

function Header({ date, isToday, onGoToToday }: { date: string; isToday: boolean; onGoToToday: () => void }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <h1 className="mono font-bold text-xl text-accent tracking-tight">SHRED</h1>
        <p className="text-xs text-[#555] capitalize">{formatDate(date)}</p>
      </div>
      {!isToday && (
        <button onClick={onGoToToday} className="btn-ghost text-xs px-3 py-1.5">
          → Oggi
        </button>
      )}
    </div>
  )
}

function MobilityCard({ completedExercises, disabled, onToggle }: {
  completedExercises: string[]
  disabled: boolean
  onToggle: (id: string) => void
}) {
  const ids = MOBILITY_EXERCISES.map((_, i) => `mob_${i}`)
  const done = ids.every(id => completedExercises.includes(id))
  const count = ids.filter(id => completedExercises.includes(id)).length

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">Mobility 5 min <span className="text-[#555]">(riscaldamento)</span></p>
        <span className={`mono text-xs ${done ? 'text-accent' : 'text-[#555]'}`}>{count}/{MOBILITY_EXERCISES.length}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {MOBILITY_EXERCISES.map((ex, i) => {
          const id = `mob_${i}`
          const checked = completedExercises.includes(id)
          return (
            <button
              key={id}
              onClick={() => !disabled && onToggle(id)}
              disabled={disabled}
              className={`flex items-center gap-2.5 text-left transition-opacity ${disabled ? 'opacity-40' : ''}`}
            >
              <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] transition-colors ${
                checked ? 'bg-accent border-accent text-black' : 'border-[#444]'
              }`}>{checked ? '✓' : ''}</span>
              <span className={`text-xs ${checked ? 'text-[#555] line-through' : 'text-[#ccc]'}`}>{ex}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SessionCard({ session, phase, weekNum, log, date, isToday, today, store }: {
  session: WorkoutSession
  phase: string
  weekNum: 1 | 2 | 3 | 4
  log: DayLog | null
  date: string
  isToday: boolean
  today: string
  store: ReturnType<typeof useStore>
}) {
  const completed = log?.completedExercises ?? []
  const disabled = !isToday && date > today

  const phaseKey = weekNum <= 2 ? 's12' : weekNum === 3 ? 's3' : 's4'

  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm">{session.name}</p>
          <p className="text-xs text-[#555]">{session.duration} · {session.structure}</p>
        </div>
        <span className="mono text-xs text-[#555]">{completed.filter(id => id.startsWith(session.id)).length}/{session.exercises.length}</span>
      </div>

      {session.tempoNote && phase === 'tecnica' && (
        <p className="text-xs text-blue-400 bg-blue-950/30 rounded px-3 py-1.5">ℹ {session.tempoNote}</p>
      )}

      <div className="flex flex-col gap-2">
        {session.exercises.map(ex => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            phaseKey={phaseKey}
            checked={completed.includes(ex.id)}
            onToggle={() => !disabled && store.toggleExercise(date, ex.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}

function RestDayCard({ log, isToday, onDone }: {
  log: DayLog | null
  isToday: boolean
  onDone: () => void
}) {
  const done = log?.sessionDone || log?.escapedHatch

  return (
    <div className="card p-5 flex flex-col gap-3">
      <p className="font-bold">Domenica — Riposo attivo</p>
      <ul className="flex flex-col gap-1.5">
        {REST_DAY.activities.map((a, i) => (
          <li key={i} className="text-sm text-[#888] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#444] flex-shrink-0" />
            {a}
          </li>
        ))}
      </ul>
      {isToday && !done && (
        <button onClick={onDone} className="btn-primary mt-2 w-full">
          Giornata registrata
        </button>
      )}
      {done && (
        <p className="text-green-400 text-sm">✓ Registrato</p>
      )}
    </div>
  )
}
