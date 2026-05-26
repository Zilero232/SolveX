#!/usr/bin/env node
// Kills any process holding the server's dev port so `bun dev` can rebind
// after a crashed previous run. Reads PORT from apps/server/.env (defaults to
// 4000). Protects the current/parent PID so the predev hook can't suicide.

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { platform } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const myPid = String(process.pid);
const parentPid = String(process.ppid);
const protect = new Set([myPid, parentPid]);

const readPort = () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const envPath = resolve(here, '..', '.env');

  try {
    const raw = readFileSync(envPath, 'utf8');
    const match = raw.match(/^\s*PORT\s*=\s*(\d+)\s*$/m);

    if (match) return Number(match[1]);
  } catch {
    // .env may not exist on a fresh checkout — fall through to default
  }

  return 4000;
};

const run = (cmd) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    return '';
  }
};

const killWindows = (port) => {
  // `netstat -ano` lines look like:
  //   TCP  0.0.0.0:4000  0.0.0.0:0  LISTENING  12345
  // We want only LISTENING entries on our port — the trailing PID is the owner.
  const out = run(`netstat -ano -p tcp`);
  const pattern = new RegExp(`^\\s*TCP\\s+\\S*:${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)`, 'gm');
  const pids = new Set();

  for (const match of out.matchAll(pattern)) {
    if (!protect.has(match[1])) pids.add(match[1]);
  }

  for (const pid of pids) {
    run(`taskkill /F /PID ${pid}`);
    // biome-ignore lint/suspicious/noConsole: standalone CLI script, console is the output channel
    console.log(`[kill-port] killed PID ${pid} on port ${port}`);
  }
};

const killUnix = (port) => {
  const out = spawnSync('lsof', ['-ti', `tcp:${port}`], { encoding: 'utf8' });
  if (out.status !== 0) return;

  const pids = out.stdout
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !protect.has(s));

  for (const pid of pids) {
    run(`kill -9 ${pid}`);
    // biome-ignore lint/suspicious/noConsole: standalone CLI script, console is the output channel
    console.log(`[kill-port] killed PID ${pid} on port ${port}`);
  }
};

const port = readPort();

if (platform() === 'win32') killWindows(port);
else killUnix(port);
