import { Loader2 } from 'lucide-react';

// The app-wide startup splash, shown while a provider is still bootstrapping
// (resolving the locale, restoring the auth session). Carries no translated
// text, so it is identical on the static pre-render and the hydrated client —
// no hydration mismatch — and it works before the i18n provider is mounted.
export const AppSplash = () => (
  <div className="flex h-full items-center justify-center">
    <Loader2 className="size-5 animate-spin text-muted-foreground" />
  </div>
);
