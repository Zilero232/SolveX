import rootPackage from '../../package.json' with { type: 'json' };
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version,
  },
  output: 'export',
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
