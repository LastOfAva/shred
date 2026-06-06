import { useState, useRef, useEffect } from 'react'
import { Exercise } from '../data/programma'

interface Props {
  exercise: Exercise
  phaseKey: 's12' | 's3' | 's4'
  checked: boolean
  onToggle: () => void
  disabled: boolean
}

// Block identity colors (A-E)
const BLOCK: Record<string, { bar: string; icon: string; ring: string }> = {
  A: { bar: '#d946ef', icon: 'text-fuchsia-400', ring: 'ring-fuchsia-500/40' },
  B: { bar: '#0ea5e9', icon: 'text-sky-400',     ring: 'ring-sky-500/40' },
  C: { bar: '#22c55e', icon: 'text-green-400',   ring: 'ring-green-500/40' },
  D: { bar: '#f97316', icon: 'text-orange-400',  ring: 'ring-orange-500/40' },
  E: { bar: '#ef4444', icon: 'text-red-400',     ring: 'ring-red-500/40' },
}

type IconType = 'squat' | 'lunge' | 'hipThrust' | 'pushUp' | 'plank' |
  'twist' | 'jump' | 'superman' | 'birdDog' | 'calfRaise' | 'lightning' | 'move'

function getIconType(name: string): IconType {
  const n = name.toLowerCase()
  if (n.includes('squat') && n.includes('jump')) return 'jump'
  if (n.includes('squat') || n.includes('split')) return 'squat'
  if (n.includes('affondo') || n.includes('lunge') || n.includes('reverse')) return 'lunge'
  if (n.includes('hip thrust') || n.includes('glute bridge') || n.includes('single leg glute')) return 'hipThrust'
  if (n.includes('stacco') || n.includes('rumeno')) return 'birdDog'
  if (n.includes('push') || n.includes('dip') || n.includes('pike')) return 'pushUp'
  if (n.includes('plank') && !n.includes('side')) return 'plank'
  if (n.includes('side plank')) return 'plank'
  if (n.includes('russian') || n.includes('twist') || n.includes('mountain') || n.includes('climber')) return 'twist'
  if (n.includes('hollow') || n.includes('superman') || n.includes('marching')) return 'superman'
  if (n.includes('bird')) return 'birdDog'
  if (n.includes('calf')) return 'calfRaise'
  if (n.includes('tabata') || n.includes('burpee') || n.includes('high knee') || n.includes('jumping jack') || n.includes('skater')) return 'lightning'
  if (n.includes('jump')) return 'jump'
  return 'move'
}

function Icon({ type, className }: { type: IconType; className?: string }) {
  const base = {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    width: 18,
    height: 18,
    className,
  }
  switch (type) {
    case 'squat':
      return <svg {...base}>
        <circle cx="10" cy="3" r="2" fill="currentColor" stroke="none" />
        <path d="M10 5 L10 9 M8 6.5 L12 6.5 M10 9 L7 16 M10 9 L13 16" />
      </svg>
    case 'lunge':
      return <svg {...base}>
        <circle cx="10" cy="3" r="2" fill="currentColor" stroke="none" />
        <path d="M10 5 L10 9 M10 9 L7 13.5 L6 19 M10 9 L14 13 L15 19" />
      </svg>
    case 'hipThrust':
      return <svg {...base}>
        <circle cx="3.5" cy="14" r="2" fill="currentColor" stroke="none" />
        <path d="M5.5 13.5 L9.5 15 L14 9 L18 9" />
        <path d="M18 9 L18 15 L15.5 15" />
      </svg>
    case 'pushUp':
      return <svg {...base}>
        <circle cx="3" cy="8" r="2" fill="currentColor" stroke="none" />
        <path d="M5 9 L16 13 M8 10.5 L8 17 M6 17 L10 17 M14 12 L14 17" />
      </svg>
    case 'plank':
      return <svg {...base}>
        <circle cx="3" cy="9" r="2" fill="currentColor" stroke="none" />
        <path d="M5 10 L18 10 M14 10 L14 16 M18 10 L18 16 M12 16 L16 16" />
      </svg>
    case 'twist':
      return <svg {...base}>
        <circle cx="10" cy="3" r="2" fill="currentColor" stroke="none" />
        <path d="M10 5 L10 10 M10 8.5 L5 12 M10 8.5 L15 12 M9 10 L8 17 L12 17" />
      </svg>
    case 'jump':
      return <svg {...base}>
        <circle cx="10" cy="4" r="2" fill="currentColor" stroke="none" />
        <path d="M10 6 L10 10 M8 5.5 L6 3 M12 5.5 L14 3 M10 10 L7.5 15 M10 10 L12.5 15" />
      </svg>
    case 'superman':
      return <svg {...base}>
        <circle cx="3" cy="10" r="2" fill="currentColor" stroke="none" />
        <path d="M5 10 L17 10 M8 10 L8 6.5 L12 6.5 M8 10 L8 13.5 L12 13.5" />
      </svg>
    case 'birdDog':
      return <svg {...base}>
        <circle cx="10" cy="8" r="2" fill="currentColor" stroke="none" />
        <path d="M10 10 L10 14 M10 11 L7 14 M10 11 L13 14 M3 10 L7 11 M17 9 L13 10" />
      </svg>
    case 'calfRaise':
      return <svg {...base}>
        <circle cx="10" cy="3" r="2" fill="currentColor" stroke="none" />
        <path d="M10 5 L10 10 M8.5 9.5 L8 14 M11.5 9.5 L12 14 M7 16 L9 14 M11 14 L13 16" />
      </svg>
    case 'lightning':
      return <svg {...base} strokeWidth={2}>
        <path d="M13 2 L5 11 L11 11 L7 18" />
      </svg>
    default:
      return <svg {...base}>
        <circle cx="10" cy="10" r="7" strokeDasharray="3 2" />
        <path d="M10 5 L10 8 M10 12 L10 15 M5 10 L8 10 M12 10 L15 10" />
      </svg>
  }
}

export default function ExerciseCard({ exercise, phaseKey, checked, onToggle, disabled }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [popping, setPopping] = useState(false)
  const prevChecked = useRef(checked)

  const sets = exercise.sets[phaseKey]
  const note = typeof exercise.note === 'string'
    ? exercise.note
    : exercise.note?.[phaseKey] ?? null

  const blockId = exercise.id[0]
  const block = BLOCK[blockId] ?? BLOCK['A']
  const iconType = getIconType(exercise.name)

  // Pop animation when checking
  useEffect(() => {
    if (!prevChecked.current && checked) {
      setPopping(true)
      const t = setTimeout(() => setPopping(false), 400)
      prevChecked.current = checked
      return () => clearTimeout(t)
    }
    prevChecked.current = checked
  }, [checked])

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      checked
        ? 'border-[#2a2a2a] bg-[#111]'
        : `border-[#2a2a2a] bg-[#131313] hover:border-[#333]`
    }`}>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {/* Block color bar */}
        <div
          className="block-bar"
          style={{ background: checked ? '#333' : block.bar, opacity: checked ? 0.5 : 1 }}
        />

        {/* Icon */}
        <div className={`flex-shrink-0 ${checked ? 'text-[#444]' : block.icon}`}>
          <Icon type={iconType} />
        </div>

        {/* Check button */}
        <button
          onClick={() => { if (!disabled) onToggle() }}
          disabled={disabled}
          className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-all ${
            checked ? 'bg-accent border-accent text-black font-bold' : 'border-[#444]'
          } ${disabled ? 'opacity-40' : 'active:scale-90'} ${popping ? 'check-pop' : ''}`}
          aria-label={checked ? 'Deseleziona' : 'Segna fatto'}
        >
          {checked ? '✓' : ''}
        </button>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-tight ${checked ? 'text-[#444] line-through' : 'text-[#ddd]'}`}>
            {exercise.name}
          </p>
          <p className={`mono text-xs mt-0.5 ${checked ? 'text-[#444]' : block.icon}`}>{sets}</p>
          {exercise.tempo && !checked && (
            <p className="text-[10px] text-[#555] mt-0.5">Tempo {exercise.tempo}</p>
          )}
        </div>

        {note && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[#444] hover:text-[#888] transition-colors flex-shrink-0 text-base leading-none px-1"
            aria-label="Mostra nota"
          >
            {expanded ? '−' : 'ℹ'}
          </button>
        )}
      </div>

      {expanded && note && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-xs text-[#777] bg-[#0f0f0f] rounded-lg px-3 py-2 border border-[#2a2a2a] leading-relaxed">
            {note}
          </p>
        </div>
      )}
    </div>
  )
}
