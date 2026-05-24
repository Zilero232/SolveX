'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { LayoutGrid, Mic, Settings, User, Video, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
import { SoundsTab } from './sections/SoundsTab';
import { TrayTab } from './sections/TrayTab';
import { VideoTab } from './sections/VideoTab';

// A gear button that opens the app-wide settings dialog. Drop it anywhere —
// it is self-contained and owns its open state. Each tab reads useAppSettings
// itself; reactuse keeps the shared localStorage entry in sync across them.
export const AppSettingsButton = () => {
  const t = useTranslations('settings');
  const [isOpen, toggleOpen] = useBoolean(false);
  const showTrayTab = isTauri();

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

          <Tabs className={s.tabs} defaultValue="profile">
            <TabsList className={s.tabsList}>
              <TabsTrigger value="profile">
                <User />
                {t('tabs.profile')}
              </TabsTrigger>
              <TabsTrigger value="audio">
                <Mic />
                {t('tabs.audio')}
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video />
                {t('tabs.video')}
              </TabsTrigger>
              <TabsTrigger value="sounds">
                <Volume2 />
                {t('tabs.sounds')}
              </TabsTrigger>
              {showTrayTab && (
                <TabsTrigger value="tray">
                  <LayoutGrid />
                  {t('tabs.tray')}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="audio">
              <AudioTab />
            </TabsContent>

            <TabsContent value="video">
              <VideoTab />
            </TabsContent>

            <TabsContent value="sounds">
              <SoundsTab />
            </TabsContent>

            {showTrayTab && (
              <TabsContent value="tray">
                <TrayTab />
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
