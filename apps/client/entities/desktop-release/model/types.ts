export type DesktopPlatform = 'linux' | 'macos' | 'windows';

export type DesktopReleaseAsset = {
  downloadUrl: string;
  name: string;
  platform: DesktopPlatform;
  sizeBytes: number;
};

export type DesktopRelease = {
  assets: Partial<Record<DesktopPlatform, DesktopReleaseAsset>>;
  htmlUrl: string;
  publishedAt: string;
  version: string;
};
