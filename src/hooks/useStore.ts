import { useState, useEffect, useCallback } from 'react'
import {
  START_DATE, TOTAL_DAYS,
  XP_PER_SESSION, XP_PER_CARDIO, XP_PER_ESCAPE, XP_PER_STREAK_7,
  LEVELS, BADGES, Badge,
} from '../data/programma'

export type DayStatus = 'done' | 'partial' | 'rest_active' | 'skipped' | null

export interface DayLog {
  date: string          // 'YYYY-MM-DD'
  status: DayStatus
  sessionDone: boolean
  cardioDone: boolean
  escapedHatch: boolean // riposo attivo volontario
  completedExercises: string[]  // IDs
  xpEarned: number
  note?: string
}

export interface AppState {
  days: Record<string, DayLog>
  streakCurrent: number
  streakBest: number
  jollyAvailable: number   // max 1 jolly disponibile
  jollyUsedDates: string[] // date in cui si è usato il jolly
  earnedBadges: string[]   // badge IDs
  totalXp: number
  lastUpdated: string
  seenPhaseAlerts: string[] // ['progressione', 'picco']
}

const STORAGE_KEY = 'shred_state_v1'

const initialState: AppState = {
  days: {},
  streakCurrent: 0,
  streakBest: 0,
  jollyAvailable: 0,
  jollyUsedDates: [],
  earnedBadges: [],
  totalXp: 0,
  lastUpdated: new Date().toISOString(),
  seenPhaseAlerts: [],
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: new Date().toISOString() }))
  } catch {
    // storage full or unavailable
  }
}

// Date helpers
export function dateStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function addDays(base: string, n: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  return dateStr(d)
}

export function getDayIndex(d: string): number {
  const start = new Date(START_DATE)
  const target = new Date(d)
  return Math.floor((target.getTime() - start.getTime()) / 86400000)
}

export function isInProgram(d: string): boolean {
  const idx = getDayIndex(d)
  return idx >= 0 && idx < TOTAL_DAYS
}

// Compute streak from day logs (counts consecutive days moved ending at today)
function computeStreak(days: Record<string, DayLog>): { current: number; best: number } {
  const today = dateStr()
  let current = 0
  let best = 0
  let consecutive = 0

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = addDays(START_DATE, i)
    if (d > today) break
    const log = days[d]
    const moved = log && (log.sessionDone || log.cardioDone || log.escapedHatch)
    if (moved) {
      consecutive++
      best = Math.max(best, consecutive)
    } else {
      consecutive = 0
    }
  }
  current = consecutive
  return { current, best }
}

function checkBadges(state: AppState): string[] {
  const earned = new Set(state.earnedBadges)
  const days = state.days
  const today = dateStr()

  const allLogs = Object.values(days).filter(l => isInProgram(l.date))
  const doneDays = allLogs.filter(l => l.sessionDone || l.cardioDone || l.escapedHatch)

  if (doneDays.length >= 1) earned.add('first_day')
  if (state.streakCurrent >= 5 || state.streakBest >= 5) earned.add('streak_5')
  if (state.streakCurrent >= 10 || state.streakBest >= 10) earned.add('streak_10')
  if (state.streakCurrent >= 20 || state.streakBest >= 20) earned.add('streak_20')
  if (doneDays.length >= 30) earned.add('all_30')
  if (state.jollyUsedDates.length > 0) earned.add('jolly_saved')

  // Week badges
  for (let w = 1; w <= 4; w++) {
    const startIdx = (w - 1) * 7
    const endIdx = w === 4 ? TOTAL_DAYS : startIdx + 7
    let weekDone = true
    for (let i = startIdx; i < endIdx; i++) {
      const d = addDays(START_DATE, i)
      if (d > today) { weekDone = false; break }
      const log = days[d]
      if (!log || (!log.sessionDone && !log.cardioDone && !log.escapedHatch)) {
        weekDone = false; break
      }
    }
    if (weekDone) {
      if (w === 1) earned.add('week1')
      if (w === 2) earned.add('week2')
      if (w === 3) { earned.add('week3'); earned.add('phase_prog') }
      if (w === 4) { earned.add('week4'); earned.add('phase_picco') }
    }
  }

  return Array.from(earned)
}

export function getCurrentLevel(xp: number) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l
    else break
  }
  const idx = LEVELS.indexOf(current)
  const next = LEVELS[idx + 1] ?? null
  return { current, next }
}

export function getNewBadges(prevBadges: string[], newBadges: string[]): Badge[] {
  const prevSet = new Set(prevBadges)
  return newBadges.filter(id => !prevSet.has(id)).map(id => BADGES.find(b => b.id === id)!).filter(Boolean)
}

// ── Hook ─────────────────────────────────────────────────────
export function useStore() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => { saveState(state) }, [state])

  const updateDay = useCallback((date: string, patch: Partial<DayLog>) => {
    setState(prev => {
      const existing = prev.days[date] ?? {
        date, status: null, sessionDone: false, cardioDone: false,
        escapedHatch: false, completedExercises: [], xpEarned: 0,
      }
      const updated: DayLog = { ...existing, ...patch }

      // Recompute XP for this day
      let xp = 0
      if (updated.sessionDone) xp += XP_PER_SESSION
      if (updated.cardioDone)  xp += XP_PER_CARDIO
      if (updated.escapedHatch) xp += XP_PER_ESCAPE
      updated.xpEarned = xp

      // Determine status
      if (updated.escapedHatch) updated.status = 'rest_active'
      else if (updated.sessionDone && updated.cardioDone) updated.status = 'done'
      else if (updated.sessionDone || updated.cardioDone) updated.status = 'partial'
      else updated.status = null

      const newDays = { ...prev.days, [date]: updated }

      // Recompute streak
      const { current, best } = computeStreak(newDays)

      // Jolly: if streak survived because of jolly, note it
      // (Jolly is granted when streak was active and user missed a day)
      let jollyAvailable = prev.jollyAvailable
      let jollyUsedDates = prev.jollyUsedDates

      // Recompute total XP
      const totalXp = Object.values(newDays).reduce((sum, d) => sum + (d.xpEarned ?? 0), 0)
        + (current >= 7 && best >= 7 ? XP_PER_STREAK_7 * Math.floor(best / 7) : 0)

      // Check new badges
      const tempState = { ...prev, days: newDays, streakCurrent: current, streakBest: best, totalXp }
      const earnedBadges = checkBadges(tempState)

      return {
        ...prev,
        days: newDays,
        streakCurrent: current,
        streakBest: best,
        jollyAvailable,
        jollyUsedDates,
        earnedBadges,
        totalXp,
      }
    })
  }, [])

  const toggleExercise = useCallback((date: string, exerciseId: string) => {
    setState(prev => {
      const existing = prev.days[date] ?? {
        date, status: null, sessionDone: false, cardioDone: false,
        escapedHatch: false, completedExercises: [], xpEarned: 0,
      }
      const completed = existing.completedExercises ?? []
      const isAdding = !completed.includes(exerciseId)
      const nextCompleted = isAdding
        ? [...completed, exerciseId]
        : completed.filter(id => id !== exerciseId)

      const updated: DayLog = { ...existing, completedExercises: nextCompleted }

      // Adding a session exercise (not mobility) marks the session as done for streak
      if (isAdding && !exerciseId.startsWith('mob_')) {
        updated.sessionDone = true
      }

      // Recompute XP
      let xp = 0
      if (updated.sessionDone) xp += XP_PER_SESSION
      if (updated.cardioDone)  xp += XP_PER_CARDIO
      if (updated.escapedHatch) xp += XP_PER_ESCAPE
      updated.xpEarned = xp

      // Recompute status
      if (updated.escapedHatch) updated.status = 'rest_active'
      else if (updated.sessionDone && updated.cardioDone) updated.status = 'done'
      else if (updated.sessionDone || updated.cardioDone) updated.status = 'partial'
      else updated.status = null

      const newDays = { ...prev.days, [date]: updated }
      const { current, best } = computeStreak(newDays)
      const totalXp = Object.values(newDays).reduce((sum, d) => sum + (d.xpEarned ?? 0), 0)
        + (current >= 7 && best >= 7 ? XP_PER_STREAK_7 * Math.floor(best / 7) : 0)
      const tempState = { ...prev, days: newDays, streakCurrent: current, streakBest: best, totalXp }
      const earnedBadges = checkBadges(tempState)
      return { ...prev, days: newDays, streakCurrent: current, streakBest: best, totalXp, earnedBadges }
    })
  }, [])

  const useEscapeHatch = useCallback((date: string) => {
    setState(prev => {
      const existing = prev.days[date] ?? {
        date, status: null, sessionDone: false, cardioDone: false,
        escapedHatch: false, completedExercises: [], xpEarned: 0,
      }
      const updated: DayLog = { ...existing, escapedHatch: true, status: 'rest_active', xpEarned: XP_PER_ESCAPE }
      const newDays = { ...prev.days, [date]: updated }
      const { current, best } = computeStreak(newDays)
      const jollyUsedDates = prev.jollyUsedDates.includes(date)
        ? prev.jollyUsedDates
        : [...prev.jollyUsedDates, date]
      const totalXp = Object.values(newDays).reduce((sum, d) => sum + (d.xpEarned ?? 0), 0)
      const tempState = { ...prev, days: newDays, streakCurrent: current, streakBest: best, totalXp, jollyUsedDates }
      const earnedBadges = checkBadges(tempState)
      return { ...prev, days: newDays, streakCurrent: current, streakBest: best, jollyUsedDates, earnedBadges, totalXp }
    })
  }, [])

  const markPhaseAlertSeen = useCallback((phase: string) => {
    setState(prev => ({
      ...prev,
      seenPhaseAlerts: [...(prev.seenPhaseAlerts ?? []), phase],
    }))
  }, [])

  const exportData = useCallback((): string => {
    return JSON.stringify(state, null, 2)
  }, [state])

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as AppState
      setState({ ...initialState, ...parsed })
      return true
    } catch {
      return false
    }
  }, [])

  return {
    state,
    updateDay,
    toggleExercise,
    useEscapeHatch,
    markPhaseAlertSeen,
    exportData,
    importData,
  }
}
