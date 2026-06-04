import { START_DATE, TOTAL_DAYS, getWeekNumber, getPhase, WEEKLY_SCHEDULE, SESSIONS, CARDIO_BIKE, REST_DAY } from '../data/programma'

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getProgramDay(dateStr: string): number {
  const start = new Date(START_DATE)
  const d = new Date(dateStr)
  return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1
}

export function isInProgram(dateStr: string): boolean {
  const n = getProgramDay(dateStr)
  return n >= 1 && n <= TOTAL_DAYS
}

export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay() // 0=Dom..6=Sab
}

export function getSessionForDate(dateStr: string) {
  const dow = getDayOfWeek(dateStr)
  const sessionId = WEEKLY_SCHEDULE[dow]
  if (sessionId === null) return null // Domenica
  if (!sessionId) return null
  return SESSIONS[sessionId] ?? null
}

export function getCardioForDate(dateStr: string) {
  const week = getWeekNumber(dateStr) as 1 | 2 | 3 | 4
  return CARDIO_BIKE[week]
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

export function getWeekdayShort(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase()
}

export function allProgramDates(): string[] {
  const dates: string[] = []
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = new Date(START_DATE)
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export function getDayDescription(dateStr: string): { isRest: boolean; sessionName: string; phaseLabel: string; weekNum: number } {
  const dow = getDayOfWeek(dateStr)
  const isRest = dow === 0
  const sessionId = WEEKLY_SCHEDULE[dow]
  const session = sessionId ? SESSIONS[sessionId] : null
  const phase = getPhase(dateStr)
  const phaseLabels: Record<string, string> = {
    tecnica: 'Scuola tecnica',
    progressione: 'Progressione',
    picco: 'Picco',
  }
  return {
    isRest,
    sessionName: isRest ? REST_DAY.label : (session ? `${session.name} — ${session.name.replace('HOME ', '')} (${session.duration})` : 'Nessuna sessione'),
    phaseLabel: phaseLabels[phase],
    weekNum: getWeekNumber(dateStr),
  }
}
