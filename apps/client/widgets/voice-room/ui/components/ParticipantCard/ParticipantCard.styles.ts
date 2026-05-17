export const participantCardStyles = {
  // Fixed 16:9 card; @container lets the avatar/initials scale with card size.
  root: '@container relative flex aspect-video w-full flex-col overflow-hidden rounded-md bg-neutral-900',
  // Media area fills the card; metadata overlays its bottom edge.
  stage: 'relative min-h-0 flex-1',
  // 1 video → single full pane; 2 videos → side-by-side split.
  videoGrid: 'grid h-full w-full auto-cols-fr grid-flow-col gap-0.5',

  // A single fullscreen-able video pane.
  videoPane: 'group/pane relative min-w-0 cursor-pointer overflow-hidden bg-black',
  video: 'h-full w-full object-contain',

  avatarSlot: 'flex h-full w-full items-center justify-center bg-neutral-800',
  avatar:
    'flex aspect-square w-[30cqmin] max-w-32 min-w-12 items-center justify-center rounded-full',
  avatarInitials: 'text-[12cqmin] font-medium text-white',

  fullscreenHint:
    'absolute top-2 right-2 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover/pane:opacity-100',
  hintIcon: 'size-4',

  metadata:
    'absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded bg-black/50 px-2 py-1 text-xs text-white',
  micIcon: 'size-3.5 shrink-0 text-red-400',
  name: 'truncate',

  visualizer:
    'pointer-events-none absolute inset-x-0 bottom-10 mx-auto flex h-10 w-24 items-end justify-center gap-1',
  bar: 'w-2 rounded-sm bg-white/40 transition-colors data-[lk-highlighted=true]:bg-indigo-500',
} as const;
