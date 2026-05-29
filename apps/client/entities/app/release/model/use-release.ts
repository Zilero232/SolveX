import { useQuery } from '@tanstack/react-query';
import { getLatestRelease } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { detectAssetPlatform } from '@/shared/lib';
import { EXTENSION_TO_PLATFORM } from '../config';
import type { DesktopPlatform, Release, ReleaseAsset } from './types';

export const useRelease = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.release(),
    enabled,
    retry: 1,
    queryFn: async (): Promise<Release> => {
      const data = await getLatestRelease();

      const assets: Partial<Record<DesktopPlatform, ReleaseAsset>> = {};

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
};
