'use client';

import { createContext } from '@siberiacancode/reactuse';
import type { TrayMenuValue } from './use-tray-setup';

export const trayMenuContext = createContext<TrayMenuValue | null>(null, { name: 'TrayMenu' });

export const useTrayMenu = (): TrayMenuValue | null => trayMenuContext.useSelect().value ?? null;
