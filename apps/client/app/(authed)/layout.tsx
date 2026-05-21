import { AuthedShell } from '@/widgets/authed-shell';
import type { ReactNode } from 'react';

const AuthedLayout = ({ children }: { children: ReactNode }) => (
  <AuthedShell>{children}</AuthedShell>
);

export default AuthedLayout;
