# infra

> Cloudflare infrastructure that runs the studio ecosystem.

## Purpose

**What:** Infrastructure layer for pavelrapoport.com — Cloudflare
account, Workers, KV, DNS, secrets pipeline, and CI/CD.

**For whom:** Pavel (operates and deploys), AI agents (need
infrastructure context to diagnose issues and deploy changes).

**Why it exists:** The studio runs on Cloudflare Workers with
a specific topology of accounts, zones, KV namespaces, and
secrets. Without a spec, operational knowledge lives only in
someone's head. When secrets vanish after deploy or code uses
`process.env` instead of `getCloudflareContext()`, the fix
needs to be discoverable, not rediscovered.

## Requirements

### Requirement: Cloudflare Account Topology

The system SHALL be deployed on Cloudflare account `e354e781...`
with zone `75dcc722...` managing `pavelrapoport.com`.

#### Scenario: Account identification
- **GIVEN** an operator needs to access Cloudflare resources
- **WHEN** they open the Cloudflare dashboard or use wrangler
- **THEN** they use account ID `e354e781...` and zone ID `75dcc722...`
- **AND** the zone covers `pavelrapoport.com` and all subdomains

### Requirement: Workers Deployment

The system SHALL run two Cloudflare Workers:
- `rapoport-web` serving `pavelrapoport.com` (public site)
- `rapoport-studio` serving `studio.pavelrapoport.com` (internal dashboard)

#### Scenario: Web worker serves public site
- **GIVEN** the `rapoport-web` worker is deployed
- **WHEN** a request arrives at `pavelrapoport.com`
- **THEN** the worker handles the request
- **AND** serves the Next.js app built with opennextjs-cloudflare

#### Scenario: Studio worker serves internal dashboard
- **GIVEN** the `rapoport-studio` worker is deployed
- **WHEN** a request arrives at `studio.pavelrapoport.com`
- **THEN** the worker handles the request
- **AND** serves the studio Next.js app behind authentication

### Requirement: KV Storage

The system SHALL use Cloudflare KV namespaces for caching:
- `rapoport-cache` — production cache
- `rapoport-cache-preview` — preview/staging cache

#### Scenario: Production cache binding
- **GIVEN** the `rapoport-web` worker is deployed to production
- **WHEN** the worker accesses the KV binding
- **THEN** it reads from and writes to the `rapoport-cache` namespace

#### Scenario: Preview cache isolation
- **GIVEN** a preview deployment is running
- **WHEN** the worker accesses the KV binding
- **THEN** it uses `rapoport-cache-preview`
- **AND** production cache is unaffected

### Requirement: DNS Configuration

DNS SHALL be managed through Cloudflare with Workers custom
domains. AAAA records are automatically managed by Workers routes.

#### Scenario: Custom domain routing
- **GIVEN** a Workers custom domain is configured for a worker
- **WHEN** Cloudflare provisions the route
- **THEN** it creates the necessary AAAA records automatically
- **AND** routes traffic to the corresponding worker

#### Scenario: Subdomain resolution
- **GIVEN** `studio.pavelrapoport.com` is configured as a custom domain
- **WHEN** a client resolves `studio.pavelrapoport.com`
- **THEN** DNS resolves via Workers-managed AAAA record
- **AND** traffic routes to `rapoport-studio`

### Requirement: Secrets Pipeline

Secrets SHALL flow from Infisical to Cloudflare Workers via
`wrangler secret put`. Secrets MUST NOT be stored in
`wrangler.toml` or committed to git.

#### Scenario: Deploying a new secret
- **GIVEN** a secret is added or rotated in Infisical
- **WHEN** the operator deploys the secret
- **THEN** they run `wrangler secret put <NAME>` for each worker
- **AND** the secret becomes available in the worker runtime

#### Scenario: Accessing secrets in Workers runtime
- **GIVEN** server-side code needs a secret value
- **WHEN** it accesses the secret at runtime
- **THEN** it MUST use `getCloudflareContext()` from `@opennextjs/cloudflare`
- **AND** MUST NOT use `process.env` (which is empty in Workers runtime)

### Requirement: CI/CD Pipeline

Deployment SHALL use GitHub Actions with opennextjs-cloudflare
adapter. Each app deploys independently.

#### Scenario: Production deploy
- **GIVEN** a commit is merged to `main`
- **WHEN** GitHub Actions runs the deploy workflow
- **THEN** it builds the app with opennextjs-cloudflare
- **AND** deploys via `wrangler deploy`
- **AND** the worker goes live on the configured custom domain

#### Scenario: Secrets re-application after deploy
- **GIVEN** a deploy has completed
- **WHEN** a runtime error indicates a missing secret
- **THEN** the operator MUST re-run `wrangler secret put` for affected secrets
- **AND** verify the secret is accessible via `getCloudflareContext()`

### Requirement: API Token Permissions

Cloudflare API tokens SHALL have minimum required permissions:
Workers Scripts (Edit), KV Storage (Edit), Workers Routes (Edit).

#### Scenario: Token scope validation
- **GIVEN** a CI/CD pipeline uses a Cloudflare API token
- **WHEN** the token is created or audited
- **THEN** it has permissions for Workers Scripts, KV Storage, and Workers Routes
- **AND** no broader permissions are granted

### Requirement: Known Issue — Secrets Survival

Secrets MAY NOT survive a `wrangler deploy` in all cases.
After each deploy, secrets MUST be verified and re-applied
if missing.

#### Scenario: Secret lost after deploy
- **GIVEN** a deploy has completed
- **WHEN** a runtime error indicates missing secret
- **THEN** the operator re-runs `wrangler secret put <NAME>`
- **AND** verifies the secret is accessible via `getCloudflareContext()`

### Requirement: Known Issue — Environment Variable Access

Workers runtime does NOT support `process.env`. All secret
and binding access MUST use `getCloudflareContext()` from
`@opennextjs/cloudflare`.

#### Scenario: Incorrect env access pattern
- **GIVEN** code uses `process.env.SECRET_NAME` in a Workers context
- **WHEN** the code executes at runtime
- **THEN** the value is `undefined`
- **AND** the correct pattern is `(await getCloudflareContext()).env.SECRET_NAME`

## Entities

- **Worker** — a deployed Cloudflare Worker.
  Has: name, custom domain, KV bindings, secrets, wrangler.toml path
- **KV Namespace** — a Cloudflare KV storage namespace.
  Has: name, environment (prod/preview), binding name
- **Secret** — a runtime secret injected via `wrangler secret put`.
  Has: name, source (Infisical), target workers
- **Zone** — a Cloudflare DNS zone.
  Has: zone ID, domain, managed records
- **Deploy Pipeline** — a GitHub Actions workflow that builds
  and deploys a worker.
  Has: trigger (main merge), build tool (opennextjs-cloudflare),
  deploy command (wrangler deploy)

## Dependencies

- `web` — the public site runs on `rapoport-web` worker
- `studio` — the internal dashboard runs on `rapoport-studio` worker
- `integrations` — Cloudflare is a P0 integration in the integrations registry
