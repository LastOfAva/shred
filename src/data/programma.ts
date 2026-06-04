// ============================================================
// SHRED — Fonte di Verità del Programma
// Periodo: 4 giugno 2026 → 3 luglio 2026 (30 giorni)
// NON MODIFICARE senza aggiornare anche i criteri di accettazione
// ============================================================

export const START_DATE = '2026-06-04'
export const END_DATE = '2026-07-03'
export const TOTAL_DAYS = 30

// ── Fasi ────────────────────────────────────────────────────
export type Phase = 'tecnica' | 'progressione' | 'picco'

export const PHASES: Record<Phase, { label: string; weeks: string; dates: string }> = {
  tecnica:      { label: 'Scuola tecnica', weeks: 'S1–S2', dates: '4–17 giu' },
  progressione: { label: 'Progressione',   weeks: 'S3',    dates: '18–24 giu' },
  picco:        { label: 'Picco',          weeks: 'S4',    dates: '25 giu–3 lug' },
}

// Settimane (1-indexed, lun–dom)
// S1: 4–10 giu  S2: 11–17 giu  S3: 18–24 giu  S4: 25 giu–3 lug
export function getWeekNumber(dateStr: string): 1 | 2 | 3 | 4 {
  const start = new Date(START_DATE)
  const d = new Date(dateStr)
  const diffMs = d.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays < 7)  return 1
  if (diffDays < 14) return 2
  if (diffDays < 21) return 3
  return 4
}

export function getPhase(dateStr: string): Phase {
  const w = getWeekNumber(dateStr)
  if (w <= 2) return 'tecnica'
  if (w === 3) return 'progressione'
  return 'picco'
}

// ── Tipi generici ────────────────────────────────────────────
export type PhaseValues = {
  s12: string  // Settimane 1–2
  s3:  string  // Settimana 3
  s4:  string  // Settimana 4
}

export interface Exercise {
  id: string
  name: string
  sets: PhaseValues
  note?: PhaseValues | string   // nota tecnica (stringa fissa o per fase)
  tempo?: string                // es. "3-1-1" (solo alcune schede)
}

export interface WorkoutSession {
  id: string
  name: string
  dayLabel: string   // es. "Lun + Sab"
  duration: string   // es. "50 min"
  structure: string  // es. "4 round"
  tempoNote?: string
  exercises: Exercise[]
  mobilityFirst: boolean  // prepend Mobility 5 min sempre
}

// ── Mobility 5 min (sempre prima) ───────────────────────────
export const MOBILITY_EXERCISES: string[] = [
  'Cat-cow ×10',
  "World's greatest stretch ×6",
  'Circonduzioni anche ×10/dir',
  'Thoracic twist a terra ×10/lato',
  'Squat to stand ×8',
]

// ── HOME A — Gambe & Glutei ──────────────────────────────────
const HOME_A: WorkoutSession = {
  id: 'A',
  name: 'HOME A',
  dayLabel: 'Lun + Sab',
  duration: '50 min',
  structure: '4 round',
  tempoNote: 'Tempo 3-1-1 in fase Scuola tecnica',
  mobilityFirst: true,
  exercises: [
    {
      id: 'A1', name: 'Squat corpo libero',
      sets: { s12: '4×15', s3: '4×18', s4: '4×20' },
      tempo: '3-1-1',
    },
    {
      id: 'A2', name: 'Affondi alternati in camminata',
      sets: { s12: '4×12/g', s3: '4×14/g', s4: '4×16/g' },
    },
    {
      id: 'A3', name: 'Hip thrust (spalle su divano)',
      sets: { s12: '4×20', s3: '4×22 + iso 20"', s4: '4×25 + iso 30"' },
      note: 'Spingi i fianchi verso il soffitto, contrai il gluteo in cima',
    },
    {
      id: 'A4', name: 'Stacco rumeno mono-podalico',
      sets: { s12: '4×10/g', s3: '4×12/g', s4: '4×12/g + pausa 2"' },
      note: 'Schiena piatta, anca incernierata, non arrotolare la lombare',
    },
    {
      id: 'A5', name: 'Bulgarian split squat',
      sets: { s12: '3×10/g', s3: '3×12/g', s4: '4×12/g' },
      note: 'Piede posteriore su sedia/divano, ginocchio anteriore non oltre la punta',
    },
    {
      id: 'A6', name: 'Glute bridge isometrico',
      sets: { s12: '3×30"', s3: '3×40"', s4: '3×50"' },
    },
    {
      id: 'A7', name: 'Calf raise in piedi',
      sets: { s12: '4×20', s3: '4×25', s4: '4×30' },
      note: 'Lento in discesa (3"), esplosivo in salita',
    },
  ],
}

// ── HOME B — Core & Upper Body ───────────────────────────────
const HOME_B: WorkoutSession = {
  id: 'B',
  name: 'HOME B',
  dayLabel: 'Mer',
  duration: '50 min',
  structure: '4 round',
  tempoNote: 'Tempo 3-1-2 in fase Scuola tecnica',
  mobilityFirst: true,
  exercises: [
    {
      id: 'B1', name: 'Push-up (anche su ginocchia)',
      sets: { s12: '4×max', s3: '4×max+2', s4: '4×max+4' },
      note: 'Corpo rigido, gomiti a 45°, scapole attive',
    },
    {
      id: 'B2', name: 'Pike push-up (a V)',
      sets: { s12: '3×8', s3: '3×10', s4: '4×10' },
      note: 'Fianchi alti, testa tra le braccia, discendi verso il pavimento',
    },
    {
      id: 'B3', name: 'Superman',
      sets: { s12: '3×15', s3: '3×18', s4: '3×20' },
      note: 'Stacca braccia e gambe insieme, tieni 1", non iperestendere il collo',
    },
    {
      id: 'B4', name: 'Tricep dip su sedia',
      sets: { s12: '4×12', s3: '4×15', s4: '4×18' },
      note: 'Gomiti indietro (non aperti), abbassa i fianchi vicino alla sedia',
    },
    {
      id: 'B5', name: 'Plank classico',
      sets: { s12: '4×45"', s3: '4×60"', s4: '4×75"' },
      note: 'Linea retta testa-talloni, non alzare i fianchi',
    },
    {
      id: 'B6', name: 'Russian twist',
      sets: { s12: '4×20', s3: '4×24 (bottiglia 1L)', s4: '4×30 (bottiglia 1L)' },
      note: 'Da S3 aggiungi bottiglia da 1L come carico',
    },
    {
      id: 'B7', name: 'Mountain climber',
      sets: { s12: '4×30"', s3: '4×40"', s4: '4×45"' },
      note: 'Fianchi stabili, non oscillare; ritmo costante',
    },
    {
      id: 'B8', name: 'Hollow body hold',
      sets: { s12: '4×20"', s3: '4×30"', s4: '4×40"' },
      note: 'Lombare incollata al pavimento, gambe e braccia distese e sollevate',
    },
  ],
}

// ── HOME C — TUT (Tempo Sotto Tensione) ─────────────────────
const HOME_C: WorkoutSession = {
  id: 'C',
  name: 'HOME C',
  dayLabel: 'Ven',
  duration: '45 min',
  structure: 'Circuito 4 round — tempo 3-1-2 su tutti gli esercizi',
  tempoNote: 'Reps fisse su tutte le fasi (nessuna progressione numerica: progredisce il peso)',
  mobilityFirst: true,
  exercises: [
    {
      id: 'C1', name: 'Squat lento',
      sets: { s12: '12', s3: '12', s4: '12' },
      tempo: '3-1-2',
    },
    {
      id: 'C2', name: 'Push-up controllato',
      sets: { s12: '8', s3: '8', s4: '8' },
      tempo: '3-1-2',
    },
    {
      id: 'C3', name: 'Reverse lunge alternato',
      sets: { s12: '8/g', s3: '8/g', s4: '8/g' },
      tempo: '3-1-2',
    },
    {
      id: 'C4', name: 'Glute bridge con pausa in alto',
      sets: { s12: '15', s3: '15', s4: '15' },
      note: 'Pausa 2" in cima a ogni rep',
    },
    {
      id: 'C5', name: 'Plank to push-up controllato',
      sets: { s12: '6', s3: '6', s4: '6' },
      note: 'Da plank avambracci a plank mani, lento e controllato',
    },
    {
      id: 'C6', name: 'Hollow body hold',
      sets: { s12: '30"', s3: '30"', s4: '30"' },
    },
    {
      id: 'C7', name: 'Side plank (per lato)',
      sets: { s12: '30"/lato', s3: '30"/lato', s4: '30"/lato' },
    },
    {
      id: 'C8', name: 'Bird dog lento',
      sets: { s12: '10/lato', s3: '10/lato', s4: '10/lato' },
      note: 'Stendi braccio e gamba opposta, mantieni il core stabile 1"',
    },
  ],
}

// ── HOME D — Full Body Toning ────────────────────────────────
const HOME_D: WorkoutSession = {
  id: 'D',
  name: 'HOME D',
  dayLabel: 'Mar',
  duration: '50 min',
  structure: 'Ladder 5 round (R1→R5)',
  tempoNote: 'In fase Scuola tecnica: squat lento al posto di squat jump',
  mobilityFirst: true,
  exercises: [
    {
      id: 'D1', name: 'Squat jump',
      sets: {
        s12: '8/10/12/10/8 (squat lento in S1-S2)',
        s3:  '8/10/12/10/8',
        s4:  '8/10/12/10/8 +1-2 rep al picco',
      },
      note: 'Fase tecnica: squat lento senza salto. Da S3: esplodi verso l\'alto',
    },
    {
      id: 'D2', name: 'Push-up',
      sets: {
        s12: '6/8/10/8/6',
        s3:  '6/8/10/8/6',
        s4:  '6/8/10/8/6 +1-2 rep al picco',
      },
    },
    {
      id: 'D3', name: 'Reverse lunge alternato',
      sets: {
        s12: '8/10/12/10/8 per gamba',
        s3:  '8/10/12/10/8 per gamba',
        s4:  '8/10/12/10/8 +1-2 rep per gamba al picco',
      },
    },
    {
      id: 'D4', name: 'Plank (tenuta)',
      sets: {
        s12: '30"/40"/50"/40"/30"',
        s3:  '30"/40"/50"/40"/30"',
        s4:  '30"/40"/50"/40"/30" +10" al picco',
      },
    },
    {
      id: 'D5', name: 'Glute bridge marching',
      sets: {
        s12: '10/12/14/12/10 per gamba',
        s3:  '10/12/14/12/10 per gamba',
        s4:  '10/12/14/12/10 +1-2 per gamba al picco',
      },
      note: 'Fianchi in alto, alterna sollevamento gambe tenendo il bacino stabile',
    },
  ],
}

// ── HOME E — Cardio + Catena Posteriore ─────────────────────
const HOME_E: WorkoutSession = {
  id: 'E',
  name: 'HOME E',
  dayLabel: 'Gio',
  duration: '45 min',
  structure: 'HIIT Tabata 25 min + Catena posteriore 15 min',
  tempoNote: 'In fase Scuola tecnica: intensità ridotta, focus tecnica',
  mobilityFirst: true,
  exercises: [
    // Parte 1 — HIIT Tabata
    {
      id: 'E1', name: 'Tabata — Burpee',
      sets: { s12: '8 round × 20"/10" (intensità ridotta)', s3: '8 round × 20"/10"', s4: '8 round × 20"/10"' },
      note: 'Intensità ridotta in S1-S2: focus tecnica, non velocità',
    },
    {
      id: 'E2', name: 'Tabata — High knees',
      sets: { s12: '8 round × 20"/10" (intensità ridotta)', s3: '8 round × 20"/10"', s4: '8 round × 20"/10"' },
    },
    {
      id: 'E3', name: 'Tabata — Jumping jack',
      sets: { s12: '8 round × 20"/10" (intensità ridotta)', s3: '8 round × 20"/10"', s4: '8 round × 20"/10"' },
    },
    {
      id: 'E4', name: 'Tabata — Skater jump',
      sets: { s12: '8 round × 20"/10" (intensità ridotta)', s3: '8 round × 20"/10"', s4: '8 round × 20"/10"' },
    },
    // Parte 2 — Catena posteriore
    {
      id: 'E5', name: 'Glute bridge isometrico',
      sets: { s12: '3×40"', s3: '3×40"', s4: '3×40"' },
      note: 'Recupero 30-45" tra serie',
    },
    {
      id: 'E6', name: 'Stacco rumeno mono-podalico',
      sets: { s12: '3×12/g', s3: '3×12/g', s4: '3×12/g' },
      note: 'Recupero 30-45" tra serie',
    },
    {
      id: 'E7', name: 'Superman',
      sets: { s12: '3×15', s3: '3×15', s4: '3×15' },
    },
    {
      id: 'E8', name: 'Bird dog',
      sets: { s12: '3×12/lato', s3: '3×12/lato', s4: '3×12/lato' },
    },
    {
      id: 'E9', name: 'Single leg glute bridge',
      sets: { s12: '3×10/g', s3: '3×10/g', s4: '3×10/g' },
    },
  ],
}

// ── Schema settimanale ───────────────────────────────────────
// 0=Dom 1=Lun 2=Mar 3=Mer 4=Gio 5=Ven 6=Sab
export const WEEKLY_SCHEDULE: Record<number, string | null> = {
  1: 'A',  // Lun → HOME A
  2: 'D',  // Mar → HOME D
  3: 'B',  // Mer → HOME B
  4: 'E',  // Gio → HOME E
  5: 'C',  // Ven → HOME C
  6: 'A',  // Sab → HOME A
  0: null, // Dom → Riposo attivo
}

export const SESSIONS: Record<string, WorkoutSession> = { A: HOME_A, B: HOME_B, C: HOME_C, D: HOME_D, E: HOME_E }

// ── Cardio e-bike (voce separata, ogni giorno) ──────────────
export interface CardioBike {
  durationMin: number
  bpmLow: number
  bpmHigh: number
  note: string
  hiitWeek?: boolean  // S4: 1 sessione HIIT/settimana
}

export const CARDIO_BIKE: Record<1 | 2 | 3 | 4, CardioBike> = {
  1: { durationMin: 50, bpmLow: 133, bpmHigh: 143, note: 'Zona 2. In salita alza assistenza per non sforare i BPM.' },
  2: { durationMin: 55, bpmLow: 133, bpmHigh: 143, note: 'Zona 2. In salita alza assistenza per non sforare i BPM.' },
  3: { durationMin: 60, bpmLow: 133, bpmHigh: 143, note: 'Zona 2. In salita alza assistenza per non sforare i BPM.' },
  4: { durationMin: 60, bpmLow: 133, bpmHigh: 143, note: 'Zona 2. 1 sessione a settimana in HIIT invece di Zona 2.', hiitWeek: true },
}

// ── Domenica: Riposo attivo ──────────────────────────────────
export const REST_DAY = {
  label: 'Riposo attivo',
  activities: ['Camminata 30-40 min zona 1', 'Stretching 20 min'],
}

// ── XP & Livelli ─────────────────────────────────────────────
export const XP_PER_SESSION  = 100  // sessione serale completata
export const XP_PER_CARDIO   = 50   // cardio e-bike completato
export const XP_PER_ESCAPE   = 25   // escape hatch (riposo attivo registrato)
export const XP_PER_STREAK_7 = 200  // bonus settimana filata

export const LEVELS = [
  { level: 1, name: 'Iniziata',    xpRequired: 0    },
  { level: 2, name: 'Costante',    xpRequired: 300  },
  { level: 3, name: 'In trazione', xpRequired: 700  },
  { level: 4, name: 'Avanzata',    xpRequired: 1200 },
  { level: 5, name: 'Completa',    xpRequired: 2000 },
]

// ── Badge ────────────────────────────────────────────────────
export interface Badge {
  id: string
  name: string
  desc: string
  icon: string
}

export const BADGES: Badge[] = [
  { id: 'first_day',    name: 'Giorno 1',         icon: '⚡', desc: 'Prima sessione completata.' },
  { id: 'week1',        name: 'Settimana 1',       icon: '🗓', desc: 'Settimana 1 completata.' },
  { id: 'week2',        name: 'Settimana 2',       icon: '🗓', desc: 'Settimana 2 completata.' },
  { id: 'week3',        name: 'Settimana 3',       icon: '🗓', desc: 'Settimana 3 completata.' },
  { id: 'week4',        name: 'Settimana 4',       icon: '🏁', desc: 'Settimana 4 completata.' },
  { id: 'phase_prog',   name: 'Progressione',      icon: '📈', desc: 'Fase Progressione raggiunta.' },
  { id: 'phase_picco',  name: 'Picco',             icon: '🔝', desc: 'Fase Picco raggiunta.' },
  { id: 'streak_5',     name: '5 giorni filati',   icon: '🔥', desc: 'Streak di 5 giorni mossi.' },
  { id: 'streak_10',    name: '10 giorni filati',  icon: '🔥', desc: 'Streak di 10 giorni mossi.' },
  { id: 'streak_20',    name: '20 giorni filati',  icon: '🔥', desc: 'Streak di 20 giorni mossi.' },
  { id: 'all_30',       name: '30/30',             icon: '💎', desc: '30 giorni completati su 30.' },
  { id: 'jolly_saved',  name: 'Jolly usato',       icon: '🃏', desc: 'Streak salvato con il jolly.' },
]
