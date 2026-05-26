import { Loader2 } from 'lucide-react';
import { isNullish } from 'remeda';
import { Progress } from './progress';

type AppSplashProps = {
  message?: string;
  progress?: number;
};

// App-wide startup splash. Shown while a provider is still bootstrapping
// (locale resolution, update check, auth restore). Carries no translated text
// by default so the static pre-render matches the hydrated client.
export const AppSplash = ({ message, progress }: AppSplashProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
    {isNullish(progress) ? (
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    ) : (
      <Progress className="w-full max-w-xs" value={progress} />
    )}

    {message && <p className="text-muted-foreground text-sm">{message}</p>}
  </div>
);
