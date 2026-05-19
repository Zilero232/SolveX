import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { RootRedirect } from '@/views/root';

export const metadata = createPageMetadata({
  title: 'Chatovo — Real-time voice & video rooms',
  description:
    'Spin up a private voice or video room in one click. Share the link, start talking. Chatovo is a fast, focused, Discord-inspired messenger for the web and desktop.',
  path: ROUTES.root,
});

const Page = () => <RootRedirect />;

export default Page;
