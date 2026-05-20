export const chatComposerStyles = {
  root: 'flex items-end gap-2 border-t bg-sidebar-accent/30 p-2',
  input:
    'min-h-9 max-h-32 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
} as const;
