import { describe, expect, it } from 'vitest'
import { applyRecurring } from './recurring'

const template = (over = {}) => ({
  id: 'rent',
  type: 'expense',
  title: 'Rent',
  amount: 1200,
  category: 'Rent',
  date: '2026-08-15',
  description: '',
  recurring: true,
  ...over,
})

describe('applyRecurring', () => {
  it('creates one copy per elapsed month up to today', () => {
    const result = applyRecurring([template()], '2026-11-22')
    const copies = result.filter((e) => e.recurringSourceId === 'rent')
    expect(copies.map((e) => e.date)).toEqual(['2026-09-15', '2026-10-15', '2026-11-15'])
    expect(copies.every((e) => !e.recurring && e.id !== 'rent')).toBe(true)
    expect(result.find((e) => e.id === 'rent').lastGenerated).toBe('2026-11')
  })

  it('is idempotent', () => {
    const once = applyRecurring([template()], '2026-11-22')
    const twice = applyRecurring(once, '2026-11-22')
    expect(twice).toBe(once)
  })

  it('does not regenerate a copy the user deleted', () => {
    const once = applyRecurring([template()], '2026-11-22')
    const withoutOctober = once.filter((e) => e.date !== '2026-10-15')
    expect(applyRecurring(withoutOctober, '2026-11-22')).toHaveLength(withoutOctober.length)
  })

  it('does not create an entry dated after today', () => {
    const result = applyRecurring([template({ date: '2026-10-28' })], '2026-11-22')
    expect(result.filter((e) => e.recurringSourceId)).toHaveLength(0)
  })

  it('clamps the day for short months', () => {
    const result = applyRecurring([template({ date: '2026-01-31' })], '2026-03-31')
    expect(result.filter((e) => e.recurringSourceId).map((e) => e.date)).toEqual([
      '2026-02-28',
      '2026-03-31',
    ])
  })

  it('leaves non-recurring entries untouched', () => {
    const list = [template({ recurring: false })]
    expect(applyRecurring(list, '2026-11-22')).toBe(list)
  })
})
