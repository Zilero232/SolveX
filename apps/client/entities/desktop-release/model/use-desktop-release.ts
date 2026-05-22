import { useQuery } from '@tanstack/react-query';
import { getLatestRelease } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { detectAssetPlatform } from '@/shared/lib';
import { EXTENSION_TO_PLATFORM } from '../config';
import type { DesktopPlatform, DesktopRelease, DesktopReleaseAsset } from './types';

// `enabled` keeps the GitHub API request from firing on page load — it runs
// only once the download dialog is actually opened.
export const useDesktopRelease = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.desktopRelease(),
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
    queryFn: async (): Promise<DesktopRelease> => {
      const data = await getLatestRelease();

      const assets: Partial<Record<DesktopPlatform, DesktopReleaseAsset>> = {};

      for (const asset of data.assets) {
        const platform = detectAssetPlatform(asset.name, EXTENSION_TO_PLATFORM);

        if (!platform || assets[platform]) continue;

        assets[platform] = {
          platform,
          name: asset.name,
          sizeBytes: asset.size,
          downloadUrl: asset.browser_download_url,
        };
      }

      return {
        assets,
        htmlUrl: data.html_url,
        publishedAt: data.published_at,
        version: data.tag_name.replace(/^app-v?/, ''),
      };
    },
  });
