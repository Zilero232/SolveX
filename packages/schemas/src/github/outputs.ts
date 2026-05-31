import { z } from 'zod';

export const gitHubReleaseAssetSchema = z.object({
  browser_download_url: z.url(),
  name: z.string(),
  size: z.number().int().nonnegative(),
});

export const gitHubReleaseSchema = z.object({
  assets: z.array(gitHubReleaseAssetSchema),
  html_url: z.url(),
  name: z.string().nullable(),
  published_at: z.string(),
  tag_name: z.string(),
});
