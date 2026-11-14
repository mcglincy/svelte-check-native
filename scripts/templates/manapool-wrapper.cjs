#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const { dirname, join } = require('node:path');

try {
  const platform = process.platform === 'android' ? 'linux' : process.platform;
  const suffix = `${platform}-${process.arch}`;
  const checkerManifest = require.resolve(`@manapoolinc/svelte-check-native-${suffix}/package.json`);
  const checker = join(dirname(checkerManifest), 'bin', process.platform === 'win32' ? 'svelte-check-native.exe' : 'svelte-check-native');
  const compilerRequire = createRequire(require.resolve('typescript-native/package.json'));
  const compilerManifest = compilerRequire.resolve(`@typescript/typescript-${suffix}/package.json`);
  const compiler = join(dirname(compilerManifest), 'lib', process.platform === 'win32' ? 'tsc.exe' : 'tsc');
  const result = spawnSync(checker, process.argv.slice(2), {
    stdio: 'inherit',
    env: { ...process.env, TSGO_BIN: compiler },
  });
  if (result.error) throw result.error;
  if (result.signal) process.kill(process.pid, result.signal);
  else process.exitCode = result.status ?? 1;
} catch (error) {
  process.stderr.write(`svelte-check-native: ${error.message}\n`);
  process.exitCode = 2;
}
