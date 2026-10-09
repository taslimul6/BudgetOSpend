import { describe, expect, it } from 'vitest'
import { normalizeExpense, normalizeExpenses, normalizeSettings } from './normalize'
import { loadState, saveState } from './storage'
import { STORAGE_KEY } from '../constants/settings'

describe('normalizeExpense', () => {
  it('migrates the legacy shape (numeric id, display date, no type)', () => {
    const result = normalizeExpense({
      id: 1,
      title: 'Rent',
      category: 'Rent',
      amount: 1200,
      date: 'Aug 1, 2026',
      description: 'Lease',
      icon: '🏠',
    })
    expect(result).toEqual({
      id: '1',
      type: 'expense',
      title: 'Rent',
      amount: 1200,
      category: 'Rent',
      date: '2026-08-01',
      description: 'Lease',
      recurring: false,
    })
  })

  it('rejects records that cannot be salvaged', () => {
    expect(normalizeExpense(null)).toBeNull()
    expect(normalizeExpense({ title: '', amount: 5, date: '2026-01-01' })).toBeNull()
    expect(normalizeExpense({ title: 'x', amount: -5, date: '2026-01-01' })).toBeNull()
    expect(normalizeExpense({ title: 'x', amount: 5, date: 'nope' })).toBeNull()
  })

  it('falls back to a matching "Other" category for unknown or mismatched ones', () => {
    expect(
      normalizeExpense({ title: 'x', amount: 1, date: '2026-01-01', category: 'Nope' }).category
    ).toBe('Other')
    expect(
      normalizeExpense({ title: 'x', amount: 1, date: '2026-01-01', type: 'income', category: 'Food' })
        .category
    ).toBe('Other Income')
  })

  it('drops duplicate ids and invalid rows from a list', () => {
    const list = normalizeExpenses([
      { id: 'a', title: 'one', amount: 1, date: '2026-01-01' },
      { id: 'a', title: 'dup', amount: 1, date: '2026-01-01' },
      { id: 'b', title: '', amount: 1, date: '2026-01-01' },
    ])
    expect(list.map((e) => e.title)).toEqual(['one'])
  })
})

describe('normalizeSettings', () => {
  it('keeps valid values and repairs invalid ones', () => {
    expect(normalizeSettings({ budgetLimit: 500, currency: 'BDT', theme: 'dark' })).toEqual({
      budgetLimit: 500,
      currency: 'BDT',
      theme: 'dark',
    })
    expect(normalizeSettings({ budgetLimit: -1, currency: 'ZZZ', theme: 'blue' })).toEqual({
      budgetLimit: 4000,
      currency: 'USD',
      theme: 'light',
    })
  })
})

describe('storage', () => {
  it('round-trips state through localStorage', () => {
    const expenses = [
      {
        id: 'a',
        type: 'expense',
        title: 'Tea',
        amount: 2,
        category: 'Food',
        date: '2026-01-02',
        description: '',
        recurring: false,
      },
    ]
    const settings = { budgetLimit: 10, currency: 'EUR', theme: 'dark' }
    saveState({ expenses, settings })
    expect(loadState()).toEqual({ expenses, settings })
  })

  it('returns null for missing or corrupt data', () => {
    expect(loadState()).toBeNull()
    window.localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState()).toBeNull()
  })

  it('migrates legacy records found in storage', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        expenses: [{ id: 7, title: 'Old', amount: 3, date: 'Aug 5, 2026', category: 'Food' }],
      })
    )
    expect(loadState().expenses[0]).toMatchObject({ id: '7', date: '2026-08-05', type: 'expense' })
  })
})
