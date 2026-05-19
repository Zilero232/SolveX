import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { AuthPage } from '@/views/auth';

export const metadata = createPageMetadata({
  title: 'Sign in',
  description:
    'Sign in to Chatovo with Google or email to create and join private voice and video rooms in one click.',
  path: ROUTES.auth,
  index: false,
});

const Page = () => <AuthPage />;

export default Page;
