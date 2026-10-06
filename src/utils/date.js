const pad = (n) => String(n).padStart(2, "0");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function isISODate(value) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// Accepts an ISO date or any string `Date` can parse (legacy "Aug 25, 2026").
export function parseToISO(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  if (isISODate(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : toISODate(parsed);
}

export function toMonthKey(iso) {
  return iso.slice(0, 7);
}

function fromISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(iso) {
  return isISODate(iso) ? dateFormatter.format(fromISO(iso)) : iso;
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatMonth(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  return monthFormatter.format(new Date(y, m - 1, 1));
}

export function addMonths(monthKey, n) {
  const [y, m] = monthKey.split("-").map(Number);
  const date = new Date(y, m - 1 + n, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function daysInMonth(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

// Days remaining in the month including today, or null when the month is not
// the current one.
export function daysLeftInMonth(monthKey, today = todayISO()) {
  if (toMonthKey(today) !== monthKey) return null;
  return daysInMonth(monthKey) - Number(today.slice(8, 10)) + 1;
}

export function makeDate(monthKey, day) {
  return `${monthKey}-${pad(Math.min(day, daysInMonth(monthKey)))}`;
}
