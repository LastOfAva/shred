import { useStore, getCurrentLevel } from '../hooks/useStore'
import { allProgramDates, getTodayStr } from '../utils/dateUtils'
import { BADGES, TOTAL_DAYS, START_DATE } from '../data/programma'

interface Props {
  store: ReturnType<typeof useStore>
}

export default function StatsView({ store }: Props) {
  const { state } = store
  const today = getTodayStr()
  const dates = allProgramDates()

  const pastDates = dates.filter(d => d <= today)
  const movedDays = pastDates.filter(d => {
    const log = state.days[d]
    return log && (log.sessionDone || log.cardioDone || log.escapedHatch)
  })

  const sessionsDone = pastDates.filter(d => state.days[d]?.sessionDone).length
  const cardioDone = pastDates.filter(d => state.days[d]?.cardioDone).length
  const escapeDays = pastDates.filter(d => state.days[d]?.escapedHatch).length

  const { current: level, next } = getCurrentLevel(state.totalXp)
  const xpToNext = next ? next.xpRequired - state.totalXp : 0
  const xpPct = next
    ? Math.round(((state.totalXp - level.xpRequired) / (next.xpRequired - level.xpRequired)) * 100)
    : 100

  // Consistency by week
  const weekStats: { week: number; done: number; total: number }[] = []
  for (let w = 1; w <= 4; w++) {
    const startIdx = (w - 1) * 7
    const endIdx = w === 4 ? TOTAL_DAYS : startIdx + 7
    let done = 0, total = 0
    for (let i = startIdx; i < endIdx; i++) {
      const d = new Date(START_DATE)
      d.setDate(d.getDate() + i)
      const ds = d.toISOString().slice(0, 10)
      if (ds > today) continue
      total++
      const log = state.days[ds]
      if (log && (log.sessionDone || log.cardioDone || log.escapedHatch)) done++
    }
    if (total > 0) weekStats.push({ week: w, done, total })
  }

  return (
    <div className="p-4 flex flex-col gap-5">
      <h2 className="mono font-bold text-xl text-accent pt-2">Stats</h2>

      {/* Streak */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Streak attuale" value={state.streakCurrent} unit="giorni" accent />
        <StatCard label="Streak migliore" value={state.streakBest} unit="giorni" />
        <StatCard label="Giorni mossi" value={movedDays.length} unit={`/ ${pastDates.length}`} />
        <StatCard label="Sessioni serali" value={sessionsDone} unit="completate" />
        <StatCard label="Cardio e-bike" value={cardioDone} unit="sessioni" />
        <StatCard label="Jolly usati" value={escapeDays} unit="riposi attivi" />
      </div>

      {/* XP & Level */}
      <div className="card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#555] uppercase tracking-wide mono">Livello</p>
            <p className="font-bold text-lg">{level.level} — {level.name}</p>
          </div>
          <span className="mono text-accent font-bold text-xl">{state.totalXp} <span className="text-xs text-[#555]">XP</span></span>
        </div>
        {next && (
          <>
            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-xs text-[#555]">{xpToNext} XP al livello {next.level} ({next.name})</p>
          </>
        )}
      </div>

      {/* Weekly consistency bars */}
      <div className="card p-4 flex flex-col gap-3">
        <p className="text-xs text-[#555] uppercase tracking-wide mono">Costanza per settimana</p>
        {weekStats.map(ws => (
          <div key={ws.week} className="flex items-center gap-3">
            <span className="mono text-xs text-[#555] w-4">S{ws.week}</span>
            <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  ws.done === ws.total ? 'bg-accent' : ws.done / ws.total >= 0.7 ? 'bg-accent/70' : 'bg-accent/40'
                }`}
                style={{ width: `${Math.round((ws.done / ws.total) * 100)}%` }}
              />
            </div>
            <span className="mono text-xs text-[#888] w-8 text-right">{ws.done}/{ws.total}</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="card p-4 flex flex-col gap-3">
        <p className="text-xs text-[#555] uppercase tracking-wide mono">Badge ({state.earnedBadges.length}/{BADGES.length})</p>
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map(badge => {
            const earned = state.earnedBadges.includes(badge.id)
            return (
              <div key={badge.id} className={`rounded-lg p-3 flex items-center gap-2.5 transition-opacity ${
                earned ? 'bg-[#1a1a1a] border border-accent/20' : 'bg-[#111] border border-[#1e1e1e] opacity-40'
              }`}>
                <span className="text-xl leading-none">{badge.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${earned ? 'text-[#ddd]' : 'text-[#555]'}`}>{badge.name}</p>
                  <p className="text-[10px] text-[#555] truncate">{badge.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, accent }: { label: string; value: number; unit: string; accent?: boolean }) {
  return (
    <div className="card p-3 flex flex-col gap-0.5">
      <p className="text-[10px] text-[#555] uppercase tracking-wide mono">{label}</p>
      <p className={`mono font-bold text-2xl ${accent ? 'text-accent' : 'text-[#ddd]'}`}>{value}</p>
      <p className="text-xs text-[#555]">{unit}</p>
    </div>
  )
}
