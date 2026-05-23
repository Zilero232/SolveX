import { Loader2 } from 'lucide-react';

type AppSplashProps = {
  message?: string;
};

// The app-wide startup splash, shown while a provider is still bootstrapping
// (resolving the locale, checking for updates, restoring the auth session).
// Carries no translated text by default so it is identical on the static
// pre-render and the hydrated client — no hydration mismatch — and it works
// before the i18n provider is mounted. Pass `message` once translations are
// available.
export const AppSplash = ({ message }: AppSplashProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-3">
    <Loader2 className="size-5 animate-spin text-muted-foreground" />
    {message && <p className="text-muted-foreground text-sm">{message}</p>}
  </div>
);
