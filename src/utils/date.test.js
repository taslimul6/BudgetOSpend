import { describe, expect, it } from 'vitest'
import {
  addMonths,
  daysInMonth,
  daysLeftInMonth,
  formatDate,
  formatMonth,
  isISODate,
  makeDate,
  parseToISO,
  todayISO,
  toMonthKey,
} from './date'

describe('date utils', () => {
  it('uses the (mocked) local date for today', () => {
    expect(todayISO()).toBe('2026-11-22')
  })

  it('validates ISO dates strictly', () => {
    expect(isISODate('2026-02-28')).toBe(true)
    expect(isISODate('2026-02-30')).toBe(false)
    expect(isISODate('Aug 25, 2026')).toBe(false)
    expect(isISODate(20260228)).toBe(false)
  })

  it('migrates legacy display strings to ISO', () => {
    expect(parseToISO('Aug 25, 2026')).toBe('2026-08-25')
    expect(parseToISO('2026-08-25')).toBe('2026-08-25')
    expect(parseToISO('not a date')).toBeNull()
    expect(parseToISO('')).toBeNull()
  })

  it('formats dates and months without timezone drift', () => {
    expect(formatDate('2026-08-01')).toBe('Aug 1, 2026')
    expect(formatMonth('2026-08')).toBe('August 2026')
  })

  it('does month arithmetic across year boundaries', () => {
    expect(addMonths('2026-12', 1)).toBe('2027-01')
    expect(addMonths('2026-01', -1)).toBe('2025-12')
    expect(daysInMonth('2028-02')).toBe(29)
    expect(toMonthKey('2026-08-25')).toBe('2026-08')
  })

  it('clamps the day to the length of the month', () => {
    expect(makeDate('2026-02', 31)).toBe('2026-02-28')
    expect(makeDate('2026-03', 31)).toBe('2026-03-31')
  })

  it('counts days left only for the current month', () => {
    expect(daysLeftInMonth('2026-11')).toBe(9)
    expect(daysLeftInMonth('2026-10')).toBeNull()
  })
})
