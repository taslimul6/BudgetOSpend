import { addMonths, makeDate, toMonthKey, todayISO } from "./date";
import { newId } from "./id";

const MAX_GENERATED_PER_TEMPLATE = 120;

// For every recurring "template" entry, creates one copy per month that has
// elapsed since `lastGenerated` (up to the current month). Idempotent: running
// it again on its own output returns the same list. Deleting a generated copy
// does not bring it back, because progress is tracked on the template.
export function applyRecurring(expenses, today = todayISO()) {
  const currentMonth = toMonthKey(today);
  const additions = [];
  const progress = new Map();

  for (const template of expenses) {
    if (!template.recurring) continue;

    let last = template.lastGenerated || toMonthKey(template.date);
    const day = Number(template.date.slice(8, 10));
    let month = addMonths(last, 1);
    let count = 0;

    while (month <= currentMonth && count < MAX_GENERATED_PER_TEMPLATE) {
      const date = makeDate(month, day);
      if (date > today) break;

      // eslint-disable-next-line no-unused-vars
      const { lastGenerated, ...rest } = template;
      additions.push({
        ...rest,
        id: newId(),
        date,
        recurring: false,
        recurringSourceId: template.id,
      });
      last = month;
      month = addMonths(month, 1);
      count += 1;
    }

    if (last !== template.lastGenerated) {
      progress.set(template.id, last);
    }
  }

  if (additions.length === 0 && progress.size === 0) return expenses;

  const updated = expenses.map((e) =>
    progress.has(e.id) && e.lastGenerated !== progress.get(e.id)
      ? { ...e, lastGenerated: progress.get(e.id) }
      : e
  );
  return [...updated, ...additions];
}
