export const chatComposerStyles = {
  root: 'flex items-end gap-2 border-t border-white/8 bg-white/3 p-2.5',
  input:
    'min-h-9 max-h-32 flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground shadow-inner shadow-black/20 outline-none backdrop-blur-md transition-all placeholder:text-muted-foreground hover:border-white/20 focus-visible:border-brand-violet/60 focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-brand-violet/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
} as const;
