import { describe, expect, it } from 'vitest'
import { createInitialState, expenseReducer } from './reducer'
import { saveState } from '../utils/storage'

const item = (over = {}) => ({
  id: 'x1',
  type: 'expense',
  title: 'Tea',
  amount: 3,
  category: 'Food',
  date: '2026-11-10',
  description: '',
  recurring: false,
  ...over,
})

describe('createInitialState', () => {
  it('seeds demo data and defaults to the latest month with records', () => {
    const state = createInitialState()
    expect(state.expenses.length).toBeGreaterThan(0)
    expect(state.filters.selectedMonth).toBe('2026-08')
    expect(state.settings.budgetLimit).toBe(4000)
  })

  it('restores persisted data instead of the seed', () => {
    saveState({
      expenses: [item()],
      settings: { budgetLimit: 99, currency: 'BDT', theme: 'dark' },
    })
    const state = createInitialState()
    expect(state.expenses).toHaveLength(1)
    expect(state.settings).toMatchObject({ budgetLimit: 99, currency: 'BDT', theme: 'dark' })
    expect(state.filters.selectedMonth).toBe('2026-11')
  })
})

describe('expenseReducer', () => {
  const empty = () => ({ ...createInitialState(), expenses: [] })

  it('adds, updates, deletes and restores', () => {
    let state = empty()
    state = expenseReducer(state, { type: 'ADD_EXPENSE', payload: item() })
    expect(state.expenses).toHaveLength(1)

    state = expenseReducer(state, { type: 'UPDATE_EXPENSE', payload: item({ title: 'Coffee' }) })
    expect(state.expenses[0].title).toBe('Coffee')

    state = expenseReducer(state, { type: 'DELETE_EXPENSE', payload: 'x1' })
    expect(state.expenses).toHaveLength(0)

    state = expenseReducer(state, { type: 'RESTORE_EXPENSE', payload: item() })
    state = expenseReducer(state, { type: 'RESTORE_EXPENSE', payload: item() })
    expect(state.expenses).toHaveLength(1)
  })

  it('backfills past months when a recurring entry is added', () => {
    const state = expenseReducer(empty(), {
      type: 'ADD_EXPENSE',
      payload: item({ recurring: true, date: '2026-09-05' }),
    })
    expect(state.expenses.map((x) => x.date).sort()).toEqual([
      '2026-09-05',
      '2026-10-05',
      '2026-11-05',
    ])
    expect(state.expenses.find((x) => x.recurring).lastGenerated).toBe('2026-11')
  })

  it('opens the modal for new vs. edit and clears edit state on close', () => {
    let state = expenseReducer(createInitialState(), { type: 'OPEN_MODAL', payload: item() })
    expect(state.ui).toMatchObject({ isExpenseModalOpen: true, editExpense: item() })
    state = expenseReducer(state, { type: 'CLOSE_MODAL' })
    expect(state.ui).toMatchObject({ isExpenseModalOpen: false, editExpense: null })
  })

  it('resets the category when the type filter changes', () => {
    let state = expenseReducer(createInitialState(), { type: 'SET_CATEGORY_FILTER', payload: 'Food' })
    state = expenseReducer(state, { type: 'SET_TYPE_FILTER', payload: 'income' })
    expect(state.filters).toMatchObject({ typeFilter: 'income', selectedCategory: 'All' })
  })

  it('RESET_FILTERS restores defaults including the month', () => {
    let state = createInitialState()
    state = expenseReducer(state, { type: 'SET_SEARCH', payload: 'abc' })
    state = expenseReducer(state, { type: 'SET_MONTH', payload: '2020-01' })
    state = expenseReducer(state, { type: 'RESET_FILTERS' })
    expect(state.filters).toMatchObject({
      searchQuery: '',
      selectedMonth: '2026-08',
      sortBy: 'date-desc',
    })
  })

  it('imports in merge and replace modes', () => {
    const base = { ...createInitialState(), expenses: [item({ id: 'a' })] }
    const incoming = [item({ id: 'a', title: 'dup' }), item({ id: 'b', title: 'new' })]

    const merged = expenseReducer(base, {
      type: 'IMPORT_EXPENSES',
      payload: { expenses: incoming, mode: 'merge' },
    })
    expect(merged.expenses.map((x) => x.id)).toEqual(['a', 'b'])
    expect(merged.expenses[0].title).toBe('Tea')

    const replaced = expenseReducer(base, {
      type: 'IMPORT_EXPENSES',
      payload: { expenses: incoming, mode: 'replace' },
    })
    expect(replaced.expenses.map((x) => x.title)).toEqual(['dup', 'new'])
  })

  it('validates settings updates and toggles the theme', () => {
    let state = expenseReducer(createInitialState(), {
      type: 'UPDATE_SETTINGS',
      payload: { budgetLimit: -5, currency: 'EUR' },
    })
    expect(state.settings).toMatchObject({ budgetLimit: 4000, currency: 'EUR' })
    state = expenseReducer(state, { type: 'TOGGLE_THEME' })
    expect(state.settings.theme).toBe('dark')
  })
})
