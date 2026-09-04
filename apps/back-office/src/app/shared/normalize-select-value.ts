/** Minimal option shape shared by inline-select and form remaps. */
export interface SelectOptionLike {
  value: string;
  label: string;
}

/**
 * Map a stored select value to the canonical option.value.
 * Matches case-insensitively on value or label (legacy forms may store labels).
 */
export function normalizeSelectValue(
  value: string | null | undefined,
  options: readonly SelectOptionLike[],
): string {
  const current = (value ?? '').trim();
  if (!current || !options.length) {
    return current;
  }
  const lower = current.toLowerCase();
  const byValue = options.find((row) => row.value.toLowerCase() === lower);
  if (byValue) {
    return byValue.value;
  }
  const byLabel = options.find((row) => row.label.toLowerCase() === lower);
  if (byLabel) {
    return byLabel.value;
  }
  return current;
}

/** Resolve a display label for a stored value (value or label match). */
export function resolveSelectLabel(
  value: string | null | undefined,
  options: readonly SelectOptionLike[],
  fallback = '',
): string {
  const current = (value ?? '').trim();
  if (!current) {
    return fallback;
  }
  const lower = current.toLowerCase();
  const match =
    options.find((row) => row.value.toLowerCase() === lower) ??
    options.find((row) => row.label.toLowerCase() === lower);
  return match?.label ?? current;
}
