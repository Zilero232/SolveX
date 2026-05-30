export const messageContentStyles = {
  root: 'space-y-1 [overflow-wrap:anywhere] [&_li]:ml-4 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_ul]:list-disc',
  link: 'break-all text-brand-cyan underline-offset-2 hover:underline',
  code: 'rounded bg-black/30 px-1 py-0.5 font-mono text-[0.85em]',
  pre: 'rounded-lg bg-black/30 p-2 font-mono text-[0.85em]',
} as const;
