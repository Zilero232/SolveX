import { filter, first, isString, map, pipe } from 'remeda';

export const firstNonEmpty = (...values: (string | null | undefined)[]): string | null => {
  return (
    pipe(
      values,
      filter(isString),
      map((value) => value.trim()),
      filter((value) => value.length > 0),
      first(),
    ) ?? null
  );
};
