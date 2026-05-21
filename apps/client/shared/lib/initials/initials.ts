import { isEmpty } from 'remeda';

const AVATAR_COLORS = [
  'bg-red-600',
  'bg-orange-600',
  'bg-amber-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-sky-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-fuchsia-600',
  'bg-rose-600',
] as const;

/** First letters of the first two words, uppercased. Falls back to '?'. */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (isEmpty(words)) return '?';

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
};

/** Deterministic Tailwind background class derived from the name. */
export const getAvatarColor = (name: string): string => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
