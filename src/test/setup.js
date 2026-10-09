import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  // Pin "today" so month defaults and recurring generation are deterministic.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 10, 22, 12, 0, 0))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
