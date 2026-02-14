/**
 * Formats a number as currency using Intl.NumberFormat.
 *
 * @param amount - The numeric amount to format
 * @param currency - ISO 4217 currency code (default: "USD")
 * @param locale - BCP 47 locale string (default: "en-US")
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a date string or Date object into a human-readable string.
 *
 * @param date - A Date object, ISO string, or timestamp
 * @param options - Intl.DateTimeFormatOptions for customization
 * @param locale - BCP 47 locale string (default: "en-US")
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  locale = "en-US",
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Formats a number with locale-aware grouping and decimal separators.
 *
 * @param value - The number to format
 * @param options - Intl.NumberFormatOptions for customization
 * @param locale - BCP 47 locale string (default: "en-US")
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
