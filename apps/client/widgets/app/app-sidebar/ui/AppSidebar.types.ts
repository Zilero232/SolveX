export type AppSidebarOrientation = 'vertical' | 'horizontal';

export type AppSidebarProps = {
  channelsOpened: boolean;
  onToggleChannels: () => void;
  orientation?: AppSidebarOrientation;
  showToggleChannels?: boolean;
  onNavigate?: () => void;
};
