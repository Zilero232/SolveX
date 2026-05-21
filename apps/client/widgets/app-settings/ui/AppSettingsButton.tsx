'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Mic, Settings, Video, Volume2 } from 'lucide-react';
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
import { useAppSettings } from '../model';
import { appSettingsStyles as s } from './AppSettingsButton.styles';
import { AudioSettings } from './sections/AudioSettings';
import { SoundsSettings } from './sections/SoundsSettings';
import { VideoSettings } from './sections/VideoSettings';

// A gear button that opens the app-wide settings dialog. Drop it anywhere —
// it is self-contained and owns its open state.
export const AppSettingsButton = () => {
  const [isOpen, toggleOpen] = useBoolean(false);
  const { settings, setSetting, toggleSound } = useAppSettings();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Open settings"
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleOpen(true)}
          >
            <Settings />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>

      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className={s.content}>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Devices and sound preferences. Saved on this device.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="audio">
            <TabsList className={s.tabsList}>
              <TabsTrigger value="audio">
                <Mic />
                Audio
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video />
                Video
              </TabsTrigger>
              <TabsTrigger value="sounds">
                <Volume2 />
                Sounds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="audio">
              <AudioSettings setSetting={setSetting} settings={settings} />
            </TabsContent>

            <TabsContent value="video">
              <VideoSettings setSetting={setSetting} settings={settings} />
            </TabsContent>

            <TabsContent value="sounds">
              <SoundsSettings
                setSetting={setSetting}
                settings={settings}
                toggleSound={toggleSound}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
