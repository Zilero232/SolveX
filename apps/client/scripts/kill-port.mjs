#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { platform } from 'node:os';

const port = Number(process.argv[2]);

if (!port || Number.isNaN(port)) {
  console.error('Usage: kill-port <port>');
  process.exit(1);
}

const isWin = platform() === 'win32';

try {
  if (isWin) {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const pids = new Set();

    for (const line of out.split(/\r?\n/)) {
      const m = line.match(/\s+(\d+)\s*$/);

      if (m && line.includes('LISTENING')) pids.add(m[1]);
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`Killed PID ${pid} on :${port}`);
      } catch {}
    }
  } else {
    const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();

    if (out) {
      execSync(`kill -9 ${out.split(/\s+/).join(' ')}`, { stdio: 'ignore' });
      console.log(`Killed processes on :${port}`);
    }
  }
} catch {
  // Nothing listening on port — silent
}
