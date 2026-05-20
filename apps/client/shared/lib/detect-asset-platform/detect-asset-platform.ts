/** Returns the platform value mapped by the asset's file extension, or null. */
export const detectAssetPlatform = <T extends string>(
  filename: string,
  extensionMap: Record<string, T>,
): T | null => {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (!ext) return null;

  return extensionMap[ext] ?? null;
};
