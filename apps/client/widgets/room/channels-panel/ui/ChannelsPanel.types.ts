export type ChannelsPanelVariant = 'desktop' | 'drawer';

export type ChannelsPanelProps = {
  variant?: ChannelsPanelVariant;
  onNavigate?: () => void;
};
