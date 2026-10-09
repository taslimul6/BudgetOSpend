import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderApp, seedStorage } from './test/renderApp'
import { STORAGE_KEY } from './constants/settings'

const savedState = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY))

const expense = (id, over = {}) => ({
  id,
  type: 'expense',
  title: `Item ${id}`,
  amount: 10,
  category: 'Food',
  date: '2026-11-05',
  description: '',
  recurring: false,
  ...over,
})

const dialog = () => screen.getByRole('dialog')
const monthPicker = () => screen.getByRole('group', { name: 'Month' })

async function fillAndSave(user, { title, amount, category, date, type }) {
  await user.click(screen.getByRole('button', { name: /^add$/i }))
  const form = within(dialog())
  if (type) await user.click(form.getByRole('button', { name: new RegExp(`^${type}$`, 'i') }))
  await user.type(form.getByLabelText(/^title/i), title)
  await user.type(form.getByLabelText(/^amount/i), String(amount))
  await user.selectOptions(form.getByLabelText(/^category/i), category)
  if (date) fireEvent.change(form.getByLabelText(/^date/i), { target: { value: date } })
  await user.click(form.getByRole('button', { name: /^save$/i }))
}

describe('dashboard', () => {
  it('shows the seed data for the latest month with records', () => {
    renderApp()
    expect(monthPicker()).toHaveTextContent('August 2026')
    expect(screen.getByText('7 Records')).toBeInTheDocument()
    expect(screen.getByText('$2,845.00', { selector: '#totalExpenseDisplay' })).toBeInTheDocument()
    expect(screen.getByText('$3,500.00', { selector: '#totalIncomeDisplay' })).toBeInTheDocument()
    expect(screen.getByText('$655.00', { selector: '#balanceDisplay' })).toBeInTheDocument()
    expect(screen.getByText('$1,155.00', { selector: '#budgetRemainingDisplay' })).toBeInTheDocument()
  })

  it('shows the empty state when there is nothing at all', () => {
    seedStorage([], { budgetLimit: 4000, currency: 'USD', theme: 'light' })
    renderApp()
    expect(screen.getByText('List is empty!')).toBeInTheDocument()
  })
})

describe('adding, editing and validating', () => {
  it('adds an expense, shows it and persists it', async () => {
    const { user } = renderApp()
    await fillAndSave(user, {
      title: 'Bus pass',
      amount: 45.5,
      category: 'Other',
      date: '2026-08-12',
    })

    expect(await screen.findByText('Bus pass')).toBeInTheDocument()
    expect(screen.getByText('8 Records')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() =>
      expect(savedState().expenses.some((e) => e.title === 'Bus pass' && e.amount === 45.5)).toBe(true)
    )
  })

  it('adds income with income categories', async () => {
    const { user } = renderApp()
    await fillAndSave(user, {
      type: 'income',
      title: 'Side gig',
      amount: 500,
      category: 'Freelance',
      date: '2026-08-14',
    })
    expect(await screen.findByText('Side gig')).toBeInTheDocument()
    expect(screen.getByText('$4,000.00', { selector: '#totalIncomeDisplay' })).toBeInTheDocument()
  })

  it('shows field errors for an empty form and does not save', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    await user.click(within(dialog()).getByRole('button', { name: /^save$/i }))

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Amount is required')).toBeInTheDocument()
    expect(screen.getByText('Category is required')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('7 Records')).toBeInTheDocument()
  })

  it('rejects a one-character title and a zero amount', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    const form = within(dialog())
    await user.type(form.getByLabelText(/^title/i), 'x')
    await user.type(form.getByLabelText(/^amount/i), '0')
    await user.click(form.getByRole('button', { name: /^save$/i }))

    expect(await screen.findByText('Title must be at least 2 characters')).toBeInTheDocument()
    expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
  })

  it('pre-fills the form when editing and saves changes', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Edit Weekend Cinema & Dinner' }))

    const form = within(dialog())
    const title = form.getByLabelText(/^title/i)
    expect(title).toHaveValue('Weekend Cinema & Dinner')
    expect(form.getByLabelText(/^amount/i)).toHaveValue(150)
    expect(form.getByLabelText(/^date/i)).toHaveValue('2026-08-20')

    await user.clear(title)
    await user.type(title, 'Theatre night')
    await user.click(form.getByRole('button', { name: /^update$/i }))

    expect(await screen.findByText('Theatre night')).toBeInTheDocument()
    expect(screen.queryByText('Weekend Cinema & Dinner')).not.toBeInTheDocument()
    expect(screen.getByText('7 Records')).toBeInTheDocument()
  })

  it('closes the modal with Escape and returns focus to the opener', async () => {
    const { user } = renderApp()
    const opener = screen.getByRole('button', { name: /^add$/i })
    await user.click(opener)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })

  it('keeps Tab focus inside the dialog', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    for (let i = 0; i < 15; i++) await user.tab()
    expect(dialog().contains(document.activeElement)).toBe(true)
  })
})

describe('deleting', () => {
  it('asks for confirmation, deletes, and can undo', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Delete Monthly House Rent' }))

    // Cancel first: nothing is removed.
    await user.click(within(dialog()).getByRole('button', { name: /cancel/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('Monthly House Rent')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Monthly House Rent' }))
    await user.click(within(dialog()).getByRole('button', { name: /^delete$/i }))

    await waitFor(() => expect(screen.queryByText('Monthly House Rent')).not.toBeInTheDocument())
    expect(screen.getByText('6 Records')).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(await screen.findByText('Monthly House Rent')).toBeInTheDocument()
    expect(screen.getByText('7 Records')).toBeInTheDocument()
  })
})

describe('filtering', () => {
  it('filters by category pill and resets', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: /food/i, pressed: false }))
    expect(screen.getByText('1 Records')).toBeInTheDocument()
    expect(screen.getByText('Supermarket Grocery & Supplies')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset filters/i }))
    expect(screen.getByText('7 Records')).toBeInTheDocument()
  })

  it('filters by type', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Income' }))
    expect(screen.getByText('1 Records')).toBeInTheDocument()
    expect(screen.getByText('Monthly Salary')).toBeInTheDocument()
  })

  it('searches after a debounce and shows a not-found state', async () => {
    const { user } = renderApp()
    const [search] = screen.getAllByLabelText('Search expenses')
    await user.type(search, 'cinema')

    await waitFor(() => expect(screen.getByText('1 Records')).toBeInTheDocument())
    expect(screen.getByText('Weekend Cinema & Dinner')).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'zzzz')
    expect(await screen.findByText('Not Found')).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: /clear search/i })[0])
    await waitFor(() => expect(screen.getByText('7 Records')).toBeInTheDocument())
  })

  it('sorts by amount', async () => {
    const { user } = renderApp()
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'amount-desc')
    const titles = within(document.getElementById('expenseListContainer'))
      .getAllByRole('heading', { level: 4 })
      .map((h) => h.textContent)
    expect(titles[0]).toBe('Monthly Salary')
    expect(titles[1]).toBe('Monthly House Rent')
  })

  it('navigates months and explains an empty month', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(monthPicker()).toHaveTextContent('September 2026')
    expect(await screen.findByText('Nothing recorded for September 2026 yet.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show all time' }))
    expect(screen.getByText('7 Records')).toBeInTheDocument()
  })
})

describe('pagination', () => {
  it('shows 10 at a time and loads more', async () => {
    seedStorage(
      Array.from({ length: 12 }, (_, i) => expense(`e${i}`, { title: `Entry ${i}` })),
      { budgetLimit: 4000, currency: 'USD', theme: 'light' }
    )
    const { user } = renderApp()

    expect(screen.getByText('12 Records')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(10)

    await user.click(screen.getByRole('button', { name: 'Load more (2 remaining)' }))
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(12)
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
  })
})

describe('recurring entries', () => {
  it('generates monthly copies when the app loads', () => {
    seedStorage(
      [expense('rent', { title: 'Rent', category: 'Rent', amount: 1000, date: '2026-09-10', recurring: true })],
      { budgetLimit: 4000, currency: 'USD', theme: 'light' }
    )
    renderApp()

    // Current month (Nov) is selected and holds the generated copy.
    expect(screen.getByRole('heading', { level: 4, name: 'Rent' })).toBeInTheDocument()
    expect(screen.getByText('Auto')).toBeInTheDocument()
    expect(savedState().expenses.filter((e) => e.title === 'Rent')).toHaveLength(3)
  })
})

describe('settings and theme', () => {
  it('toggles and persists dark mode', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    await waitFor(() => expect(savedState().settings.theme).toBe('dark'))
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })

  it('changes the budget and currency', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    const form = within(dialog())
    const budget = form.getByLabelText(/monthly budget limit/i)
    await user.clear(budget)
    await user.type(budget, '5000')
    await user.selectOptions(form.getByLabelText(/currency/i), 'EUR')
    await user.click(form.getByRole('button', { name: /save settings/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('€2,155.00', { selector: '#budgetRemainingDisplay' })).toBeInTheDocument()
    expect(savedState().settings).toMatchObject({ budgetLimit: 5000, currency: 'EUR' })
  })

  it('rejects an invalid budget', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Open settings' }))
    const budget = within(dialog()).getByLabelText(/monthly budget limit/i)
    await user.clear(budget)
    await user.type(budget, '0')
    await user.click(within(dialog()).getByRole('button', { name: /save settings/i }))

    expect(await screen.findByText('Budget must be greater than 0')).toBeInTheDocument()
    expect(savedState().settings.budgetLimit).toBe(4000)
  })

  it('imports a JSON backup in merge mode, skipping invalid rows', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    const payload = JSON.stringify({
      expenses: [
        { id: 'imp1', title: 'Imported coffee', amount: 4, category: 'Food', date: '2026-08-02' },
        { id: 'bad', title: '', amount: 4, date: '2026-08-02' },
      ],
    })
    const file = new File([payload], 'backup.json', { type: 'application/json' })
    await user.click(within(dialog()).getByRole('button', { name: /import & merge/i }))
    await user.upload(within(dialog()).getByLabelText('Import file'), file)

    await waitFor(() =>
      expect(savedState().expenses.some((e) => e.title === 'Imported coffee')).toBe(true)
    )
    expect(savedState().expenses).toHaveLength(8)
  })
})
