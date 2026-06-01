import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env';

const SERVER_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const UPLOADS_DIR = isAbsolute(env.UPLOADS_DIR)
  ? env.UPLOADS_DIR
  : resolve(SERVER_ROOT, env.UPLOADS_DIR);

export const saveUpload = async (key: string, body: ArrayBuffer): Promise<string> => {
  const target = join(UPLOADS_DIR, key);

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(body));

  return `${env.PUBLIC_FILES_URL}/uploads/${key}`;
};

export const deleteUpload = async (key: string): Promise<void> => {
  await rm(join(UPLOADS_DIR, key), { force: true });
};
