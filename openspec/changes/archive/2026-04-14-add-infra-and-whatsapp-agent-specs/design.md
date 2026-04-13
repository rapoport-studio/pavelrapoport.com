## Context

The studio has two undocumented operational systems: Cloudflare infrastructure (Workers, KV, DNS, CI/CD) and a WhatsApp agent pipeline (Meta Cloud API → n8n → studio → Claude → Linear). Knowledge about configuration IDs, known issues, and operational procedures exists only in conversation history and memory. These specs formalize that knowledge into the OpenSpec domain structure.

Both are spec-only additions — no code changes, no migrations, no new dependencies.

## Goals / Non-Goals

**Goals:**
- Document Cloudflare infrastructure topology with real account/zone/worker IDs
- Document WhatsApp agent pipeline with real Meta Business IDs and n8n config
- Capture known operational issues and their workarounds
- Follow the existing OpenSpec domain spec format (Purpose, Requirements with GIVEN/WHEN/THEN, Entities, Dependencies)

**Non-Goals:**
- No code implementation — these are knowledge specs, not feature specs
- No automation of infrastructure management
- No changes to existing specs or domains
- No new database entities or API endpoints

## Decisions

### 1. Two separate domain specs, not one "ops" spec

Each system has distinct entities, dependencies, and failure modes. Combining them would create an unfocused spec that's hard to reference. Separate specs (`infra`, `whatsapp-agent`) follow the existing "one spec per domain" convention.

### 2. Include real IDs and configuration values in specs

Account IDs, zone IDs, WABA IDs, and worker names are not secrets — they're identifiers needed for operational context. Actual secrets (API tokens, webhook secrets) are referenced by name only, never by value.

### 3. Known Issues as first-class spec content

Operational knowledge about failure modes (secrets not surviving deploy, `process.env` vs `getCloudflareContext()`, n8n expression resolution) is documented alongside the architecture. This ensures agents can diagnose issues without rediscovering them.

### 4. Spec structure follows existing conventions

Both specs use the same format as `integrations/spec.md`: Purpose → Requirements (GIVEN/WHEN/THEN) → Entities → Dependencies. No new structural patterns introduced.

## Risks / Trade-offs

- **[Staleness]** Infrastructure IDs and n8n config can change → Mitigation: specs reference stable identifiers (account IDs, worker names) that rarely change. Variable config (env vars, tokens) is referenced by name.
- **[Scope creep]** These specs could grow into full runbooks → Mitigation: specs describe *what the system is* and *known issues*, not step-by-step procedures. Runbooks belong elsewhere.
- **[Config.yaml update]** The domains list in config.yaml may need `infra` and `whatsapp-agent` entries → Mitigation: check during implementation and add if needed.
