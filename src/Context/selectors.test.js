import { describe, expect, it } from 'vitest'
import {
  ALL_MONTHS,
  computeTotals,
  countMonths,
  defaultMonth,
  getFilteredExpenses,
  getMonthExpenses,
} from './selectors'

const e = (id, over) => ({
  id,
  type: 'expense',
  title: `item ${id}`,
  amount: 10,
  category: 'Food',
  date: '2026-08-10',
  description: '',
  recurring: false,
  ...over,
})

const list = [
  e('1', { title: 'Grocery run', amount: 50, date: '2026-08-05', description: 'vegetables' }),
  e('2', { title: 'Cinema', amount: 20, category: 'Entertainment', date: '2026-08-20' }),
  e('3', { title: 'Salary', amount: 3000, type: 'income', category: 'Salary', date: '2026-08-01' }),
  e('4', { title: 'Coffee', amount: 5, date: '2026-09-02' }),
]

const filters = { typeFilter: 'All', selectedCategory: 'All', sortBy: 'date-desc', searchQuery: '' }

describe('getMonthExpenses', () => {
  it('scopes to a month or returns everything for "all"', () => {
    expect(getMonthExpenses(list, '2026-08')).toHaveLength(3)
    expect(getMonthExpenses(list, ALL_MONTHS)).toHaveLength(4)
  })
})

describe('getFilteredExpenses', () => {
  const ids = (f) => getFilteredExpenses(list, { ...filters, ...f }).map((x) => x.id)

  it('filters by type and category', () => {
    expect(ids({ typeFilter: 'income' })).toEqual(['3'])
    expect(ids({ selectedCategory: 'Entertainment' })).toEqual(['2'])
  })

  it('searches title, description and category case-insensitively', () => {
    expect(ids({ searchQuery: 'GROCERY' })).toEqual(['1'])
    expect(ids({ searchQuery: 'vegetab' })).toEqual(['1'])
    expect(ids({ searchQuery: 'entertain' })).toEqual(['2'])
    expect(ids({ searchQuery: '   ' })).toHaveLength(4)
  })

  it('sorts by date and amount', () => {
    expect(ids({ sortBy: 'date-desc' })).toEqual(['4', '2', '1', '3'])
    expect(ids({ sortBy: 'date-asc' })).toEqual(['3', '1', '2', '4'])
    expect(ids({ sortBy: 'amount-desc' })).toEqual(['3', '1', '2', '4'])
    expect(ids({ sortBy: 'amount-asc' })).toEqual(['4', '2', '1', '3'])
  })

  it('does not mutate its input', () => {
    const copy = [...list]
    ids({ sortBy: 'amount-asc' })
    expect(list).toEqual(copy)
  })
})

describe('defaultMonth', () => {
  it('prefers the current month when it has data', () => {
    expect(defaultMonth([e('1', { date: '2026-11-03' }), e('2')], '2026-11-22')).toBe('2026-11')
  })
  it('otherwise uses the latest month with data', () => {
    expect(defaultMonth(list, '2026-11-22')).toBe('2026-09')
  })
  it('falls back to the current month when empty', () => {
    expect(defaultMonth([], '2026-11-22')).toBe('2026-11')
  })
})

describe('computeTotals / countMonths', () => {
  it('splits income, expense and per-category totals', () => {
    const totals = computeTotals(list)
    expect(totals.income).toBe(3000)
    expect(totals.expense).toBe(75)
    expect(totals.expenseCount).toBe(3)
    expect(totals.balance).toBe(2925)
    expect(totals.byCategory).toEqual({ Food: 55, Entertainment: 20 })
  })
  it('counts distinct months (min 1)', () => {
    expect(countMonths(list)).toBe(2)
    expect(countMonths([])).toBe(1)
  })
})
