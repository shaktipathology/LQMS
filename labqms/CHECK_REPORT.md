# Application Verification Report

## Date
2025-11-06

## Environment
- Container image provided by evaluation harness
- Node.js $(node -v)
- npm $(npm -v)

## Actions Performed
1. Attempted to install workspace dependencies via `npm install` from the monorepo root.
2. Retried installation with explicit workspace flags.
3. Attempted to fall back to alternative package managers (`pnpm`, `npx npm@10`).
4. Probed registry access using `curl` for diagnostic purposes.

## Observations
- `npm install` fails immediately with `Unsupported URL Type "workspace:"` because the default npm client in the container does not recognize the workspace alias due to restricted networking preventing the fallback download of a compatible npm version.
- Alternative package managers (`pnpm`, `npx npm@10`) were unable to reach the npm registry, each returning HTTP 403 (Forbidden).
- Direct `curl` to the npm registry endpoint also returned HTTP 403, confirming an environment-level restriction.

## Conclusion
The repository requires package installation to run or build the applications. Package installation is currently blocked by the sandbox network policy, so the applications cannot be started or tested within this environment. No issues with the repository contents were identified during this check.

## Suggested Next Steps
- Re-run the installation commands in an environment with outbound access to the npm registry.
- Once dependencies are installed successfully, execute:
  - `npm run build -w apps/api`
  - `npm run build -w apps/web`
  - `npm run seed -w apps/api`
  - `npm run dev -w apps/api` and `npm run dev -w apps/web`
- Verify web access at http://localhost:3000 using the seeded credentials `admin@aiimsbhopal.edu` / `Labqms@123`.
