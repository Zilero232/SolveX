import type { SVGProps } from 'react';

// Flag of the United Kingdom (Union Jack). The clipPath id is unique so
// multiple instances on one page don't collide.
export const FlagGbIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 60 30" {...props}>
    <clipPath id="flag-gb-clip">
      <path d="M0 0v30h60V0z" />
    </clipPath>
    <clipPath id="flag-gb-triangles">
      <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
    </clipPath>
    <g clipPath="url(#flag-gb-clip)">
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0 0l60 30m0-30L0 30"
        clipPath="url(#flag-gb-triangles)"
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </g>
  </svg>
);
