'use client';

import { isTauri } from '@tauri-apps/api/core';
import { DownloadAppButton, LobbyButton, LogoutButton, ToggleChannelsButton } from './components';
import { serverRailStyles as s } from './ServerRail.styles';
import type { ServerRailProps } from './ServerRail.types';

export const ServerRail = ({ channelsOpened, onToggleChannels }: ServerRailProps) => (
  <div className={s.root}>
    <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
    <LobbyButton />
    {!isTauri() && <DownloadAppButton />}
    <div className={s.spacer} />
    <LogoutButton />
  </div>
);
