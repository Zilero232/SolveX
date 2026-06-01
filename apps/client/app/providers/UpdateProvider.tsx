'use client';

import { UpdateBootstrap } from '@/features/app/check-app-update';
import type { ReactNode } from 'react';

const isDev = process.env.NODE_ENV === 'development';

export const UpdateProvider = ({ children }: { children: ReactNode }) => {
  if (isDev) return children;

  return <UpdateBootstrap>{children}</UpdateBootstrap>;
};
