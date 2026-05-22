export const lobbyRoomsStyles = {
  root: 'flex flex-col gap-3',

  // Heading on the left, search on the right; wraps on narrow widths.
  bar: 'flex flex-wrap items-center justify-between gap-3',
  heading: 'font-semibold text-sm text-muted-foreground',

  searchField: 'relative w-full sm:w-64',
  searchIcon:
    'pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground',
  searchInput: 'pl-8',

  // Rooms split into Public / Private sections, each with a heading.
  sections: 'flex flex-col gap-6',
  section: 'flex flex-col gap-3',
  sectionLabel: 'font-semibold text-muted-foreground text-xs uppercase tracking-wide',

  grid: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3',

  loader: 'flex justify-center py-12',
  loaderIcon: 'size-5 animate-spin text-muted-foreground',

  nothingFound: 'py-12 text-center text-muted-foreground text-sm',
} as const;
