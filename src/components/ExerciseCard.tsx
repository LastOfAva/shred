import { useState } from 'react'
import { Exercise } from '../data/programma'

interface Props {
  exercise: Exercise
  phaseKey: 's12' | 's3' | 's4'
  checked: boolean
  onToggle: () => void
  disabled: boolean
}

export default function ExerciseCard({ exercise, phaseKey, checked, onToggle, disabled }: Props) {
  const [expanded, setExpanded] = useState(false)
  const sets = exercise.sets[phaseKey]
  const note = typeof exercise.note === 'string'
    ? exercise.note
    : exercise.note?.[phaseKey] ?? null

  return (
    <div className={`rounded-lg border transition-colors ${
      checked ? 'border-[#2a2a2a] bg-[#141414]' : 'border-[#2a2a2a] bg-[#0f0f0f]'
    }`}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          onClick={() => !disabled && onToggle()}
          disabled={disabled}
          className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-colors ${
            checked ? 'bg-accent border-accent text-black font-bold' : 'border-[#444]'
          } ${disabled ? 'opacity-40' : ''}`}
        >
          {checked ? '✓' : ''}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${checked ? 'text-[#555] line-through' : 'text-[#ddd]'}`}>
            {exercise.name}
          </p>
          <p className="mono text-xs text-accent mt-0.5">{sets}</p>
          {exercise.tempo && (
            <p className="text-[10px] text-[#555] mt-0.5">Tempo {exercise.tempo}</p>
          )}
        </div>

        {note && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[#444] hover:text-[#888] transition-colors flex-shrink-0 text-lg leading-none"
          >
            {expanded ? '−' : 'ℹ'}
          </button>
        )}
      </div>

      {expanded && note && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-xs text-[#777] bg-[#1a1a1a] rounded px-3 py-2 border border-[#2a2a2a]">
            {note}
          </p>
        </div>
      )}
    </div>
  )
}
