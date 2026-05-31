import { api, readErrorMessage } from '../http';
import type { GitHubRelease } from '@chatovo/schemas';

export const getLatestRelease = async (): Promise<GitHubRelease> => {
  const res = await api.github.releases.latest.$get();

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to fetch latest release: ${res.status}`);
  }

  return await res.json();
};
