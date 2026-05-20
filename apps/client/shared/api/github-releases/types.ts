export type GitHubReleaseAsset = {
  browser_download_url: string;
  name: string;
  size: number;
};

export type GitHubRelease = {
  assets: GitHubReleaseAsset[];
  html_url: string;
  name: string;
  published_at: string;
  tag_name: string;
};
