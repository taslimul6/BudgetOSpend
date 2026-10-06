import { CURRENCIES, DEFAULT_SETTINGS } from "../constants/settings";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function currencySymbol(currency) {
  return (CURRENCIES[currency] || CURRENCIES[DEFAULT_SETTINGS.currency]).symbol;
}

export function formatMoney(amount, currency) {
  const value = Number.isFinite(amount) ? amount : 0;
  const sign = value < 0 ? "-" : "";
  return `${sign}${currencySymbol(currency)}${numberFormatter.format(Math.abs(value))}`;
}
