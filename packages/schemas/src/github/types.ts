import type { z } from 'zod';
import type { gitHubReleaseAssetSchema, gitHubReleaseSchema } from './outputs';

export type GitHubReleaseAsset = z.infer<typeof gitHubReleaseAssetSchema>;
export type GitHubRelease = z.infer<typeof gitHubReleaseSchema>;
