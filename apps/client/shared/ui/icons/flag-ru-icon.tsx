import type { SVGProps } from 'react';

// Flag of Russia — three equal horizontal bands: white, blue, red.
export const FlagRuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 4 3" {...props}>
    <rect width="4" height="3" fill="#fff" />
    <rect width="4" height="2" y="1" fill="#0039a6" />
    <rect width="4" height="1" y="2" fill="#d52b1e" />
  </svg>
);
