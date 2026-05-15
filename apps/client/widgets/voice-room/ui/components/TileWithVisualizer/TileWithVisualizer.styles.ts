export const tileWithVisualizerStyles = {
  root: 'relative h-full w-full',
  visualizer:
    'pointer-events-none absolute inset-x-0 bottom-2 mx-auto flex h-10 w-24 items-end justify-center gap-1',
  bar: 'w-2 rounded-sm bg-white/40 transition-colors data-[lk-highlighted=true]:bg-indigo-500',
} as const;
