export type DesktopPlatform = 'linux' | 'macos' | 'windows';

export type ReleaseAsset = {
  downloadUrl: string;
  name: string;
  platform: DesktopPlatform;
  sizeBytes: number;
};

export type Release = {
  assets: Partial<Record<DesktopPlatform, ReleaseAsset>>;
  htmlUrl: string;
  publishedAt: string;
  version: string;
};
