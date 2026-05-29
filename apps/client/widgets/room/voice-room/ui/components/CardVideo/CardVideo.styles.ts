export const cardVideoStyles = {
  pane: 'group/pane relative min-w-0 cursor-pointer overflow-hidden bg-black',
  video: 'h-full w-full object-contain',
  videoMirrored: 'h-full w-full scale-x-[-1] object-contain',

  fullscreenHint:
    'absolute top-2 right-2 rounded-md border border-white/10 bg-black/55 p-1 text-white opacity-0 backdrop-blur-md transition-opacity group-hover/pane:opacity-100',
  hintIcon: 'size-4',
} as const;
