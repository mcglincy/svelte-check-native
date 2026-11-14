# Mana Pool’s local Svelte checker

This fork supplies Mana Pool’s local incremental checks. Install `@manapoolinc/svelte-check-native` from GitHub Packages, then run `svelte-check-native --incremental --tsconfig ./tsconfig.json` after generating SvelteKit types and routes.

The package includes a pinned `typescript-native` alias of `typescript@7.1.0-dev.20261113.1`. Its wrapper always selects that compiler, preserving the application's existing TypeScript installation. The nightly includes microsoft/TypeScript#65080, fixing valid U+FFFD characters in regular expressions.

Our Kit diagnostic filter suppresses diagnostics strictly inside inserted annotations, except TS2307, TS2694 and TS2355. Boundary diagnostics and errors in user-written code remain. This matches default `svelte-check` and Mana Pool’s patched incremental checker; stock `svelte-check --tsgo` does not yet apply this filter.

## Releasing

The `manapool-package` workflow builds all five platform packages from the same commit, smoke-tests each package with its pinned compiler, then publishes them to GitHub Packages using its repository token. Publishing runs only on `codex/manapool-package` in the Mana Pool fork.

For a manual recovery, download the `npm-*` artifacts from a successful run into `dist-packs/`. Run `node scripts/prepare-manapool-release.mjs`, extract each platform tarball into its matching directory under `dist-packs/pkgs/`, then run `node scripts/publish-all.mjs --dry-run` and `node scripts/publish-all.mjs`. The publisher sends platform packages first and the wrapper last. Authenticate to `https://npm.pkg.github.com` with package publishing permission.

The scoped package version and compiler pin live in `scripts/prepare-manapool-release.mjs`; upstream's Rust version remains unchanged. Update the smoke-test compiler expectation in the workflow when changing the compiler pin.
