import { match, P } from 'ts-pattern';
import { prettyAccelerator } from '@/shared/lib';
import type { ShortcutBinding } from '../model/types';

type Labels = {
  recording: string;
  unassigned: string;
};

// Picks the text shown inside the row's combo button:
//   "press a combination…" while recording,
//   "not assigned" when the action has no binding,
//   the pretty-formatted accelerator otherwise.
export const formatBindingDisplay = (
  recording: boolean,
  binding: ShortcutBinding,
  labels: Labels,
): string => {
  return match({ recording, binding })
    .with({ recording: true }, () => labels.recording)
    .with({ binding: P.nullish }, () => labels.unassigned)
    .otherwise(({ binding: b }) => prettyAccelerator(b as string));
};
