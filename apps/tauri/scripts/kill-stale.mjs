#!/usr/bin/env node
// Kills lingering Chatovo / cargo dev processes from a previous `tauri dev`
// that crashed or was hard-stopped. Without this, the OS-level hotkey
// registrations (Ctrl+Shift+M, etc.) stay owned by the zombie and the new
// instance fails with "HotKey already registered".

import { execSync } from 'node:child_process';
import { platform } from 'node:os';

const myPid = process.pid;
const parentPid = process.ppid;
const protect = new Set([String(myPid), String(parentPid)]);

const run = (cmd) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    return '';
  }
};

const killWindows = () => {
  // chatovo.exe is the Tauri binary (Cargo.toml package name).
  const out = run('tasklist /FI "IMAGENAME eq chatovo.exe" /FO CSV /NH');
  const pids = [...out.matchAll(/"chatovo\.exe","(\d+)"/g)]
    .map((m) => m[1])
    .filter((pid) => !protect.has(pid));
  for (const pid of pids) {
    run(`taskkill /F /PID ${pid}`);
    console.log(`[kill-stale] killed chatovo.exe PID ${pid}`);
  }
};

const killUnix = () => {
  // Match the cargo-built binary name.
  run('pkill -9 -x chatovo');
};

if (platform() === 'win32') killWindows();
else killUnix();
