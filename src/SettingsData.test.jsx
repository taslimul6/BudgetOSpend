import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderApp } from './test/renderApp'
import { STORAGE_KEY } from './constants/settings'

const savedState = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY))
const dialog = () => screen.getByRole('dialog')

async function openSettings(user) {
  await user.click(screen.getByRole('button', { name: 'Open settings' }))
}

const backup = (expenses) =>
  new File([JSON.stringify({ expenses })], 'backup.json', { type: 'application/json' })

describe('settings: export', () => {
  const originalCreate = URL.createObjectURL
  const originalRevoke = URL.revokeObjectURL

  afterEach(() => {
    URL.createObjectURL = originalCreate
    URL.revokeObjectURL = originalRevoke
  })

  it('downloads a JSON backup containing every record', async () => {
    const created = []
    URL.createObjectURL = vi.fn((blob) => {
      created.push(blob)
      return 'blob:test'
    })
    URL.revokeObjectURL = vi.fn()

    const { user } = renderApp()
    await openSettings(user)
    await user.click(within(dialog()).getByRole('button', { name: /json \(full backup\)/i }))

    expect(created).toHaveLength(1)
    expect(created[0].type).toBe('application/json')
    const parsed = JSON.parse(await created[0].text())
    expect(parsed.expenses).toHaveLength(7)
    expect(parsed.settings).toMatchObject({ budgetLimit: 4000, currency: 'USD' })
  })

  it('downloads a CSV with a header row', async () => {
    const created = []
    URL.createObjectURL = vi.fn((blob) => {
      created.push(blob)
      return 'blob:test'
    })
    URL.revokeObjectURL = vi.fn()

    const { user } = renderApp()
    await openSettings(user)
    await user.click(within(dialog()).getByRole('button', { name: /csv \(spreadsheet\)/i }))

    const text = await created[0].text()
    expect(created[0].type).toBe('text/csv')
    expect(text.split('\r\n')[0]).toBe('id,type,title,amount,category,date,description,recurring')
    expect(text.split('\r\n')).toHaveLength(8)
  })
})

describe('settings: import', () => {
  const incoming = [
    { id: 'n1', title: 'Only record', amount: 9, category: 'Food', date: '2026-08-03' },
  ]

  it('asks before replacing everything and keeps data when cancelled', async () => {
    const { user } = renderApp()
    await openSettings(user)

    await user.click(within(dialog()).getByRole('button', { name: /import & replace all/i }))
    await user.upload(within(dialog()).getByLabelText('Import file'), backup(incoming))

    const confirm = await screen.findByRole('dialog', { name: 'Replace all records?' })
    expect(confirm).toHaveTextContent('remove your 7 current records')
    expect(confirm).toHaveTextContent('load 1 from the file')

    await user.click(within(confirm).getByRole('button', { name: /cancel/i }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Replace all records?' })).not.toBeInTheDocument()
    )
    expect(savedState().expenses).toHaveLength(7)
  })

  it('replaces all records after confirming', async () => {
    const { user } = renderApp()
    await openSettings(user)

    await user.click(within(dialog()).getByRole('button', { name: /import & replace all/i }))
    await user.upload(within(dialog()).getByLabelText('Import file'), backup(incoming))
    const confirm = await screen.findByRole('dialog', { name: 'Replace all records?' })
    await user.click(within(confirm).getByRole('button', { name: /^replace$/i }))

    await waitFor(() => expect(savedState().expenses.map((e) => e.title)).toEqual(['Only record']))
  })

  it('rejects a file that is not valid JSON', async () => {
    const { user } = renderApp()
    await openSettings(user)

    const bad = new File(['not json at all'], 'bad.json', { type: 'application/json' })
    await user.click(within(dialog()).getByRole('button', { name: /import & merge/i }))
    await user.upload(within(dialog()).getByLabelText('Import file'), bad)

    expect(await screen.findByText('That file is not valid JSON.')).toBeInTheDocument()
    expect(savedState().expenses).toHaveLength(7)
  })
})
