export const languageSwitcherStyles = {
  // Pill-shaped trigger: flag + chevron, sized to its content rather than a
  // tight square so the flag has room to breathe. Border + subtle hover make
  // it read as an interactive control, matching the app's other buttons.
  trigger:
    'flex h-7 items-center gap-1.5 rounded-md border border-border bg-transparent pr-1.5 pl-2 text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-foreground',
  // Flags are 4:3 — fixing the width keeps them from stretching; rounded
  // corners and a hairline border match the app's control styling.
  triggerFlag: 'h-3.5 w-[1.17rem] shrink-0 rounded-[2px] object-cover ring-1 ring-border',
  // Chevron rotates when the menu opens — a small affordance cue.
  triggerChevron: 'size-3.5 shrink-0 transition-transform data-[state=open]:rotate-180',
  content: 'min-w-44',
  itemFlag: 'h-3 w-4 rounded-[2px] object-cover ring-1 ring-border',
  itemLabel: 'flex-1',
} as const;
