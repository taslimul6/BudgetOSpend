import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderApp } from './test/renderApp'

describe('record count announcement', () => {
  it('exposes the record count as a polite status region', async () => {
    const { user } = renderApp()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('7 Records')

    await user.click(screen.getByRole('button', { name: 'Income' }))
    expect(screen.getByRole('status')).toHaveTextContent('1 Records')
  })
})
