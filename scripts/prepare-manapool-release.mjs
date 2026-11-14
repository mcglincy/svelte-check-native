import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TARGETS } from './targets.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const version = '1.11.1-manapool.1';
const compilerVersion = '7.1.0-dev.20261113.1';
const repository = 'https://github.com/manapoolinc/svelte-check-native';
execFileSync(process.execPath, ['scripts/prepare-release.mjs', version], { cwd: root, stdio: 'inherit' });
for (const suffix of ['', ...TARGETS.map(target => `-${target.npmPlatform}`)]) {
  const dir = join(root, 'dist-packs/pkgs', `svelte-check-native${suffix}`);
  const manifestPath = join(dir, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.name = `@manapoolinc/${manifest.name}`;
  manifest.homepage = repository;
  manifest.repository.url = `git+${repository}.git`;
  manifest.publishConfig = { registry: 'https://npm.pkg.github.com' };
  if (!suffix) {
    manifest.description = 'Mana Pool’s patched svelte-check-native with a pinned TypeScript native compiler.';
    manifest.bugs.url = `${repository}/issues`;
    manifest.optionalDependencies = Object.fromEntries(Object.entries(manifest.optionalDependencies).map(([name, pin]) => [`@manapoolinc/${name}`, pin]));
    manifest.dependencies = { 'typescript-native': `npm:typescript@${compilerVersion}` };
    delete manifest.peerDependencies;
    delete manifest.peerDependenciesMeta;
    copyFileSync(join(root, 'scripts/templates/manapool-wrapper.cjs'), join(dir, 'bin/svelte-check-native.js'));
    copyFileSync(join(root, 'MANAPOOL.md'), join(dir, 'README.md'));
  }
  copyFileSync(join(root, 'LICENSE'), join(dir, 'LICENSE'));
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}
