import { match, P } from 'ts-pattern';
import { prettyHotkey } from '@/shared/lib';
import type { ShortcutBinding } from '../model/types';

type Labels = {
  recording: string;
  unassigned: string;
};

export const formatBindingDisplay = (
  recording: boolean,
  binding: ShortcutBinding,
  labels: Labels,
): string => {
  return match({ recording, binding })
    .with({ recording: true }, () => labels.recording)
    .with({ binding: P.nullish }, () => labels.unassigned)
    .otherwise(({ binding: b }) => prettyHotkey(b as string));
};
