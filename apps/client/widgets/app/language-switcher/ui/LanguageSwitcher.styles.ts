export const languageSwitcherStyles = {
  trigger:
    'flex h-7 items-center gap-1.5 rounded-md border border-border bg-transparent pr-1.5 pl-2 text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-foreground',
  triggerFlag: 'h-3.5 w-[1.17rem] shrink-0 rounded-[2px] object-cover ring-1 ring-border',
  triggerChevron: 'size-3.5 shrink-0 transition-transform data-[state=open]:rotate-180',
  content: 'min-w-44',
  itemFlag: 'h-3 w-4 rounded-[2px] object-cover ring-1 ring-border',
  itemLabel: 'flex-1',
} as const;
