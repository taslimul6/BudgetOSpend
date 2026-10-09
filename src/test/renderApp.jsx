import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { ExpenseProvider } from '../Context'
import { STORAGE_KEY } from '../constants/settings'

export function seedStorage(expenses, settings) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, expenses, settings })
  )
}

export function renderApp() {
  const user = userEvent.setup()
  render(
    <ExpenseProvider>
      <App />
    </ExpenseProvider>
  )
  return { user }
}
