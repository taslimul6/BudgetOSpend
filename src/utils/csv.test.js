import { describe, expect, it } from 'vitest'
import { expensesToCSV } from './csv'

const base = {
  id: '1',
  type: 'expense',
  amount: 2.5,
  category: 'Food',
  date: '2026-01-02',
  description: '',
  recurring: false,
}

describe('expensesToCSV', () => {
  it('writes a header and quotes cells', () => {
    const csv = expensesToCSV([{ ...base, title: 'Tea, "green"' }])
    const [header, row] = csv.split('\r\n')
    expect(header).toBe('id,type,title,amount,category,date,description,recurring')
    expect(row).toBe('"1","expense","Tea, ""green""","2.5","Food","2026-01-02","","false"')
  })

  it('neutralises spreadsheet formulas', () => {
    const csv = expensesToCSV([{ ...base, title: '=SUM(A1)' }])
    expect(csv).toContain('"\'=SUM(A1)"')
  })
})
