import type { CSSProperties } from 'react';

export const getBannerStyle = (color: string | null | undefined): CSSProperties | undefined => {
  if (!color) return undefined;

  return {
    backgroundImage: `linear-gradient(to bottom right, ${color}, ${color}33)`,
  };
};
