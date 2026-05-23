import { isValid, parse } from 'date-fns';

const TAURI_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS xxxxx';

export const parseTauriDate = (raw: string | null | undefined) => {
  if (!raw) return null;

  const date = parse(raw, TAURI_DATE_FORMAT, new Date());

  return isValid(date) ? date : null;
};
