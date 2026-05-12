import type { ReactNode } from 'react';

import { AuthedShell } from '@/widgets/authed-shell';

const AuthedLayout = ({ children }: { children: ReactNode }) => (
  <AuthedShell>{children}</AuthedShell>
);

export default AuthedLayout;
