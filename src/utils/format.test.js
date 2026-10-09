import { describe, expect, it } from 'vitest'
import { currencySymbol, formatMoney } from './format'

describe('formatMoney', () => {
  it('formats with symbol, grouping and two decimals', () => {
    expect(formatMoney(1234.5, 'USD')).toBe('$1,234.50')
    expect(formatMoney(0, 'BDT')).toBe('৳0.00')
  })

  it('puts the sign before the symbol', () => {
    expect(formatMoney(-20, 'EUR')).toBe('-€20.00')
  })

  it('falls back to USD for unknown currencies and 0 for non-numbers', () => {
    expect(currencySymbol('XXX')).toBe('$')
    expect(formatMoney(NaN, 'USD')).toBe('$0.00')
  })
})
