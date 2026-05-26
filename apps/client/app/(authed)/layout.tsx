import { AuthedShell } from '@/widgets/layout/authed-shell';
import type { ReactNode } from 'react';

const AuthedLayout = ({ children }: { children: ReactNode }) => (
  <AuthedShell>{children}</AuthedShell>
);

export default AuthedLayout;
