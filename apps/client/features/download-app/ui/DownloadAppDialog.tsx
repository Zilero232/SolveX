'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import { DESKTOP_PLATFORMS, useDesktopRelease } from '@/entities/desktop-release';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';
import { PlatformCard } from './components';
import { downloadAppDialogStyles as s } from './DownloadAppDialog.styles';
import type { DownloadAppDialogProps } from './DownloadAppDialog.types';

export const DownloadAppDialog = ({ open, onOpenChange }: DownloadAppDialogProps) => {
  const { isLoading, isError, data: release } = useDesktopRelease();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Chatovo</DialogTitle>
          <DialogDescription className={s.description}>
            Native desktop client with auto-updates. Pick your platform.
          </DialogDescription>
        </DialogHeader>

        {isLoading && <Loader2 className={s.spinner} />}

        {isError && (
          <div className={s.fallback}>
            Couldn't load the latest release.{' '}
            <a
              className={s.fallbackLink}
              href={EXTERNAL_LINKS.desktopReleases}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open releases on GitHub
            </a>
          </div>
        )}

        {release && (
          <>
            <div className={s.grid}>
              {DESKTOP_PLATFORMS.map(({ id, label, Icon }) => (
                <PlatformCard key={id} Icon={Icon} asset={release.assets[id]} label={label} />
              ))}
            </div>

            <div className={s.meta}>
              <span>Version {release.version}</span>
              <a
                className={s.metaLink}
                href={release.htmlUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Release notes <ExternalLink className={s.metaLinkIcon} />
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
