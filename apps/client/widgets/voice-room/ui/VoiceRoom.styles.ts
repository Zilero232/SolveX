export const voiceRoomStyles = {
  root: 'h-full p-4',
  frame: 'flex h-full flex-col overflow-hidden rounded-lg border bg-card',
  room: 'flex h-full flex-col',
  header: 'flex items-center gap-2 border-b px-4 py-3',
  headerIcon: 'size-4 text-muted-foreground',
  headerTitle: 'flex-1 truncate font-semibold text-sm',
  body: 'flex min-h-0 flex-1 flex-col',
  controls: 'flex justify-center border-t p-2',
} as const;
