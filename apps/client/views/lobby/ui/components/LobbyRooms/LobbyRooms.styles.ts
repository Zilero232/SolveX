export const lobbyRoomsStyles = {
  root: 'flex flex-col gap-3',

  bar: 'flex flex-wrap items-center justify-between gap-3',
  heading: 'font-semibold text-base text-foreground/90',

  searchField:
    'group relative flex h-10 w-full items-center gap-2 rounded-xl border border-white/12 bg-white/5 pr-2 pl-3.5 shadow-inner shadow-black/20 backdrop-blur-md transition-all hover:border-white/20 focus-within:border-brand-cyan/60 focus-within:bg-white/8 focus-within:ring-2 focus-within:ring-brand-cyan/25 sm:w-72',
  searchIcon:
    'size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-brand-cyan',
  searchInput:
    'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0',
  searchShortcut:
    'hidden shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex',

  sections: 'flex flex-col gap-6',
  section: 'flex flex-col gap-3',
  sectionLabel: 'font-semibold text-foreground/70 text-xs uppercase tracking-[0.14em]',

  grid: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',

  loader: 'flex justify-center py-12',
  loaderIcon: 'size-5 animate-spin text-muted-foreground',

  nothingFound: 'py-12 text-center text-muted-foreground text-sm',
} as const;
