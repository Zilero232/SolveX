export const chatPanelStyles = {
  root: 'glass-strong absolute inset-0 z-40 flex w-full flex-col rounded-none border-0 border-white/8 border-l shadow-none transition-transform duration-300 ease-out data-[open=false]:pointer-events-none data-[open=false]:translate-x-full data-[open=true]:translate-x-0 sm:left-auto sm:w-96',
  scroll: 'min-h-0 flex-1 overflow-y-auto',
  list: 'flex flex-col gap-3 p-3',
} as const;
