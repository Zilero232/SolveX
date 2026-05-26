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
  // PTT mode: keep the mic button visible but mute its colour so it reads as
  // "hotkey-driven" — not an interactive mute toggle.
  controlBarPttIdle:
    '[&_button[data-lk-source="microphone"]]:!bg-muted/40 [&_button[data-lk-source="microphone"]]:!text-muted-foreground',
  // PTT key currently held — solid emerald fill so the user has unambiguous
  // feedback they're transmitting right now.
  controlBarPttActive:
    '[&_button[data-lk-source="microphone"]]:!bg-emerald-500/15 [&_button[data-lk-source="microphone"]]:!text-emerald-300',
  chatButton: 'absolute right-2',
} as const;
