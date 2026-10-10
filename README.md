# BudgetOSpend

A clean, responsive expense and budget tracker with a bento-grid dashboard, built with React 19 and Tailwind CSS v4.

**[Live demo → budgetospend.vercel.app](https://budgetospend.vercel.app/)**

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Features

- **Expenses and income** — add, edit and delete, with an Undo after deleting
- **Monthly budget** — progress bar, remaining balance and a month selector
- **Filter, search and sort** — by category, type, text and amount or date
- **Recurring entries** — repeat a transaction every month automatically
- **Settings** — custom budget limit and currency (USD, BDT, EUR, GBP, INR)
- **Dark mode** — follows your system and remembers your choice
- **Your data stays yours** — saved in the browser, with JSON/CSV export and JSON import

## Getting Started

Requires Node.js 18+.

```bash
git clone https://github.com/<your-username>/budgetospend.git
cd budgetospend
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |
| `npm test` | Run the test suite (Vitest) |

## Project Structure

```
src/
├── Components/   # Modal, forms, settings, shared UI
├── Context/      # State: reducer, selectors, provider
├── Records/      # Transaction list and cards
├── constants/    # Categories, settings, seed data
├── utils/        # Dates, formatting, storage, recurring logic
└── test/         # Test setup and helpers
```

State is a single `useReducer` exposed through React Context and persisted to `localStorage`.

## Deployment

The app is a static site. Run `npm run build` and deploy the `dist/` folder to Vercel, Netlify or any static host.
