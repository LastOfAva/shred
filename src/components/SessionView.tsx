import { useState, useRef, useEffect } from 'react'
import { WorkoutSession } from '../data/programma'

interface Props {
  session: WorkoutSession
  phaseKey: 's12' | 's3' | 's4'
  completedExercises: string[]
  onToggleExercise: (id: string) => void
  onSessionDone: () => void
  onClose: () => void
}

// ── Parsing utilities ─────────────────────────────────────────

function parseSetsCount(s: string): number {
  // "4×15" or "3×30"" → 4 or 3
  const m = s.match(/^(\d+)[×x]/)
  if (m) return parseInt(m[1])
  // "8 round × 20"/10"" → 8
  const mRound = s.match(/^(\d+)\s+round/)
  if (mRound) return parseInt(mRound[1])
  // Ladder: "30"/40"/50"/40"/30"" → 5 parts
  if (/^\d+"\//.test(s)) return s.split('/').length
  return 1
}

function getSetDuration(setsStr: string, setIdx: number): number | null {
  // "Nx seconds": "4×45"" → 45
  const mFixed = setsStr.match(/^(\d+)[×x](\d+)"/)
  if (mFixed) return parseInt(mFixed[2])
  // "N round × 20"/10"" → tabata: work=20s
  const mTabata = setsStr.match(/round\s*[×x]\s*(\d+)"/)
  if (mTabata) return parseInt(mTabata[1])
  // Ladder: "30"/40"/50"/40"/30""
  const parts = setsStr.split('/')
  if (parts.length > 1 && parts[0].includes('"')) {
    const part = parts[Math.min(setIdx, parts.length - 1)]
    const m = part.match(/(\d+)"/)
    return m ? parseInt(m[1]) : null
  }
  // Single timed: "30"" or "30"/lato"
  const mSingle = setsStr.match(/^(\d+)"/)
  if (mSingle) return parseInt(mSingle[1])
  return null
}

function isTabata(setsStr: string): boolean {
  return /round\s*[×x]\s*\d+"\/\d+"/.test(setsStr) || setsStr.includes('20"/10"')
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m > 0) return `${m}:${sec.toString().padStart(2, '0')}`
  return `${sec}"`
}

const REST_SECONDS = 75

// ── Main component ────────────────────────────────────────────

type Mode = 'idle' | 'working' | 'rest' | 'exDone' | 'done'

export default function SessionView({
  session, phaseKey, completedExercises, onToggleExercise, onSessionDone, onClose,
}: Props) {
  const exercises = session.exercises
  const [exIdx, setExIdx] = useState(0)
  const [setNum, setSetNum] = useState(0)
  const [mode, setMode] = useState<Mode>('idle')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const ex = exercises[exIdx]
  const setsStr = ex.sets[phaseKey]
  const totalSets = parseSetsCount(setsStr)
  const tabata = isTabata(setsStr)
  const durThisSet = getSetDuration(setsStr, setNum)
  const isTimed = durThisSet !== null

  const note = typeof ex.note === 'string' ? ex.note : (ex.note?.[phaseKey] ?? null)

  function clearTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  function startCountdown(seconds: number, onDone: () => void) {
    clearTimer()
    setSecondsLeft(seconds)
    const startedAt = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const remaining = Math.max(0, seconds - elapsed)
      setSecondsLeft(remaining)
      if (remaining === 0) {
        clearTimer()
        onDone()
      }
    }, 400)
  }

  function goToRest(nextAction: () => void) {
    setMode('rest')
    startCountdown(REST_SECONDS, () => {
      nextAction()
    })
  }

  function markExDone() {
    clearTimer()
    setMode('exDone')
    if (!completedExercises.includes(ex.id)) onToggleExercise(ex.id)
  }

  function handleStart() {
    const isLastSet = setNum >= totalSets - 1
    if (isTimed && !tabata) {
      setMode('working')
      startCountdown(durThisSet!, () => {
        if (isLastSet) { markExDone() }
        else { goToRest(() => { setSetNum(n => n + 1); setMode('idle') }) }
      })
    } else {
      // Rep-based or tabata: tap marks set done
      if (isLastSet) { markExDone() }
      else { goToRest(() => { setSetNum(n => n + 1); setMode('idle') }) }
    }
  }

  function skipRest() {
    clearTimer()
    setSetNum(n => n + 1)
    setMode('idle')
    setSecondsLeft(0)
  }

  function goNext() {
    clearTimer()
    if (exIdx >= exercises.length - 1) {
      setMode('done')
      onSessionDone()
    } else {
      setExIdx(i => i + 1)
      setSetNum(0)
      setMode('idle')
      setSecondsLeft(0)
    }
  }

  function goPrev() {
    clearTimer()
    if (exIdx > 0) {
      setExIdx(i => i - 1)
      setSetNum(0)
      setMode('idle')
      setSecondsLeft(0)
    }
  }

  // ── Done screen ──────────────────────────────────────────────
  if (mode === 'done') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 p-8"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="text-6xl text-accent">✓</div>
        <p className="mono text-accent text-2xl font-bold text-center">Sessione completata</p>
        <p className="text-[#888] text-sm text-center leading-relaxed">
          {session.name} chiusa.<br />Streak vivo.
        </p>
        <button onClick={onClose} className="btn-primary px-10 py-3 text-base mt-2">Chiudi</button>
      </div>
    )
  }

  const progress = exIdx / exercises.length * 100

  // ── Main layout ──────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <button onClick={onClose} className="text-[#555] text-xl leading-none w-8 h-8 flex items-center justify-center">✕</button>
        <div className="flex-1 bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="mono text-xs text-[#555] w-10 text-right">{exIdx + 1}/{exercises.length}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-6 gap-5 overflow-y-auto">
        {/* Session label */}
        <p className="text-xs text-[#555] uppercase tracking-widest mono">{session.name} · {session.duration}</p>

        {/* Exercise name */}
        <div>
          <h2 className="text-3xl font-bold text-[#e8e8e8] leading-tight">{ex.name}</h2>
          {ex.tempo && (
            <p className="mono text-sm text-[#555] mt-1">Tempo {ex.tempo}</p>
          )}
        </div>

        {/* Sets prescription */}
        <div className="card px-5 py-4 flex flex-col gap-1">
          <p className="mono text-accent text-2xl font-bold leading-snug">{setsStr}</p>
          {totalSets > 1 && mode !== 'exDone' && (
            <p className="text-sm text-[#555]">Set {setNum + 1} di {totalSets}</p>
          )}
        </div>

        {/* Note */}
        {note && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3">
            <p className="text-sm text-[#aaa] leading-relaxed">{note}</p>
          </div>
        )}

        {/* Timer / action */}
        <div className="flex-1 flex flex-col justify-center">
          {mode === 'exDone' ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="text-5xl text-accent">✓</div>
              <p className="text-sm text-[#888]">Esercizio completato</p>
            </div>
          ) : mode === 'rest' ? (
            <div className="flex flex-col items-center gap-5">
              <p className="text-xs text-[#555] uppercase tracking-widest mono">Recupero</p>
              <div className="mono text-7xl font-bold text-[#ccc]">{formatTime(secondsLeft)}</div>
              <button onClick={skipRest} className="btn-ghost px-6 py-2 text-sm">
                Salta recupero
              </button>
            </div>
          ) : mode === 'working' ? (
            <div className="flex flex-col items-center gap-5">
              <p className="text-xs text-[#555] uppercase tracking-widest mono">In corso</p>
              <div className={`mono text-8xl font-bold transition-colors ${secondsLeft <= 5 ? 'text-red-400' : 'text-accent'} accent-glow`}>
                {formatTime(secondsLeft)}
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: durThisSet ? `${(secondsLeft / durThisSet) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ) : (
            /* idle */
            <div className="flex flex-col items-center gap-4">
              {isTimed && durThisSet && (
                <p className="mono text-[#555] text-4xl">{formatTime(durThisSet)}</p>
              )}
              {tabata && (
                <p className="text-xs text-[#888] text-center">20" lavoro · 10" pausa · {totalSets} round</p>
              )}
              <button onClick={handleStart} className="w-full btn-primary py-5 text-xl font-bold rounded-2xl">
                {isTimed && !tabata ? 'Avvia timer' : 'Ho fatto'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-6 pb-5 pt-3 flex items-center gap-3 border-t border-[#1a1a1a] flex-shrink-0">
        <button
          onClick={goPrev}
          disabled={exIdx === 0}
          className="btn-ghost w-14 py-3 disabled:opacity-30 text-lg"
        >
          ←
        </button>
        {mode === 'exDone' ? (
          <button onClick={goNext} className="btn-primary flex-1 py-3 text-base font-bold">
            {exIdx >= exercises.length - 1 ? 'Chiudi sessione ✓' : 'Prossimo →'}
          </button>
        ) : (
          <button onClick={goNext} className="btn-ghost flex-1 py-3 text-sm text-[#555]">
            Salta esercizio
          </button>
        )}
      </div>
    </div>
  )
}
