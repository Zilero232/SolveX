import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure Next.js uses SSG instead of SSR
  // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  output: 'export',
  // Auto-memoization — makes manual useMemo/useCallback unnecessary.
  reactCompiler: true,
  // Note: This feature is required to use the Next.js Image component in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
