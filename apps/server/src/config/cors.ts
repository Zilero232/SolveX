import { filter, map, pipe } from 'remeda';
import { env } from '../lib/env';

// Web client origins come from env (comma-separated); Tauri origins are always
// allowed so the desktop app can reach the same API as the website.
// macOS/Linux Tauri webview uses `tauri://localhost`; Windows uses
// `http(s)://tauri.localhost` depending on the WebView2 build.
const TAURI_ORIGINS = ['tauri://localhost', 'http://tauri.localhost', 'https://tauri.localhost'];

export const allowedOrigins = [
  ...pipe(
    env.CORS_ORIGINS.split(','),
    map((origin) => origin.trim()),
    filter((origin) => origin.length > 0),
  ),
  ...TAURI_ORIGINS,
];
