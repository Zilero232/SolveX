export const voiceRoomStyles = {
  root: 'h-full p-4',
  frame: 'flex h-full flex-col overflow-hidden rounded-lg border bg-card',
  room: 'flex h-full flex-col',
  header: 'flex items-center gap-2 border-b px-4 py-3',
  headerTitle: 'flex-1 truncate font-semibold text-sm',
  // `relative` anchors the ConnectingOverlay, which covers the grid until the
  // LiveKit connection is established.
  body: 'relative flex min-h-0 flex-1 flex-col',

  // ControlBar centred; the chat toggle pinned to the right edge.
  controls: 'relative flex items-center justify-center border-t p-2',
  controlBar: 'flex justify-center',
  // In PTT mode the LiveKit mic toggle would let the user manually unmute,
  // contradicting the "only on key-hold" contract — hide it.
  controlBarPttHideMic: '[&_button[data-lk-source="microphone"]]:hidden',
  chatButton: 'absolute right-2',
} as const;
