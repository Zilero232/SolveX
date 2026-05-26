'use client';

import { isTauri } from '@tauri-apps/api/core';
import { appSidebarStyles as s } from './AppSidebar.styles';
import {
  CheckUpdateButton,
  DownloadAppButton,
  GithubButton,
  LobbyButton,
  LogoutButton,
  ToggleChannelsButton,
} from './components';
import type { AppSidebarProps } from './AppSidebar.types';

export const AppSidebar = ({ channelsOpened, onToggleChannels }: AppSidebarProps) => (
  <div className={s.root}>
    <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
    <LobbyButton />
    {!isTauri() && <DownloadAppButton />}
    <div className={s.spacer} />
    <GithubButton />
    {isTauri() && <CheckUpdateButton />}
    <LogoutButton />
  </div>
);
