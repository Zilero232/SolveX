export const chatPanelStyles = {
  root: 'fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l bg-sidebar shadow-2xl transition-transform duration-300 ease-out data-[open=false]:pointer-events-none data-[open=false]:translate-x-full data-[open=true]:translate-x-0',
  scroll: 'min-h-0 flex-1 overflow-y-auto',
  list: 'flex flex-col gap-3 p-3',
} as const;
