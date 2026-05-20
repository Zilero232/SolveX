const UNITS = ['B', 'KB', 'MB', 'GB'] as const;

export const formatBytes = (bytes: number, fractionDigits = 1): string => {
  if (bytes <= 0) return '0 B';

  const exponent = Math.min(Math.floor(Math.log10(bytes) / 3), UNITS.length - 1);
  const value = bytes / 10 ** (exponent * 3);

  return `${value.toFixed(fractionDigits)} ${UNITS[exponent]}`;
};
