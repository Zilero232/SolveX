export const profileCardStyles = {
  root: '-m-4 flex w-72 flex-col overflow-hidden rounded-2xl',
  banner: 'h-20 w-full bg-linear-to-br from-brand-violet/60 to-brand-cyan/60',
  body: 'flex flex-col gap-3 px-4 pb-4',
  avatarWrap: '-mt-8 flex',
  avatar: 'size-16 ring-4 ring-background',
  identity: 'flex flex-col gap-0.5',
  name: 'text-base font-semibold',
  bio: 'whitespace-pre-wrap break-words text-sm text-muted-foreground',
} as const;
