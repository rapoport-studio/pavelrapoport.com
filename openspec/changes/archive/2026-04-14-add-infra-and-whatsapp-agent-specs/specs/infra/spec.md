## ADDED Requirements

### Requirement: Cloudflare Account Topology

The system SHALL be deployed on Cloudflare account `e354e781...` with zone `75dcc722...` managing `pavelrapoport.com`.

#### Scenario: Account identification
- **WHEN** an operator needs to access Cloudflare resources
- **THEN** they use account ID `e354e781...` and zone ID `75dcc722...`
- **AND** the zone covers `pavelrapoport.com` and all subdomains

### Requirement: Workers Deployment

The system SHALL run two Cloudflare Workers:
- `rapoport-web` serving `pavelrapoport.com` (public site)
- `rapoport-studio` serving `studio.pavelrapoport.com` (internal dashboard)

#### Scenario: Web worker serves public site
- **WHEN** a request arrives at `pavelrapoport.com`
- **THEN** the `rapoport-web` worker handles the request
- **AND** serves the Next.js app built with opennextjs-cloudflare

#### Scenario: Studio worker serves internal dashboard
- **WHEN** a request arrives at `studio.pavelrapoport.com`
- **THEN** the `rapoport-studio` worker handles the request
- **AND** serves the studio Next.js app behind authentication

### Requirement: KV Storage

The system SHALL use Cloudflare KV namespaces for caching:
- `rapoport-cache` — production cache
- `rapoport-cache-preview` — preview/staging cache

#### Scenario: Production cache binding
- **WHEN** the `rapoport-web` worker is deployed to production
- **THEN** it binds to the `rapoport-cache` KV namespace

#### Scenario: Preview cache isolation
- **WHEN** a preview deployment runs
- **THEN** it binds to `rapoport-cache-preview`
- **AND** production cache is unaffected

### Requirement: DNS Configuration

DNS SHALL be managed through Cloudflare with Workers custom domains. AAAA records are automatically managed by Workers routes.

#### Scenario: Custom domain routing
- **WHEN** a Workers custom domain is configured
- **THEN** Cloudflare creates the necessary AAAA records
- **AND** routes traffic to the corresponding worker

#### Scenario: Subdomain resolution
- **WHEN** `studio.pavelrapoport.com` is requested
- **THEN** DNS resolves via Workers-managed AAAA record
- **AND** traffic routes to `rapoport-studio`

### Requirement: Secrets Pipeline

Secrets SHALL flow from Infisical to Cloudflare Workers via `wrangler secret put`. Secrets MUST NOT be stored in `wrangler.toml` or committed to git.

#### Scenario: Deploying a new secret
- **WHEN** a secret is added or rotated in Infisical
- **THEN** the operator runs `wrangler secret put <NAME>` for each worker
- **AND** the secret becomes available in the worker runtime

#### Scenario: Accessing secrets in Workers runtime
- **WHEN** server-side code needs a secret value
- **THEN** it MUST use `getCloudflareContext()` to access the binding
- **AND** MUST NOT use `process.env` (which is empty in Workers runtime)

### Requirement: CI/CD Pipeline

Deployment SHALL use GitHub Actions with opennextjs-cloudflare adapter. Each app deploys independently.

#### Scenario: Production deploy
- **WHEN** a commit is merged to `main`
- **THEN** GitHub Actions builds the app with opennextjs-cloudflare
- **AND** deploys via `wrangler deploy`
- **AND** the worker goes live on the configured custom domain

#### Scenario: Secrets re-application after deploy
- **WHEN** a deploy completes
- **THEN** the operator MUST verify secrets are intact
- **AND** re-run `wrangler secret put` if secrets were lost during deploy

### Requirement: API Token Permissions

Cloudflare API tokens SHALL have minimum required permissions:
Workers Scripts (Edit), KV Storage (Edit), Workers Routes (Edit).

#### Scenario: Token scope validation
- **WHEN** a CI/CD pipeline uses a Cloudflare API token
- **THEN** the token has permissions for Workers Scripts, KV Storage, and Workers Routes
- **AND** no broader permissions are granted

### Requirement: Known Issue — Secrets Survival

Secrets MAY NOT survive a `wrangler deploy` in all cases. After each deploy, secrets MUST be verified and re-applied if missing.

#### Scenario: Secret lost after deploy
- **WHEN** a deploy completes and a runtime error indicates missing secret
- **THEN** the operator re-runs `wrangler secret put <NAME>`
- **AND** verifies the secret is accessible via `getCloudflareContext()`

### Requirement: Known Issue — Environment Variable Access

Workers runtime does NOT support `process.env`. All secret and binding access MUST use `getCloudflareContext()` from `@opennextjs/cloudflare`.

#### Scenario: Incorrect env access pattern
- **WHEN** code uses `process.env.SECRET_NAME` in a Workers context
- **THEN** the value is `undefined`
- **AND** the correct pattern is `(await getCloudflareContext()).env.SECRET_NAME`
