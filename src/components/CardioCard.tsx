import { CardioBike } from '../data/programma'

interface Props {
  cardio: CardioBike
  weekNum?: 1 | 2 | 3 | 4
  done: boolean
  disabled: boolean
  onToggle: () => void
}

export default function CardioCard({ cardio, done, disabled, onToggle }: Props) {
  return (
    <div className={`card p-4 flex items-center gap-4 transition-colors ${done ? 'border-accent/20' : ''}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-sm">E-bike mattutina</p>
          {cardio.hiitWeek && (
            <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded mono uppercase">
              1×HIIT questa sett.
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-accent text-sm font-bold">{cardio.durationMin} min</span>
          <span className="text-[#555] text-xs">Zona 2</span>
          <span className="mono text-xs text-[#888] bg-[#0f0f0f] px-2 py-0.5 rounded border border-[#2a2a2a]">
            {cardio.bpmLow}–{cardio.bpmHigh} BPM
          </span>
        </div>
        <p className="text-[11px] text-[#555] mt-1.5">{cardio.note}</p>
      </div>

      <button
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
        className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          done ? 'bg-accent' : 'bg-[#2a2a2a]'
        } disabled:opacity-40 relative`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          done ? 'translate-x-4' : ''
        }`} />
      </button>
    </div>
  )
}
