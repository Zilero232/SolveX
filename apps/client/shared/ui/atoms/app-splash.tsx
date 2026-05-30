import { isNonNullish } from 'remeda';
import { Progress } from './progress';
import { Spinner } from './spinner';

type AppSplashProps = {
  message?: string;
  progress?: number;
};

export const AppSplash = ({ message, progress }: AppSplashProps) => {
  const hasProgress = isNonNullish(progress);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <div className="flex size-16 items-center justify-center rounded-2xl glass shadow-glow-violet">
        <Spinner size="lg" />
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        {message && <p className="text-center text-muted-foreground text-sm">{message}</p>}

        {hasProgress && <Progress className="w-full" value={progress} />}
      </div>
    </div>
  );
};
