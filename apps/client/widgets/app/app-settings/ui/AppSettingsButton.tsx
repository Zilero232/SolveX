'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { Keyboard, Mic, Settings, Settings2, User, Video, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui';
import { appSettingsStyles as s } from './AppSettingsButton.styles';
import { AudioTab } from './sections/AudioTab';
import { ProfileTab } from './sections/ProfileTab';
import { ShortcutsTab } from './sections/ShortcutsTab';
import { SoundsTab } from './sections/SoundsTab';
import { SystemTab } from './sections/SystemTab';
import { VideoTab } from './sections/VideoTab';

export const AppSettingsButton = () => {
  const t = useTranslations('settings');

  const [isOpen, toggleOpen] = useBoolean(false);
  const [activeTab, setActiveTab] = useState('profile');

  const showSystemTab = isTauri();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={t('open')}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleOpen(true)}
          >
            <Settings />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('title')}</TooltipContent>
      </Tooltip>

      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className={s.content}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <Tabs
            className={s.tabs}
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className={s.tabsList}>
              <TabsTrigger className={s.tabsTrigger} value="profile">
                <User />
                {t('tabs.profile')}
              </TabsTrigger>
              <TabsTrigger className={s.tabsTrigger} value="audio">
                <Mic />
                {t('tabs.audio')}
              </TabsTrigger>
              <TabsTrigger className={s.tabsTrigger} value="video">
                <Video />
                {t('tabs.video')}
              </TabsTrigger>
              <TabsTrigger className={s.tabsTrigger} value="sounds">
                <Volume2 />
                {t('tabs.sounds')}
              </TabsTrigger>
              {showSystemTab && (
                <TabsTrigger className={s.tabsTrigger} value="system">
                  <Settings2 />
                  {t('tabs.system')}
                </TabsTrigger>
              )}
              <TabsTrigger className={s.tabsTrigger} value="shortcuts">
                <Keyboard />
                {t('tabs.shortcuts')}
              </TabsTrigger>
            </TabsList>

            <TabsContent className={s.tabsContent} value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent className={s.tabsContent} value="audio">
              <AudioTab onJumpToShortcuts={() => setActiveTab('shortcuts')} />
            </TabsContent>

            <TabsContent className={s.tabsContent} value="video">
              <VideoTab />
            </TabsContent>

            <TabsContent className={s.tabsContent} value="sounds">
              <SoundsTab />
            </TabsContent>

            {showSystemTab && (
              <TabsContent className={s.tabsContent} value="system">
                <SystemTab />
              </TabsContent>
            )}

            <TabsContent className={s.tabsContent} value="shortcuts">
              <ShortcutsTab />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
