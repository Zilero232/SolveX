export const userNameStyles = {
  root: 'inline-flex min-w-0 items-center gap-1 leading-none',
  link: 'truncate bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-px transition-[background-size,color] duration-200 ease-out hover:text-primary hover:bg-[length:100%_1px]',
  text: 'truncate',
  checkWrap: 'inline-flex shrink-0 self-center translate-y-px',
  check: 'fill-sky-500 text-background',
} as const;

export const checkSizes = {
  sm: 'size-3.5',
  md: 'size-4',
} as const;
